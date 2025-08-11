const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/db');

const rolegroupModel = sequelize.define('rolegroup', {
    Id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "Id",
    },
    roleGroupName:{
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "roleGroupName",
    },
    createDate:{
        type: DataTypes.DATE,
        allowNull: false,
        field: "createDate",
        get() {
            const date = this.getDataValue('createDate');
            return date ? date.toISOString().split('T')[0] : null; // Format to YYYY-MM-DD
        }
    },
    createBy:{
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "createBy",
    },
    statusId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "statusId",
    },
},{
    tableName: "roleGroup",
    timestamps: false,
});

module.exports = rolegroupModel;
