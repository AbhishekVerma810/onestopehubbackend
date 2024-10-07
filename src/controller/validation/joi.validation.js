const Joi = require("joi");

const loginSchema = Joi.object({
  phone_number: Joi.string()
    .length(10) // Assuming 10-digit phone numbers
    .pattern(/^[0-9]+$/) // Only numbers allowed
    .required()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().trim().min(1).max(255).required(),
  description: Joi.string().min(1).max(255).required(),
  img_url:Joi.string().min(1).max(255).required(),
});

const categorySchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  img_url: Joi.string().optional()
});
const createCategoryShopSchema = Joi.object({
  category_id:Joi.string().optional(),
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().optional(),
  img_url: Joi.string().optional(),
  address:Joi.string().optional(),
  street:Joi.string().optional(),
  price: Joi.string().optional(),
  distance:Joi.string().optional()
});
const createCategoryShopServiceSchema = Joi.object({
  category_shop_id:Joi.string().optional(),
  name: Joi.string().min(1).max(255).required()
});


const bannerSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(1).max(255).required(),
  img_url: Joi.string().optional()
});

const faqSchema = Joi.object({
  question: Joi.string().min(1).max(500).required(),
  answer: Joi.string().min(1).max(500).required(),
});

const createAdSchema = Joi.object({
  ad_link: Joi.string().min(1).max(255).required(),
});

const resetPasswordSchema = Joi.object({
  new_password: Joi.string().min(6).max(20).required(),
  confirm_password: Joi.string().min(6).max(20).required(),
  otp: Joi.string().min(1).max(4).required(),
});

const userSignUpSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  gender: Joi.string().min(1).max(40).required(),
  city: Joi.string().min(1).max(100).required(),
  country: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().min(1).max(255).required(),
  password: Joi.string().min(6).max(20).required(),
  phone_number: Joi.string().optional().allow(null, ""),
  fcm_token: Joi.string().allow(null, ""),
});

const userForgotPasswordSchema = Joi.object({
  email: Joi.string().email().min(1).max(255).required(),
});

const verifyOTPSchema = Joi.object({
  phone_number: Joi.string().min(1).max(15).required(),
  otp: Joi.string().min(1).max(6).required(),
});
const sendOTPSchema = Joi.object({
  phone_number: Joi.string().min(1).max(15).required(),
 });
 const userPersonalDetailsSchema = Joi.object({
  phone_number: Joi.string().min(1).max(15).required(),
  otp: Joi.string().min(1).max(15).required(),
  name: Joi.string().min(1).max(255).required(),
  email: Joi.string().min(1).max(255).required(),
});
 
const userResetPasswordSchema = Joi.object({
  otp: Joi.string().min(4).max(4).required(),
  email: Joi.string().email().min(1).max(255).required(),
  new_password: Joi.string().min(6).max(20).required(),
  confirm_password: Joi.string().min(6).max(20).required(),
});

const addProductSchema = Joi.object({
  category_id: Joi.string().min(1).max(255).required(),
  product_name: Joi.string().min(1).max(255).required(),
  product_picture: Joi.string().optional().allow(null, ""),
  invoice: Joi.string().allow(null, ""),
  notes: Joi.string().min(1).max(255).required(),
  purchase_date: Joi.string().optional().allow(null, ""),
  warranty_start_date: Joi.string().min(1).max(255).required(),
  warranty_end_date: Joi.string().min(1).max(255).required(),
  warranty_contact_person_name: Joi.string().min(1).max(255).required(),
  warranty_contact_person_number: Joi.string().min(1).max(255).required(),
  shop_location: Joi.string().min(1).max(255).required(),
  shop_picture: Joi.string().allow(null, ""),
  shop_name: Joi.string().min(1).max(255).required(),
  time_period: Joi.string().min(1).max(255).required(),
});

const addRemainderSchema = Joi.object({
  user_id: Joi.string().min(1).max(255).required(),
  product_id: Joi.string().min(1).max(255).required(),
  category_id: Joi.string().min(1).max(255).required(),
  reminder_period: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').min(1).max(255).required(),
  reminder_repetition: Joi.string().min(1).max(255).required(),
});

const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).max(255).required(),
  newPassword: Joi.string().min(6).max(255).required().disallow(Joi.ref('oldPassword'))
    .messages({
      'any.invalid': 'New password must be different from the old password',
    }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
    .messages({
      'any.only': 'Confirm password must match the new password',
    }),
});

const feedbackSchema = Joi.object({
  email:Joi.string().email().min(1).max(255).required(),
  feedback_text: Joi.string().min(1).max(500).required(),
});

const categoryIDSchema = Joi.object({
  category_id: Joi.string().min(1).max(255).required(),
});

module.exports = {
  loginSchema,
  sendOTPSchema,
  forgotPasswordSchema,
  categorySchema,
  faqSchema,
  createAdSchema,
  resetPasswordSchema,
  userSignUpSchema,
  userForgotPasswordSchema,
  userResetPasswordSchema,
  addProductSchema,
  addRemainderSchema,
  updatePasswordSchema,
  feedbackSchema,
  verifyOTPSchema,
  categoryIDSchema,
  createCategoryShopSchema,
  bannerSchema,
  userPersonalDetailsSchema,
  createCategoryShopServiceSchema
};
