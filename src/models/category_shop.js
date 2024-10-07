'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category_Shop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Category_Shop.init({
    category_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    img_url:{
      type: DataTypes.STRING,
      get() {
        const image = this.getDataValue("img_url");
        if (image) {
          return process.env.BACKEND_URL + "public/upload/" + image;
        } else {
          return null
        }
      }
    },
    address:  DataTypes.STRING,
    street: DataTypes.STRING,
    price: DataTypes.STRING,
    distance: DataTypes.STRING,
    rating: DataTypes.STRING,
    is_open: DataTypes.STRING,
  }, {
    sequelize,
    tableName:'category_shop',
    modelName: 'Category_Shop',
  });
  return Category_Shop;
};