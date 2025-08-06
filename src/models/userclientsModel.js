const {DataTypes} = require("sequelize");
const { sequelize } = require("../config/db");
const moment = require("moment");
const genderModel = require("./genderModel");

const userclientsModel = sequelize.define("userClients", {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "Id",
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "email",
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "password",
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        field: "name",    
    },
    surname:{
        type: DataTypes.STRING,
        allowNull: false,
        field: "surname",
    },
    tel:{
        type: DataTypes.STRING,
        allowNull: false,
        field: "tel",    
    },
    statusId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "statusId",
    },
    createDate:{
        type: DataTypes.DATE,
        allowNull: false,
        field: "createDate",
        get() {
        const rawValue = this.getDataValue("createDate");
        return rawValue ? moment(rawValue).format("YYYY-MM-DD HH:mm:ss") : null;
      },
    },
    createBy:{
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "createBy",
    },
    genderId:{
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "genderId",
    },
},{
    tableName: "userAdmin",
    timestamps: false,
});

userclientsModel.belongsTo(genderModel, {
    foreignKey: "genderId",
    as: "gender",
  });

module.exports = userclientsModel;
