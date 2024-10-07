const { Category_Shop_Service_Item } = require("../../models");
const utils = require("../../utils/helper");
const { Op } = require("sequelize");
const Joi = require("joi");
const { categorySchema,createCategoryShopServiceSchema } = require("../validation/joi.validation");
const {
  SUCCESS_MESSAGES,
  STATUS_CODES,
  ERROR_MESSAGES,
} = require("../../utils/constants.js");
const Response = require("../../utils/response.js");

module.exports = {
  createCategoryShopServiceItem: async (req, res) => {
    try {
      const { error, value } = createCategoryShopServiceSchema.validate(req.body);
      if (error) return Response.joiErrorResponseData(res, error);
      const data = await Category_Shop_Service_Item.create(value);
      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES.CATEGORY_SHOP_SERVICE_ITEM_CREATED,
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

  getCategoryShopServiceItemList: async (req, res) => {
    try {
      const { page = 0, limit = 10, search_text } = req.query;
      let options = {
        distinct: true,
        offset: page * limit,
        limit: parseInt(limit),
        order: [["id", "DESC"]],
        where: {category_shop_id:req.params.id},
      };
      if (search_text) {
        options.where = { name: { [Op.like]: `%${search_text}%` } };
      }
      const data = await Category_Shop_Service_Item.findAndCountAll(options);
      const response = utils.getPagingData(data, page, limit);
      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES.CATEGORIES_SHOP_SERVICE_FETCHED,
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
