const { Banner } = require("../../models");
const {
  SUCCESS_MESSAGES,
  STATUS_CODES,
  ERROR_MESSAGES,
} = require("../../utils/constants.js");
const Response = require("../../utils/response.js");
const utils = require("../../utils/helper");
const {bannerSchema} = require("../validation/joi.validation.js");
const { Op } = require("sequelize");

module.exports = {
    createBanner: async (req, res) => {
      try {
        const { error, value } = bannerSchema.validate(req.body);
        if (error) return Response.joiErrorResponseData(res, error);
        if (req.file) {
          value.img_url = req.file.filename;
        }
        const data = await Banner.create(value);
        return Response.successResponseData(
          res,
          SUCCESS_MESSAGES.BANNER_CREATED,
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
  
    getBannerList: async (req, res) => {
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
  
        const data = await Banner.findAndCountAll(options);
        const response = utils.getPagingData(data, page, limit);
  
        return Response.successResponseData(
          res,
          SUCCESS_MESSAGES.BANNER_FETCHED,
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
  
    editBanner: async (req, res) => {
      try {
        const { id } = req.params;
        const banner = await Banner.findOne({ where: { id: id } });
  
        if (!banner) {
          return Response.errorResponseWithoutData(
            res,
            ERROR_MESSAGES.BANNER_NOT_FOUND,
            STATUS_CODES.NOT_FOUND
          );
        }
  
        return Response.successResponseData(
          res,
          SUCCESS_MESSAGES.BANNER_FETCHED,
          banner
        );
      } catch (error) {
        return Response.errorResponseWithoutData(
          res,
          error.message,
          STATUS_CODES.INTERNAL_ERROR
        );
      }
    },
  
    updateBanner: async (req, res) => {
      try {
        const { error, value } = bannerSchema.validate(req.body);
        if (error) return Response.joiErrorResponseData(res, error);
  
        const { id } = req.params;
        const [updatedRows] = await Banner.update(value, {
          where: { id },
        });
  
        if (updatedRows === 0) {
          return Response.errorResponseWithoutData(
            res,
            ERROR_MESSAGES.BANNER_NOT_FOUND,
            STATUS_CODES.NOT_FOUND
          );
        }
  
        return Response.successResponseWithoutData(
          res,
          SUCCESS_MESSAGES.BANNER_UPDATED
        );
      } catch (error) {
        return Response.errorResponseWithoutData(
          res,
          error.message,
          STATUS_CODES.INTERNAL_ERROR
        );
      }
    },
  
    deleteBanner: async (req, res) => {
      try {
        const { id } = req.params;
        const deletedRows = await Banner.destroy({ where: { id: id } });
  
        if (deletedRows === 0) {
          return Response.errorResponseWithoutData(
            res,
            ERROR_MESSAGES.NO_BANNER_FOUND,
            STATUS_CODES.NOT_FOUND
          );
        }
  
        return Response.successResponseWithoutData(
          res,
          SUCCESS_MESSAGES.BANNER_DELETED
        );
      } catch (error) {
        return Response.errorResponseWithoutData(
          res,
          error.message,
          STATUS_CODES.INTERNAL_ERROR
        );
      }
    },
  
    getAllBanner: async (req, res) => {
      try {
        const banner = await Banner.findAll();
        if (!banner || banner.length === 0) {
          return Response.errorResponseWithoutData(
            res,
            ERROR_MESSAGES.NO_BANNER_FOUND,
            STATUS_CODES.NOT_FOUND
          );
        }
        return Response.successResponseData(
          res,
          SUCCESS_MESSAGES.BANNER_FETCHED,
          banner
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
  
