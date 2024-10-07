const { User, Category, Product } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const utils = require("../../utils/helper");
const { Op } = require("sequelize");
const { SUSPENDED } = require("../../utils/constants");
const path = require("path");
const fs = require("fs");

module.exports = {
  getUserList: async (req, res, next) => {
    try {
      const { page, limit, search_text, message, error, formValue } = req.query;
      let options = {
        distinct: true,
        offset: page * limit,
        limit: limit,
        order: [["id", "DESC"]],
        where: {},
      };
      if (search_text) {
        options.where = { name: { [Op.like]: "%" + search_text + "%" } };
      }
      let data = await User.findAndCountAll(options);
      let response = utils.getPagingData(res, data, page + 1, limit);
      return res.render("admin/user/user.list.ejs", {
        message,
        error,
        formValue,
        totalItems: response.totalItems,
        items: response.items,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        search_text: search_text,
        active: 2
      });
    } catch (err) {
      next(err);
    }
  },

  getUserProductDetails: async (req, res, next) => {
    try {
      const { page, limit, search_text, message, error, formValue } = req.query;
      let options = {
        distinct: true,
        offset: page * limit,
        limit: limit,
        order: [["id", "DESC"]],
        where: {
          user_id: req.params.id,
        },
        include: [
          {
            model: Category,
            attributes: ["name"],
          },
        ],
      };
      if (search_text) {
        options.where[Op.or] = [{ name: { [Op.like]: "%" + search_text + "%" } }];
      }

      let data = await Product.findAndCountAll(options);
      let response = utils.getPagingData(res, data, page + 1, limit);
      return res.render("admin/user/user.product.list.ejs", {
        message,
        error,
        formValue,
        totalItems: response.totalItems,
        items: response.items,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        search_text: search_text,
        active: 2
      });
    } catch (err) {
      next(err);
    }
  },

  editUser: async (req, res, next) => {
    try {
      const { error, message, formValue } = req.query;
      const data = await User.findOne({ where: { id: req.params.id } });
      res.render("admin/user/edit.user.ejs", {
        data: data,
        error,
        message,
        formValue,
        active: 2
      });
    } catch (err) {
      next(err);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const {
        name,
        email,
        password,
        gender,
        city,
        country,
        phone_number,
        status,
      } = req.body;

      const user = await User.findOne({
        where: { id: userId },
      });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      if (name) {
        user.name = name.trim();
      }
      if (email) {
        user.email = email;
      }
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        user.password = hash;
      }
      if (gender) {
        user.gender = gender;
      }
      if (city) {
        user.city = city;
      }
      if (country) {
        user.country = country;
      }
      if (phone_number) {
        user.phone_number = phone_number;
      }
      if (status) {
        user.status = status;
      }
      if (req.file) {
        user.profile_picture = req.file.filename;
      }
      await user.save();
      req.success = "Successfully Updated.";
      next("last");
    } catch (err) {
      next(err);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const data = await User.destroy({ where: { id: req.params.id } });
      next("last");
    } catch (err) {
      next(err);
    }
  },

  blockUser: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("user not found.");
      }
      if (user.status === SUSPENDED) {
        throw new Error("User Account Already Suspended !!");
      }
      const blockUser = await User.update(
        { status: SUSPENDED },
        { where: { id: userId } }
      );
      req.success = "User Account Suspended Successfully";
      next("last");
    } catch (err) {
      next(err);
    }
  },

  editUserProduct: async (req, res, next) => {
    try {
      const { error, message, formValue } = req.query;
      const data = await Product.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: Category,
            attributes: ["name"],
          },
        ],
      });
      const category = await Category.findAll();
      return res.render("admin/user/edit.product.ejs", {
        data: data,
        error,
        message,
        formValue,
        category,
        active: 2
      });
    } catch (err) {
      next(err);
    }
  },
  updateUserProduct: async (req, res, next) => {
    try {
      const productId = req.params.id;
      const product = await Product.findOne({
        where: { id: productId },
        include: [
          {
            model: Category,
            attributes: ["name"],
          },
        ],
      });

      if (!product) {
        throw new Error("Product not found!!");
      }

      const {
        product_name,
        category_id,
        warranty_provider_name,
        warranty_contact_person_name,
        warranty_contact_person_number,
        shop_location,
        purchase_date,
        warranty_start_date,
        warranty_end_date,
        notes,
        status,
      } = req.body;

      // Update the product fields
      if (product_name) product.product_name = product_name;
      if (category_id) product.category_id = category_id;
      if (warranty_provider_name) product.warranty_provider_name = warranty_provider_name;
      if (warranty_contact_person_name) product.warranty_contact_person_name = warranty_contact_person_name;
      if (warranty_contact_person_number) product.warranty_contact_person_number = warranty_contact_person_number;
      if (shop_location) product.shop_location = shop_location;
      if (purchase_date) product.purchase_date = new Date(purchase_date);
      if (warranty_start_date) product.warranty_start_date = new Date(warranty_start_date);
      if (warranty_end_date) product.warranty_end_date = new Date(warranty_end_date);
      if (notes) product.notes = notes;
      if (req.files) {
        if (req.files.product_picture) {
          const pictureFile = req.files.product_picture[0];
          product.product_picture = `${pictureFile.filename}`;
        }
        if (req.files.invoice) {
          const pictureFile = req.files.invoice[0];
          product.invoice = `${pictureFile.filename}`;
        }
        if (req.files.shop_picture) {
          const shopPictureFile = req.files.shop_picture[0];
          product.shop_picture = `${shopPictureFile.filename}`;
        }
      }
      await product.save();
      req.success = "Product updated successfully";
      next("last");
    } catch (err) {
      next(err);
    }
  },

  deleteUserProduct: async (req, res, next) => {
    try {
      const data = await User.destroy({ where: { id: req.params.id } });
      next("last");
    } catch (err) {
      next(err);
    }
  }
};
