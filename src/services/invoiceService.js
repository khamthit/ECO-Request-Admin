const { sequelize } = require("../config/db");
const { Op } = require("sequelize");
const invoiceModel = require("../models/invoiceModel");

class invoiceService {
  static async createInvoice(invoiceData) {
    try {
      const { code, invoiceName, createBy } = invoiceData;
      //this is check data first
      const existingInvoice = await invoiceModel.findOne({
        where: {
          statusId: 1, // Assuming statusId 1 means active
          [Op.or]: [{ code: code }, { invoiceName: invoiceName }],
        },
      });
      if (existingInvoice) {
        return { error: "DUPLICATE", message: "Duplicate Data." };
      }
      //this is isnert data by function createInvoice without using table
      const newInvoice = await sequelize.query(
        `
                select f_insertInvoice (:code, :invoiceName, :createBy) as result`,
        {
          replacements: { code, invoiceName, createBy },
          type: sequelize.QueryTypes.INSERT,
        }
      );
      return newInvoice;
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  }

  static async updateinvoice(invoiceData) {
    try {
      const { Id, code, invoiceName, createBy } = invoiceData;
      // Check for duplicate code or invoiceName
      const existingInvoice = await invoiceModel.findOne({
        where: {
          statusId: 1, // Assuming statusId 1 means active
          [Op.or]: [{ code: code }, { invoiceName: invoiceName }],
        },
      });
      if (existingInvoice) {
        return { error: "DUPLICATE", message: "Duplicate Data." };
      }
      // Update the invoice
      const updatedInvoice = await invoiceModel.update(
        { code, invoiceName, createBy },
        { where: { Id } }
      );
      return updatedInvoice;
    } catch (error) {
      console.error("Error updating invoice:", error);
      throw error;
    }
  }
  static async getInvoiceById(Id) {
    try {
      const invoice = await invoiceModel.findOne({
        where: { Id },
      });
      return invoice;
    } catch (error) {
      console.error("Error fetching invoice by ID:", error);
      throw error;
    }
  }
  //this is get all invoice by page, limit and search
  static async getAllInvoice(page, limit, search) {
    try {
      const offset = (page - 1) * limit;
      const whereCondition = search
        ? {
            [Op.or]: [
              { code: { [Op.like]: `%${search}%` } },
              { invoiceName: { [Op.like]: `%${search}%` } },
            ],
          }
        : {};

      const result = await invoiceModel.findAndCountAll({
        where: {
          ...whereCondition,
          statusId: 1,
        },
        limit: limit,
        offset: offset,
        order: [["Id", "DESC"]],
      });

      return result;
    } catch (error) {
      console.error("Error in GetInvoiceAll:", error);
      throw error;
    }
  }
  //this is delete
  static async deleteInvoice(Id) {
    try {
      const deleteInvoice = await invoiceModel.update(
        { statusId: 2 },
        { where: { Id } }
      );
      return deleteInvoice;
    } catch (error) {
      console.error("Error deleting invoice:", error);
      throw error;
    }
  }
}
module.exports = invoiceService;
