const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const moment = require("moment");
const rolegroupModel = require("./rolegroupModel");
const userclientsModel = require("./userclientsModel");


const rolegroupdetailsModel = sequelize.define(
  "rolegroupdetails",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "Id",
    },
    userAdminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "userAdminId",
    },
    roleGroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "roleGroupId",
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "createDate",
      get() {
        const date = this.getDataValue("createDate");
        return date ? date.toISOString().split("T")[0] : null; // Format to YYYY-MM-DD
      },
    },
    createBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "createBy",
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "statusId",
    },
    approveForm: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "approveForm",
    },
  },
  {
    tableName: "roleGroupDetails",
    timestamps: false,
  }
);

rolegroupdetailsModel.belongsTo(rolegroupModel, {
  foreignKey: "roleGroupId",
  as: "roleGroup",
});

rolegroupdetailsModel.belongsTo(userclientsModel, {
  foreignKey: "userAdminId",
  as: "userAdmin",
});

module.exports = rolegroupdetailsModel;
