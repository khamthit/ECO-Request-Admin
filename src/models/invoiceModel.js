const {DataTypes} = require('sequelize');
const sequelize = require('../config/db').sequelize;

const invoiceModel = sequelize.define('Invoice', {
    Id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "Id",
    },
    code:{
        type: DataTypes.STRING,
        allowNull: false,
        field: "code",
    },
    invoiceName:{
        type: DataTypes.STRING,
        allowNull: false,
        field: "invoiceName",
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
            const date = this.getDataValue('createDate');
            return date ? date.toISOString().split('T')[0] : null; // Format to YYYY-MM-DD
        }
    },
    createBy:{
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "createBy",
    }
}, {
    tableName: 'invoice',
    timestamps: false,
});

module.exports = invoiceModel;