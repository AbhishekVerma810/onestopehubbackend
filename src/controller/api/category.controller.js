const { Category } = require("../../models");
const utils = require("../../utils/helper");
const { Op } = require("sequelize");
const Joi = require("joi");
const { categorySchema } = require("../validation/joi.validation");
const {
  SUCCESS_MESSAGES,
  STATUS_CODES,
  ERROR_MESSAGES,
} = require("../../utils/constants.js");
const Response = require("../../utils/response.js");

module.exports = {
  createCategory: async (req, res) => {
    try {
      const { error, value } = categorySchema.validate(req.body);
      if (error) return Response.joiErrorResponseData(res, error);
      if (req.file) {
        value.img_url = req.file.filename;
      }
      const data = await Category.create(value);
      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES.CATEGORY_CREATED,
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

  getCategoryList: async (req, res) => {
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

      const data = await Category.findAndCountAll(options);
      const response = utils.getPagingData(data, page, limit);

      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES.CATEGORIES_FETCHED,
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
