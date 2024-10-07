const { User, OTP } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  FORGOT_PASSWORD,
  ERROR_MESSAGES,
  STATUS_CODES,
  SUCCESS_MESSAGES,
  ACTIVE
} = require("../../utils/constants.js");
const Response = require("../../utils/response.js");
const utils = require("../../utils/helper.js");

const {
  userSignUpSchema,
  loginSchema,
  userForgotPasswordSchema,
  userResetPasswordSchema,
  verifyOTPSchema,
  sendOTPSchema,
  userPersonalDetailsSchema
} = require("../validation/joi.validation.js");

module.exports = {
  sendOTP: async (req, res, next) => {
    try {
      const { value, error } = sendOTPSchema.validate(req.body);
      if (error) return Response.joiErrorResponseData(res, error);
      const { phone_number } = value;
      let user = await User.findOne({
        where: { phone_number: phone_number },
        attributes: ["id", "phone_number"],
      });

      let purpose;
      let newUser;

      if (!user) {
        newUser = await User.create({
          phone_number,
        });
        const token = jwt.sign(
          { id: newUser.id, phone_number: newUser.phone_number },
          process.env.SECRET,
          { expiresIn: "365d" }
        );
        await User.update({ token: token }, { where: { id: newUser.id } });
        purpose = "SIGNUP";
      } else {
        purpose = "LOGIN";
      }
      // for dynamic otp
      // const random_number = Math.floor(Math.random() * 9000) + 1000;
      const random_number = 112233;
      const data = {
        user_id: user ? user.id : newUser.id,
        otp: random_number,
        type: purpose,
        is_read: false,
      };

      await OTP.create(data);

      // await utils.sendSMS(phone_number, `Your OTP for ${purpose} is: ${random_number}`);

      let message =
        purpose === "LOGIN"
          ? SUCCESS_MESSAGES.OTP_SENT_LOGIN
          : SUCCESS_MESSAGES.OTP_SENT_SIGNUP;

      return Response.successResponseWithoutData(res, message);
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  },

  verifyOTP: async (req, res, next) => {
    try {
      const { value, error } = verifyOTPSchema.validate(req.body);
      if (error) return Response.joiErrorResponseData(res, error);

      const user = await User.findOne({
        where: { phone_number: value.phone_number },
        attributes: ["id", "phone_number"],
      });
      if (!user)
        return Response.errorResponseWithoutData(
          res,
          ERROR_MESSAGES.phone_number_NOT_FOUND,
          STATUS_CODES.BAD_REQUEST
        );

      const otpRecord = await OTP.findOne({
        where: { otp: value.otp, is_read: false, user_id: user.id },
      });

      if (!otpRecord)
        return Response.errorResponseWithoutData(
          res,
          ERROR_MESSAGES.INVAILD_OTP,
          STATUS_CODES.BAD_REQUEST
        );

      // otpRecord.is_read = true;
      await otpRecord.save();

      return Response.successResponseWithoutData(
        res,
        SUCCESS_MESSAGES.OTP_VERIFIED
      );
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  },

  addPersonalDetails: async (req, res, next) => {
    try {
      const { value, error } = userPersonalDetailsSchema.validate(req.body);
      if (error) return Response.joiErrorResponseData(res, error);
  
      const existingUser = await User.findOne({
        where: { phone_number: value.phone_number },
      });
  
      if (!existingUser) {
        return Response.errorResponseWithoutData(
          res,
          ERROR_MESSAGES.USER_NOT_FOUND,
          STATUS_CODES.NOT_FOUND
        );
      }
  
      await User.update(
        { 
          name: value.name,
          email: value.email,
          status: ACTIVE
        },
        { where: { id: existingUser.id } }
      );
  
      const updatedUser = await User.findOne({
        where: { id: existingUser.id },
      });
  
      const responseData = {
        message: SUCCESS_MESSAGES.USER_UPDATED,
        data: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone_number: updatedUser.phone_number,
          token: updatedUser.token,
          status: updatedUser.status,
        },
      };
      return res.status(STATUS_CODES.OK).json(responseData);
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  },
  forgotPassword: async (req, res, next) => {
    try {
      const { value, error } = userForgotPasswordSchema.validate(req.body);
      if (error) return Response.joiErrorResponseData(res, error);

      const user = await User.findOne({
        where: { email: value.email },
        attributes: ["id", "email"],
      });

      if (!user)
        return Response.errorResponseWithoutData(
          res,
          ERROR_MESSAGES.EMAIL_NOT_FOUND,
          STATUS_CODES.BAD_REQUEST
        );
      const random_number = Math.floor(Math.random() * 9000) + 1000;
      const data = {
        user_id: user.id,
        otp: random_number,
        type: "FORGOT_PASSWORD",
        is_read: false,
      };

      await OTP.create(data);
      await utils.sendMail(user, FORGOT_PASSWORD, random_number);

      return Response.successResponseWithoutData(
        res,
        SUCCESS_MESSAGES.OTP_SEND
      );
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { value, error } = userResetPasswordSchema.validate(req.body);
      if (error) return Response.joiErrorResponseData(res, error);

      if (value.new_password !== value.confirm_password)
        return Response.errorResponseWithoutData(
          res,
          ERROR_MESSAGES.PASSWORD_NOT_MATCH,
          STATUS_CODES.BAD_REQUEST
        );
      const user = await User.findOne({
        where: { email: value.email },
        attributes: ["id", "email"],
      });
      if (!user)
        return Response.errorResponseWithoutData(
          res,
          ERROR_MESSAGES.EMAIL_NOT_FOUND,
          STATUS_CODES.BAD_REQUEST
        );

      const otpRecord = await OTP.findOne({
        where: {
          otp: value.otp,
          type: FORGOT_PASSWORD,
          is_read: true,
          user_id: user.id,
        },
        attributes: ["id", "otp", "user_id"],
      });

      if (!otpRecord)
        return Response.errorResponseWithoutData(
          res,
          ERROR_MESSAGES.INVAILD_OTP,
          STATUS_CODES.BAD_REQUEST
        );

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(value.new_password, salt);

      await User.update(
        { password: hash },
        { where: { id: otpRecord.user_id } }
      );
      return Response.successResponseWithoutData(
        res,
        SUCCESS_MESSAGES.PASSWORD_UPDATE
      );
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  },
};
