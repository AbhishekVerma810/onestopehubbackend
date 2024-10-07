var nodemailer = require("nodemailer");
const {
  VERIFY_EMAIL,
  FORGOT_PASSWORD,
  FEEDBACK_CREATED,
} = require("./constants");
const FCM = require("fcm-node");
var fcm = new FCM(process.env.SERVER_KEY);
const { User,Notification } = require("../models");

const ejs = require("ejs");
var path = require("path");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVICE_HOST,
  port: process.env.SMTP_SERVICE_PORT,
  secure: process.env.SEND_EMAIL,
  auth: {
    user: process.env.SMTP_USER_NAME,
    pass: process.env.SMTP_USER_PASSWORD,
  },
});

module.exports = {
  adminError(message) {
    console.log(err);
    req.flash("formValue", req.body);
    req.flash("error", res.locals.__(err.message));
    return res.redirect(req.header("Referer"));
  },
  getPagingData(data, page, limit) {
    const { count: totalItems, rows: items } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, items, totalPages, currentPage };
  },
  getcookieAdmin(req) {
    var cookie = req.cookies;
    if (cookie) {
      if (Object.keys(cookie).includes("dd-token")) {
        return cookie["dd-token"];
      } else {
        return false;
      }
    }
  },
  async sendMail(data, template_key, otp) {
    let template;
    let subject;

    if (template_key === FORGOT_PASSWORD) {
      subject = "Forgot password otp";
      template = await ejs.renderFile(
        path.join(__dirname, "../views/admin/email/forgot.password.ejs"),
        {
          name: data.name,
          otp: otp,
        }
      );
    }
    if (template_key === FEEDBACK_CREATED) {
      subject = "Feedback";
      template = await ejs.renderFile(
        path.join(__dirname, "../views/admin/email/feedback.ejs"),
        {
          name: data.name,
        }
      );
    }
    let adminEmail = data.email;
    let result = transporter
      .sendMail({
        to: adminEmail,
        from: "Damaanati App",
        subject: subject,
        html: template,
      })
      .then(() => {
        console.log("Mail send successfully.");
      })
      .catch((err) => console.log("Mail Error = ", err.message));
  },
  deleteOldPicture(filename) {
    const filePath = path.join(__dirname, "../public/upload", filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("Old profile picture deleted successfully");
      }
    });
  },
  async sendNotificationsBatch(notifications) {
    await Promise.all(notifications.map(notification => this.sendNotification(notification)));
  },

  async sendNotification({ userId, fcmToken, productId, daysLeft, productName }) {
    try {
      const notification = {
        title: "Warranty Reminder",
        content: `Your product ${productName} warranty ends in ${daysLeft} days.`,
        user_id: userId,
        notification_type: "warranty_reminder",
        product_id: productId,
      };

      await Notification.create(notification);
      await this.pushNotification(notification, fcmToken);
      return true;
    } catch (error) {
      console.error("Error in sendNotification:", error);
      return false;
    }
  },

  pushNotification(notification, firebaseToken) {
    const message = {
      to: firebaseToken,
      notification: {
        title: notification.title,
        body: notification.content,
        click_action: "IONIC_NOTIFICATION_CLICK",
      },
      data: {
        profile_id: notification.user_id.toString(),
        notification_type: notification.notification_type,
        product_id: notification.product_id.toString(),
      },
      priority: "high",
    };

    return new Promise((resolve, reject) => {
      fcm.send(message, function (err, response) {
        if (err) {
          console.error("Error sending push notification:", err);
          reject(err);
        } else {
          console.log("Successfully sent with response: ", response);
          resolve(response);
        }
      });
    });
  }


};
