'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Customer.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    contact_number: DataTypes.STRING,
    meta: DataTypes.TEXT,
    vendor_id: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:'customer',
    modelName: 'Customer',
  });
  return Customer;
};