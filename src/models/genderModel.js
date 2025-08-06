const {DataTypes} = require('sequelize');
const sequelize = require('../config/db').sequelize;
const genderModel = sequelize.define('gender',{
    Id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "Id",
    },
    code:{
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "code",
    },
    genderName:{
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "genderName",
    },

},{
    tableName: "gender",
    timestamps: false,
});

module.exports = genderModel;