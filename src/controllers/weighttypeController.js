const {
  SendCreate,
  SendSuccess,
  SendError400,
  SendError,
  SendDuplicateData,
} = require("../utils/response");
const jwt = require("jsonwebtoken");
const weighttypeService = require("../services/weighttypeService");
const savelogService = require("../services/savelogService");

class weighttypeController {
  async newweighttype(req, res) {
    try {
      const { code, weightName } = req.body;
      const createBy = req.user.email;
      if (!code || !weightName) {
        return SendError400(res, "Code and Weight Name are required.");
      }
      const newWeightType = await weighttypeService.newweighttype({
        code,
        weightName,
        createBy,
      });
      if (newWeightType.message === "Duplicate Data.") {
        return SendDuplicateData(res, newWeightType.message);
      }
      //this is save log
      const tablename = "weightType";
      const olddata = "N/A";
      await savelogService.insertLog({
        tablename,
        newdata: req.body,
        olddata: olddata,
        action: "NEW",
        createBy: createBy,
      });
      return SendCreate(res, "Weight Type created successfully", req.body);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in newweighttype controller:", error);
      return SendError(res, 500, "Error creating weight type.");
    }
  }
  async updateweighttype(req, res) {
    try {
      const { Id, code, weightName } = req.body;
      const createBy = req.user.email;
      if (!Id || !code || !weightName) {
        return SendError400(res, "Id, Code, and Weight Name are required.");
      }
      const olddata = await weighttypeService.getweighttypebyId(Id);
      const updatedWeightType = await weighttypeService.updateweighttype({
        Id,
        code,
        weightName,
        createBy,
      });
      if (updatedWeightType.message === "Duplicate Data.") {
        return SendDuplicateData(res, updatedWeightType.message);
      }
      //this is save log
      const tablename = "weightType";
      await savelogService.insertLog({
        tablename,
        newdata: req.body,
        olddata: olddata.dataValues,
        action: "UPDATE",
        createBy: createBy,
      });
      return SendSuccess(res, "Weight Type updated successfully", req.body);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in updateweighttype controller:", error);
      return SendError(res, 500, "Error updating weight type.");
    }
  }
  async deleteweighttype(req, res) {
    try {
      const { Id } = req.body;
      const createBy = req.user.email;
      if (!Id) {
        return SendError400(res, "Id is required.");
      }
      const olddata = await weighttypeService.getweighttypebyId(Id);
      const deletedWeightType = await weighttypeService.deleteweighttype({
        Id,
      });
      if (!deletedWeightType) {
        return SendError(res, 404, "Weight Type not found.");
      }
      //this is save log
      const tablename = "weightType";
      await savelogService.insertLog({
        tablename,
        newdata: { Id, statusId: 2 },
        olddata: olddata.dataValues,
        action: "DELETE",
        createBy: createBy,
      });
      return SendSuccess(res, "Weight Type deleted successfully");
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in deleteweighttype controller:", error);
      return SendError(res, 500, "Error deleting weight type.");
    }
  }
  async getweighttypeall(req, res) {
    try {
        
      const { page = 1, limit = 10, search = "" } = req.query;
      const weighttypes = await weighttypeService.getweighttype(
        parseInt(page),
        parseInt(limit),
        search
      );
      return SendSuccess(res, "Weight Types fetched successfully", weighttypes);
    } catch (error) {        
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in getweighttypeall controller:", error);
      return SendError(res, 500, "Error getting all weight types.");
    
    }
  }
}
module.exports = weighttypeController;
