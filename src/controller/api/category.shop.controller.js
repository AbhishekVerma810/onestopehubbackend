const { Category_Shop } = require("../../models");
const utils = require("../../utils/helper");
const { Op } = require("sequelize");
const Joi = require("joi");
const { categorySchema,createCategoryShopSchema } = require("../validation/joi.validation");
const {
  SUCCESS_MESSAGES,
  STATUS_CODES,
  ERROR_MESSAGES,
} = require("../../utils/constants.js");
const Response = require("../../utils/response.js");

module.exports = {
  createCategoryShop: async (req, res) => {
    try {
      const { error, value } = createCategoryShopSchema.validate(req.body);
      if (error) return Response.joiErrorResponseData(res, error);
      if (req.file) {
        value.img_url = req.file.filename;
      }
      const data = await Category_Shop.create(value);
      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES.CATEGORY_SHOP_CREATED,
        data
      );
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  },
  getCategoryShopList: async (req, res) => {
    try {
      const { page = 0, limit = 10, search_text } = req.query;
      let options = {
        distinct: true,
        offset: page * limit,
        limit: parseInt(limit),
        order: [["id", "DESC"]],
        where: {},
      };
      if (search_text) {
        options.where = { name: { [Op.like]: `%${search_text}%` } };
      }
      const data = await Category_Shop.findAndCountAll(options);
      const response = utils.getPagingData(data, page, limit);
      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES.CATEGORIES_SHOP_FETCHED,
        response
      );
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  },
  getParticularCategoryShopList: async (req, res) => {
    try {
      const { page = 0, limit = 10, search_text } = req.query;
      let options = {
        distinct: true,
        offset: page * limit,
        limit: parseInt(limit),
        order: [["id", "DESC"]],
        where: {category_id:req.params.id},
      };
      if (search_text) {
        options.where = { name: { [Op.like]: `%${search_text}%` } };
      }
      const data = await Category_Shop.findAndCountAll(options);
      const response = utils.getPagingData(data, page, limit);
      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES.CATEGORIES_SHOP_FETCHED,
        response
      );
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  }
};
