const formtypeService = require("../services/formtypeService");
const {
  SendCreate,
  SendSuccess,
  SendError400,
  SendError,
  SendDuplicateData,
} = require("../utils/response");
const jwt = require("jsonwebtoken");

class formtypeController {
  async getAllformtype(req, res) {
    try {
      const { page, limit, searchtext } = req.query;
      //this is using tokenkey
      const datas = await formtypeService.getformtype({
        page,
        limit,
        searchtext,
      });
      if (!datas || datas.items.length === 0) {
        return SendError400(res, "Not Found data.");
      }
      return SendSuccess(res, "Fect data is successful", datas);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      return SendError(res, 500, "Error fecting formType in controllers.");
    }
  }
  async newformtype(req, res) {
    try {
      const { code, typeName } = req.body;
      const createBy = req.user.email; // Use the integer user ID from the token
      if (!code || !typeName) {
        return SendError400(res, "Code and Type Name are required.");
      }
      //this is using service
      const result = await formtypeService.newformtype({
        code,
        typeName,
        createBy,
      });
      if (result && result.error === 'DUPLICATE') {
        return SendDuplicateData(res, result.message);
      }
      return SendCreate(res, result.message, result.data, req.body);
    } catch (error) {
       if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error creating formType:", error);
      return SendError(res, 500, "Error creating formType in controllers.");
      
    }
  }
  async updateformtype(req, res){
    try {
      const { Id, code, typeName } = req.body;
      if (!Id || !code || !typeName) {
        return SendError400(res, "All fields are required.");
      }
      //this is using service
      const result = await formtypeService.updateformtype({
        Id,
        code,
        typeName,
      });
      if (result && result.error === 'DUPLICATE') {
        return SendDuplicateData(res, result.message);
      }
      return SendSuccess(res, "Form type updated successfully", result);
      
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error updating formType:", error);
      return SendError(res, 500, "Error updating formType in controllers.");
      
    }
  }
  async deleteformtype(req, res) {
    try {
      const { Id } = req.body;
      if (!Id) {
        return SendError400(res, "Id is required.");
      }
      //this is using service
      const result = await formtypeService.deleteformtype({ Id });
      if (result && result.error === 'NOT_FOUND') {
        return SendError400(res, result.message);
      }
      return SendSuccess(res, "Form type deleted successfully", result);
    } catch (error) {
      console.error("Error deleting formType:", error);
      return SendError(res, 500, "Error deleting formType in controllers.");
    }
  }
}
module.exports = formtypeController;
