const {DataTypes} = require("sequelize");
const { sequelize } = require('../config/db');
const moment = require('moment');

const loadimporterModel =  sequelize.define('loadimportermodel', {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field:"Id",
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "code",
    },
    loadImporterName:{
        type: DataTypes.STRING,
        allowNull: false,
        field: "loadImporterName",
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
        defaultValue: DataTypes.NOW,
        get() {
          const date = this.getDataValue('createDate');
          return date ? date.toISOString().split('T')[0] : null; // Format to YYYY-MM-DD
        },
    },
    createBy:{
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "createBy",
    },    
}, {
    tableName: 'loadImporter',
    timestamps: false, // Disable automatic timestamps
});


module.exports = loadimporterModel;