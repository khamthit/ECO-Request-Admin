const {
  SendCreate,
  SendSuccess,
  SendError400,
  SendError,
  SendDuplicateData,
} = require("../utils/response");
const jwt = require("jsonwebtoken");
const unitService = require("../services/unitService");
const savelogService = require("../services/savelogService");

class unitController {
  async newunit(req, res) {
    try {
      const { code, unitName } = req.body;
      const creeateBy = req.user.email;
      if (!code || !unitName) {
        return SendError400(res, "Code and Unit Name are required.");
      }
      const newUnit = await unitService.newunit({ code, unitName, creeateBy });
      if (newUnit.message === "Duplicate Data.") {
        return SendDuplicateData(res, newUnit.message);
      }
      //this is save log
      const tablename = "unit";
      const olddata = "N/A";
      await savelogService.insertLog({
        tablename,
        newdata: req.body,
        olddata: olddata,
        action: "NEW",
        createBy: creeateBy,
      });
      return SendCreate(res, "Unit created successfully", req.body);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in newunit controller:", error);
      return SendError(res, 500, "Error creating unit.");
    }
  }
  async updateunit(req, res) {
    try {
      const { Id, code, unitName } = req.body;
      const creeateBy = req.user.email;
      if (!Id || !code || !unitName) {
        return SendError400(res, "Id, Code, and Unit Name are required.");
      }
      const olddata = await unitService.getunitbyId(Id);
      const updatedUnit = await unitService.updateunit({
        Id,
        code,
        unitName,
        creeateBy,
      });
      if (updatedUnit.message === "Duplicate Data.") {
        return SendDuplicateData(res, updatedUnit.message);
      }
      //this is save log
      const tablename = "unit";
      await savelogService.insertLog({
        tablename,
        newdata: req.body,
        olddata: olddata.dataValues,
        action: "UPDATE",
        createBy: creeateBy,
      });
      return SendSuccess(res, "Unit updated successfully", req.body);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in updateunit controller:", error);
      return SendError(res, 500, "Error updating unit.");
    }
  }
  async getunitall(req, res) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const units = await unitService.getunit(
        parseInt(page),
        parseInt(limit),
        search
      );
      return SendSuccess(res, "Units fetched successfully", units);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in getunitall controller:", error);
      return SendError(res, 500, "Error getting all units.");
    }
  }
  async delete(req, res){
    try {
        
      const { Id } = req.body;
      const creeateBy = req.user.email;
      if (!Id) {
        return SendError400(res, "Id is required.");
      }
      const olddata = await unitService.getunitbyId(Id);
      const deletedUnit = await unitService.deleteunit({ Id });
      if (!deletedUnit) {
        return SendError(res, 404, "Unit not found.");
      }
      //this is save log
      const tablename = "unit";
      await savelogService.insertLog({
        tablename,
        newdata: { Id, statusId: 2 },
        olddata: olddata.dataValues,
        action: "DELETE",
        createBy: creeateBy,
      });
      return SendSuccess(res, "Unit deleted successfully");
    } catch (error) {        
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in delete unit controller:", error);
      return SendError(res, 500, "Error deleting unit.");
      
    }
  }
}
module.exports = unitController;
