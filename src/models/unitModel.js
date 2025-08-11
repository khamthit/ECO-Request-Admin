const {DataTypes} = require("sequelize");
const { sequelize } = require("../config/db");
const moment = require("moment");

const unitModel = sequelize.define(
  "unit",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "Id",
    },
    code: {
      type: DataTypes.STRING,
      field: "code",
    },
    unitName: {
      type: DataTypes.STRING,
      field: "unitName",
    },
    statusId: {
      type: DataTypes.INTEGER,
      field: "statusId",
    },
    createDate: {
      type: DataTypes.DATE,
      field: "createDate",
      get() {
        const rawValue = this.getDataValue("createDate");
        return rawValue ? moment(rawValue).format("YYYY-MM-DD HH:mm:ss") : null;
      },
    },
    createBy: {
      type: DataTypes.INTEGER,
      field: "createBy",
    },
  },
  {
    tableName: "unit",
    timestamps: false,
  }
);

module.exports = unitModel;
