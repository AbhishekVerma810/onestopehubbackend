const { User, Feedback, FAQ } = require("../../models");
const {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  STATUS_CODES,
  FEEDBACK_CREATED
} = require("../../utils/constants");
const utils = require("../../utils/helper.js");
const Response = require("../../utils/response.js");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const {
  updatePasswordSchema,
  feedbackSchema,
} = require("../validation/joi.validation.js");
const {
  successResponseData,
  errorResponseWithoutData,
} = require("../../utils/response");

exports.profileDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let user = await User.findByPk(userId);

    if (!user) {
      return Response.errorResponseWithoutData(
        res,
        ERROR_MESSAGES.USER_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }

    user = {
      ...user.dataValues,
      profile_picture: user.getFullProfilePictureUrl(),
    };

    return Response.successResponseData(res, SUCCESS_MESSAGES.USER_FETCH, user);
  } catch (error) {
    return Response.errorResponseWithoutData(
      res,
      error.message,
      STATUS_CODES.INTERNAL_ERROR
    );
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return Response.errorResponseWithoutData(
        res,
        ERROR_MESSAGES.USER_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }

    if (req.file) {
      if (user.profile_picture) {
        try {
          await utils.deleteOldPicture(user.profile_picture);
        } catch (deleteError) {
          return Response.errorResponseWithoutData(
            res,
            ERROR_MESSAGES.FILENOTDELETED,
            STATUS_CODES.NOT_FOUND
          );
        }
      }
      updatedData.profile_picture = req.file.filename;
    }

    const [updatedRowsCount] = await User.update(updatedData, {
      where: { id: userId },
    });

    if (updatedRowsCount === 0) {
      return Response.errorResponseWithoutData(
        res,
        ERROR_MESSAGES.USER_NOT_UPDATED,
        STATUS_CODES.BAD_REQUEST
      );
    }

    const updatedUser = await User.findByPk(userId);
    return Response.successResponseData(
      res,
      SUCCESS_MESSAGES.USER_UPDATED,
      updatedUser
    );
  } catch (error) {
    return Response.errorResponseWithoutData(
      res,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODES.INTERNAL_ERROR
    );
  }
};


exports.deleteUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return Response.errorResponseWithoutData(
        res,
        ERROR_MESSAGES.USER_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }

    if (user.profile_picture) {
      deleteOldProfilePicture(user.profile_picture);
    }

    const deleted = await User.destroy({
      where: { id: userId },
    });

    if (!deleted) {
      return Response.errorResponseWithoutData(
        res,
        ERROR_MESSAGES.CLIENT_ERROR,
        STATUS_CODES.BAD_REQUEST
      );
    }

    return Response.successResponseWithoutData(
      res,
      SUCCESS_MESSAGES.USER_DELETED
    );
  } catch (error) {
    return Response.errorResponseWithoutData(
      res,
      error.message,
      STATUS_CODES.INTERNAL_ERROR
    );
  }
};

exports.changeEmail = async (req, res, next) => {
  try {
    const { newEmail } = req.body;

    if (!newEmail) {
      return Response.errorResponseWithoutData(
        res,
        ERROR_MESSAGES.NEW_EMAIL_REQUIRED,
        STATUS_CODES.BAD_REQUEST
      );
    }

    const userId = req?.user?.id;
    const user = await User.findByPk(userId, {
      attributes: ["id", "email"],
    });

    if (!user) {
      return Response.errorResponseWithoutData(
        res,
        ERROR_MESSAGES.USER_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }

    if (user.email === newEmail) {
      return Response.errorResponseWithoutData(
        res,
        ERROR_MESSAGES.EMAIL_ALREADY_IN_USE,
        STATUS_CODES.BAD_REQUEST
      );
    }

    user.email = newEmail;
    await user.save();

    return Response.successResponseData(res, SUCCESS_MESSAGES.EMAIL_UPDATED, {
      email: user.email,
    });
  } catch (err) {
    console.error('Error in changeEmail:', err);
    return Response.errorResponseWithoutData(
      res,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { value, error } = updatePasswordSchema.validate(req.body);
    if (error) {
      return Response.errorResponseWithoutData(
        res,
        error.details[0].message,
        STATUS_CODES.BAD_REQUEST
      );
    }
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "password"],
    });

    if (!user) {
      return Response.errorResponseWithoutData(
        res,
        ERROR_MESSAGES.USER_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }

    const isMatch = await bcrypt.compare(value.oldPassword, user.password);
    if (!isMatch) {
      return Response.errorResponseWithoutData(
        res,
        ERROR_MESSAGES.INCORRECT_OLD_PASSWORD,
        STATUS_CODES.BAD_REQUEST
      );
    }

    const newHashPassword = await bcrypt.hash(value.newPassword, 10);
    user.password = newHashPassword;
    await user.save();

    return Response.successResponseWithoutData(
      res,
      SUCCESS_MESSAGES.PASSWORD_UPDATED,
      STATUS_CODES.OK
    );
  } catch (err) {
    return Response.errorResponseWithoutData(
      res,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};
exports.createFeedback = async (req, res) => {
  try {
    const { error, value } = feedbackSchema.validate(req.body);
    if (error) {
      return errorResponseWithoutData(
        res,
        error.details[0].message,
        STATUS_CODES.BAD_REQUEST
      );
    }
    const feedback = await Feedback.create({
      email: value.email,
      feedback_text: value.feedback_text,
    });
    // await utils.sendMail(value.email, FEEDBACK_CREATED);
    return successResponseData(
      res,
      SUCCESS_MESSAGES.FEEDBACK_CREATED,
      feedback
    );
  } catch (error) {
    return errorResponseWithoutData(
      res,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODES.INTERNAL_ERROR
    );
  }
};
exports.getAllFaq = async (req, res, next) => {
  try {
    const faq = await FAQ.findAll({
      attributes: ["id", "question","answer"]
    });

    if (!faq || faq.length === 0) {
      return Response.errorResponseWithoutData(
        res,
        ERROR_MESSAGES.NO_FAQ_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }
    return Response.successResponseData(res, SUCCESS_MESSAGES.FAQ_FETCHED, faq);
  } catch (error) {
    return Response.errorResponseWithoutData(
      res,
      error.message,
      STATUS_CODES.INTERNAL_ERROR
    );
  }
};
