'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category_Shop_Service_Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Category_Shop_Service_Item.init({
    category_shop_service_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    img_url: DataTypes.STRING,
    price: DataTypes.STRING,
    quantity: DataTypes.STRING,
    description: DataTypes.STRING,
    special_instruction: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category_Shop_Service_Item',
  });
  return Category_Shop_Service_Item;
};