const { Admin, OTP } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { loginSchema, forgotPasswordSchema, resetPasswordSchema } = require("../validation/joi.validation");
const { FORGOT_PASSWORD } = require("../../utils/constants");
const utils = require("../../utils/helper");

module.exports = {
  getLogin: async (req, res, next) => {
    try {
      const { message, error, formValue } = req.query;
      return res.render("admin/auth/login.ejs", { message, error, formValue });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
      }
      const { email, password } = value;

      const admin = await Admin.findOne({
        where: { email: email },
      });
      if (!admin) {
        throw new Error("Invalid user name.");
      }
      let result = await bcrypt.compare(password, admin.password);
      if (result) {
        let token = jwt.sign(
          { id: admin.id, email: admin.email },
          process.env.SECRET,
          { expiresIn: "365d" }
        );
        console.log("token", token);
        await Admin.update({ token: token }, { where: { id: admin.id } });
        res.cookie("dd-token", token, { maxAge: 1000 * 60 * 60 * 24 * 365 });
        return res.redirect("/admin/dashboard");
      } else {
        throw new Error("Invalid password.");
      }
    } catch (err) {
      next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      res.clearCookie("dd-token");
      req.success = "Successfully Logout";
      next("last");
    } catch (err) {
      next(err);
    }
  },

  getForgotPassword: async (req, res, next) => {
    try {
      const { message, error, formValue } = req.query;
      return res.render("admin/auth/forgot.password.ejs", {
        message,
        error,
        formValue
      });
    } catch (err) {
      next(err);
    }
  },

  adminForgotPassword: async (req, res, next) => {
    try {
      const { error, value } = forgotPasswordSchema.validate(req.body);
      if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
      }
      const { email } = value;
      const admin = await Admin.findOne({
        where: { email: email.trim() },
      });
      if (admin) {
        const random_number = (
          Math.floor(Math.random() * 1000000 + 1) + 100000
        ).toString();

        const data = {
          user_id: admin.id,
          otp: random_number,
          type: FORGOT_PASSWORD,
          status: false,
        };
        await OTP.create(data);
        await utils.sendMail(admin, FORGOT_PASSWORD, random_number);
        req.flash("success", "successfully send otp on mail.");
        return res.redirect("/admin/auth/reset-password");
      } else {
        throw new Error("Email does not exist.");
      }
    } catch (err) {
      next(err);
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { error, message, formValue } = req.query;
      return res.render("admin/auth/reset.password.ejs", {
        error,
        message,
        formValue
      });
    } catch (err) {
      next(err);
    }
  },

  adminResetPassword: async (req, res, next) => {
    try {
      const { error, value } = resetPasswordSchema.validate(req.body);
      if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
      }

      const { new_password, confirm_password, otp } = value;

      if (new_password !== confirm_password) {
        throw new Error("New password and confirm password do not match.");
      }

      const otpRecord = await OTP.findOne({
        where: {
          otp,
          type: "FORGOT_PASSWORD",
          status: false,
        },
      });

      if (!otpRecord) {
        throw new Error("Invalid OTP");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(new_password, salt);

      await Admin.update(
        { password: hashedPassword },
        { where: { id: otpRecord.user_id } }
      );

      otpRecord.status = true;
      await otpRecord.save();
      req.flash('success', 'Password updated successfully.');
      res.redirect('/admin/auth/login');
    } catch (err) {
      next(err);
    }
  },

  switchLanguage: async (req, res, next) => {
    const { language } = req.body;
    try {
      const data = await Admin.update(
        {
          lang_key: language,
        },
        {
          where: {
            id: 1,
          },
        }
      );
      return res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }
};