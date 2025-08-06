const {DataTypes} = require("sequelize");
const { sequelize } = require("../config/db");
const moment = require("moment");
const formtypeModel = sequelize.define("formtype", {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "Id",
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "code",
    },
    typeName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "typeName",
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
    }
},{
    tableName: "formType",
    timestamps: false,
});

module.exports = formtypeModel;