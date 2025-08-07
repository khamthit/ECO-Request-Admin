const {
  SendCreate,
  SendSuccess,
  SendError400,
  SendError,
  SendDuplicateData,
} = require("../utils/response");
const jwt = require("jsonwebtoken");
const origincriterionService = require("../services/origincriterionService");
const saveLog = require("../services/savelogService");

class origincriterionController {
  async neworigincriterion(req, res) {
    try {
      const { code, originName } = req.body;
      const createBy = req.user.email; // Assuming user ID is stored in req.user
      if (!code || !originName) {
        return SendError400(res, "Code and Origin Name are required.");
      }
      const result = await origincriterionService.neworigincriterion({
        code,
        originName,
        createBy,
      });
      if (result && result.error === "DUPLICATE") {
        return SendDuplicateData(res, result.message);
      }
      return SendCreate(res, "Origin criterion created successfully", req.body);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in neworigincriterion controller:", error);
      return SendError(res, 500, "Error creating origin criterion.");
    }
  }
  async updateorigincriterion(req, res) {
    try {
      const { Id, code, originName } = req.body;
      const updateBy = req.user.email;
      if (!Id || !code || !originName) {
        return SendError400(res, "ID, Code, and Origin Name are required.");
      }
      //this is get old data first
      const existingCriterion =
        await origincriterionService.getOriginCriterionById(Id);
      if (!existingCriterion) {
        return SendError400(res, "Origin criterion not found.");
      }
      const result = await origincriterionService.updateorigincriterion({
        Id,
        code,
        originName,
        updateBy,
      });
      if (result && result.error === "DUPLICATE") {
        return SendDuplicateData(res, result.message);
      }
      //this is save log
      const tablename = "originCriterion";
      await saveLog.insertLog({
        tablename,
        newdata: req.body,
        olddata: "N/A",
        action: "NEW",
        createBy: updateBy,
      });
      return SendSuccess(
        res,
        "Origin criterion updated successfully",
        req.body
      );
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in updateorigincriterion controller:", error);
      return SendError(res, 500, "Error updating origin criterion.");
    }
  }
  async deleteorigincriterion(req, res) {
    try {
        const {Id} = req.body;
        const createBy = req.user.email; // Assuming user ID is stored in req.user
        if (!Id) {
            return SendError400(res, "ID is required.");
        }
        //this is get old data first
        const existingCriterion = await origincriterionService.getOriginCriterionById(Id);
        if (!existingCriterion) {
            return SendError400(res, "Origin criterion not found.");
        }
        const result = await origincriterionService.deleteorigincriterion({Id, createBy});
        //this is save log
        const tablename = "originCriterion";
        await saveLog.insertLog({
            tablename,
            newdata: {Id, statusId: 2},
            olddata: existingCriterion.dataValues,
            action: "DELETE",
            createBy: createBy,
        });
        return SendSuccess(res, "Origin criterion deleted successfully");        
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in deleteorigincriterion controller:", error);
      return SendError(res, 500, "Error deleting origin criterion.");
        
    }
  }
  async getAllOriginCriteria(req, res) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const criteria = await origincriterionService.getAllOriginCriteria({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
      });
      return SendSuccess(res, "Origin criteria retrieved successfully", criteria);
    } catch (error) {
      console.error("Error in getAllOriginCriteria controller:", error);
      return SendError(res, 500, "Error retrieving origin criteria.");
    }
  }
}
module.exports = origincriterionController;
