const { Op } = require("sequelize");
const moment = require("moment");
const laohscodeService = require("../services/laohscodeService");
const {
  SendCreate,
  SendSuccess,
  SendError400,
  SendError,
  SendDuplicateData,
} = require("../utils/response");
const jwt = require("jsonwebtoken");
const savelogService = require("../services/savelogService");

class laohscodeController {
  async newlaohscode(req, res) {
    try {
      const { code, hscodeName } = req.body;
      const createBy = req.user.email;
      if (!code || !hscodeName) {
        return SendError400(res, "Code and HS Code Name are required.");
      }
      const result = await laohscodeService.newlaohscode({
        code,
        hscodeName,
        createBy,
      });
      //this is save log
      const tablename = "hslaoCode";
      const olddata = "N/A";
      const savelog = await savelogService.insertLog({
        tablename,
        newdata: req.body,
        olddata: olddata,
        action: "NEW",
        createBy,
      });
      return SendCreate(res, "HS Code created successfully", result);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      if (error.message === "Duplicate code or hscodeName.") {
        return SendDuplicateData(res, error.message);
      }
      console.error("Error in newlaohscode controller:", error);
      return SendError(res, 500, "Error creating HS Code.");
    }
  }
  async updatelaohscode(req, res) {
    try {
      const { Id, code, hscodeName } = req.body;
      const createBy = req.user.email;
      if (!Id || !code || !hscodeName) {
        return SendError400(res, "ID, Code, and HS Code Name are required.");
      }

      // Fetch the existing data first for logging and to ensure it exists
      const olddata = await laohscodeService.getlaohscodeById({ Id });
      if (!olddata) {
        return SendError400(res, "HS Code not found.");
      }

      const result = await laohscodeService.updatelaohscode({
        Id,
        code,
        hscodeName,
        createBy,
      });

      //this is save log
      const tablename = "hslaoCode";
      await savelogService.insertLog({
        tablename,
        newdata: req.body,
        olddata: olddata.dataValues,
        action: "UPDATE",
        createBy,
      });
      //this is for duplicate data
      if (result.error) {
        return SendError400(res, result.message);
      }
      return SendSuccess(res, "HS Code updated successfully", result);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      if (error.message === "Duplicate code or hscodeName.") {
        return SendDuplicateData(res, error.message);
      }
      console.error("Error in updatelaohscode controller:", error);
      return SendError(res, 500, "Error updating HS Code.");
    }
  }
  async deletelaohscode(req, res) {
    try {
      const { Id } = req.body;
      const createBy = req.user.email;
      if (!Id) {
        return SendError400(res, "ID is required.");
      }
      //this is save log
      const tablename = "hslaoCode";
      const olddata = await laohscodeService.getlaohscodeById({ Id });
      if (!olddata) {
        return SendError400(res, "HS Code not found.");
      }

      const result = await laohscodeService.deletelaohscode({ Id, createBy });
      if (result[0] === 0) {
        return SendError400(res, "HS Code not found or already deleted.");
      }

      await savelogService.insertLog({
        tablename,
        newdata: { Id, statusId: 2 },
        olddata: olddata.dataValues,
        action: "DELETE",
        createBy,
      });
      return SendSuccess(res, "HS Code deleted successfully");
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in deletelaohscode controller:", error);
      return SendError(res, 500, "Error deleting HS Code.");
    }
  }
  async getlaohscode(req, res) {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const offset = (page - 1) * limit;
    
        const result = await laohscodeService.getlaohscode(
            parseInt(page),
            parseInt(limit),
            search
        );
    
        if (!result || result.length === 0) {
            return SendError(res, 404, "No HS Codes found.");
        }
    
        return SendSuccess(res, "HS Codes fetched successfully", {
            data: result,
            page: parseInt(page),
            limit: parseInt(limit),
        });
        
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in getlaohscode controller:", error);
      return SendError(res, 500, "Error fetching HS Codes.");
        
    }
  }
}
module.exports = laohscodeController;
