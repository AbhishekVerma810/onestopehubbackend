'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Address.init({
    title: DataTypes.STRING,
    formatted_address: DataTypes.STRING,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    postcode: DataTypes.STRING,
    longitude: DataTypes.STRING,
    latitude: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:'address',
    modelName: 'Address',
  });
  return Address;
};