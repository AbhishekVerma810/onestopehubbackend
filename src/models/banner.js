'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Banner.init({
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
    sort_order: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    tableName:'banner',
    modelName: 'Banner',
  });
  return Banner;
};