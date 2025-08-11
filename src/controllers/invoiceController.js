const {
  SendCreate,
  SendSuccess,
  SendError400,
  SendError,
  SendDuplicateData,
} = require("../utils/response");
const jwt = require("jsonwebtoken");
const invoiceService = require("../services/invoiceService");
const savelogService = require("../services/savelogService");

class invoiceController {
  async createInvoice(req, res) {
    try {
      const { code, invoiceName } = req.body;
      const createBy = req.user.email;
      if (!code || !invoiceName) {
        return SendError400(res, "Code and Invoice Name are required.");
      }
      const newInvoice = await invoiceService.createInvoice({
        code,
        invoiceName,
        createBy,
      });
      if (newInvoice.error === "DUPLICATE") {
        return SendDuplicateData(res, newInvoice.message);
      }
      //this is save log
      const tablename = "invoice";
      const olddata = "N/A";
      //this is save log
      await savelogService.insertLog({
        tablename,
        newdata: req.body,
        olddata: olddata,
        action: "NEW",
        createBy,
      });
      return SendCreate(res, "Invoice created successfully", req.body);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in createInvoice controller:", error);
      return SendError(res, 500, "Error creating invoice.");
    }
  }
  async updateInvoice(req, res) {
    try {
      const { Id, code, invoiceName } = req.body;
      const createBy = req.user.email;
      if (!Id || !code || !invoiceName) {
        return SendError400(res, "Id, Code, and Invoice Name are required.");
      }
      //this is olddata
      const olddata = await invoiceService.getInvoiceById(Id);

      const updatedInvoice = await invoiceService.updateinvoice({
        Id,
        code,
        invoiceName,
        createBy,
      });
      if (updatedInvoice.error === "DUPLICATE") {
        return SendError(res, 404, "Duplicate Data.");
      }
      //this is save log
      const tablename = "invoice";
      console.log("olddata:", olddata);
      //this is save log
      await savelogService.insertLog({
        tablename,
        newdata: req.body,
        olddata: olddata ? olddata.dataValues : "N/A",
        action: "UPDATE",
        createBy,
      });
      return SendSuccess(res, "Invoice updated successfully", req.body);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in updateInvoice controller:", error);
      return SendError(res, 500, "Error updating invoice.");
    }
  }
  //this i sget invoice all by page, limit and search
  async getInvoiceAll(req, res) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const invoices = await invoiceService.getAllInvoice(
        parseInt(page),
        parseInt(limit),
        search
      );
      return SendSuccess(res, "Invoices fetched successfully", invoices);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in getInvoiceAll controller:", error);
      return SendError(res, 500, "Error fetching invoices.");
    }
  }
  async deleteInvoice(req, res) {
    try {
      const { Id } = req.body;
      const createBy = req.user.email;
      if (!Id) {
        return SendError400(res, "Id is required.");
      }
      const olddata = await invoiceService.getInvoiceById(Id);
      const deletedInvoice = await invoiceService.deleteInvoice(Id);
      if (!deletedInvoice) {
        return SendError(res, 404, "Invoice not found.");
      }
      //this is save log
      const tablename = "invoice";
      await savelogService.insertLog({
        tablename,
        newdata: { Id, statusId: 2 },
        olddata: olddata ? olddata.dataValues : "N/A",
        action: "DELETE",
        createBy,
      });
      return SendSuccess(res, "Invoice deleted successfully");
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in deleteInvoice controller:", error);
      return SendError(res, 500, "Error deleting invoice.");
    }
  }
}
module.exports = invoiceController;
