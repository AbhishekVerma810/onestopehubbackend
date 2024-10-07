'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Banner_Offer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Banner_Offer.init({
    banner_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    coupon_code: DataTypes.STRING,
    reward: DataTypes.STRING,
    type: DataTypes.STRING,
    img_url: DataTypes.STRING,
    expired_at: DataTypes.DATE
  }, {
    sequelize,
    tableName:'banner_offer',
    modelName: 'Banner_Offer',
  });
  return Banner_Offer;
};