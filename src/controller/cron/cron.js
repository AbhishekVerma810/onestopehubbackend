
const cron = require("node-cron");
const { Product, User } = require('../../models');
const utils = require("../../utils/helper");
const { Op } = require("sequelize");
// this cron job will run daily at 12:00 AM
const cronJob = cron.schedule("0 0 * * *", async () => {
    const notificationsSent = await sendNotificationJOB();
    if (notificationsSent) {
        cronJob.stop();
    } else {
        console.log("No notifications sent. Cron job will run again next time.");
    }
});

async function sendNotificationJOB() {
    const today = new Date();
    let notificationsSent = false;
    const batchSize = 99;
    let offset = 0;

    try {
        while (true) {
            const users = await User.findAll({
                attributes: ['id', 'name', 'days', 'fcm_token'],
                where: {
                    days: { [Op.not]: null },
                    fcm_token: { [Op.not]: null }
                },
                include: [{
                    model: Product,
                    as: "Products",
                    attributes: ['id', 'product_name', 'warranty_end_date'],
                    where: {
                        warranty_end_date: { [Op.gte]: today }
                    }
                }],
                limit: batchSize,
                offset: offset
            });

            if (users.length === 0) {
                break; 
            }

            const notifications = [];
            for (const user of users) {
                for (const product of user.Products) {
                    const warrantyEndDate = new Date(product.warranty_end_date);
                    const daysLeft = Math.ceil((warrantyEndDate - today) / (1000 * 60 * 60 * 24));

                    if (user.days >= daysLeft) {
                        notifications.push({
                            userId: user.id,
                            fcmToken: user.fcm_token,
                            productId: product.id,
                            daysLeft,
                            productName: product.product_name
                        });
                    }
                }
            }

            if (notifications.length > 0) {
                await utils.sendNotificationsBatch(notifications);
                notificationsSent = true;
            }

            offset += batchSize;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (error) {
        console.error("Error in sendNotificationJOB:", error);
    }
    return notificationsSent;
}

module.exports = {
    sendNotificationJOB
};
