'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Banner_Offer_User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Banner_Offer_User.init({
    banner_offer_id: DataTypes.INTEGER,
    user_id: DataTypes.STRING,
    coupon_id: DataTypes.INTEGER,
    used_at: DataTypes.DATE
  }, {
    sequelize,
    tableName:'banner_offer_user',
    modelName: 'Banner_Offer_User',
  });
  return Banner_Offer_User;
};