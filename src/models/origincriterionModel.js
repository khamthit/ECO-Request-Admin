const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const moment = require("moment");

const origincriterionModel = sequelize.define(
  "origincriterion",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "Id",
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "code",
    },
    originName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "originName",
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "statusId",
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "createDate",
      get() {
        return moment(this.getDataValue("createDate")).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      },
    },
    createBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "createBy",
    },
  },
  {
    tableName: "originCriterion",
    timestamps: false,
  }
);
module.exports = origincriterionModel;
