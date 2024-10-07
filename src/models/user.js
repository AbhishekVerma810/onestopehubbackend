"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    getFullProfilePictureUrl() {
      const image = this.getDataValue('profile_picture');
      if (image) {
        return `${process.env.BACKEND_URL}public/upload/${image}`;
      }
      return null;
    }
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    gender: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    password: DataTypes.STRING,
    fcm_token: DataTypes.STRING,
    profile_picture:{
      type: DataTypes.STRING,
      // get() {
      //   const image = this.getDataValue('profile_picture');
      //   if (image) {
      //     return `${process.env.BACKEND_URL}public/upload/${image}`;
      //   }
      //   return null;
      // }
    },
    token: DataTypes.STRING,
    status: DataTypes.STRING,
    email_verify_token: DataTypes.STRING,
    email_verified: DataTypes.STRING,
    lang_key: DataTypes.STRING,
    days: DataTypes.INTEGER
  },{
    sequelize,
    tableName:"user",
    modelName: "User",
    paranoid: true
  });
  return User;
};