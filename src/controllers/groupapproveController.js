const groupapproveService = require("../services/groupapproveService");
const {
  SendCreate,
  SendSuccess,
  SendError400,
  SendError,
  SendDuplicateData,
} = require("../utils/response");
const jwt = require("jsonwebtoken");
const savelogService = require("../services/savelogService");

class groupapproveController {
  async createnewapprove(req, res) {
    try {
      const { groupName } = req.body;
      const createBy = req.user.email;
      if (!groupName) {
        return SendError400(res, "Group Name is required.");
      }
      const newGroupApprove = await groupapproveService.createnewapprove(
        groupName,
        createBy
      );
      if (newGroupApprove.message === "Duplicate Data.") {
        return SendDuplicateData(res, newGroupApprove.message);
      }
      //this is save log
      const tablename = "groupApprove";
      const olddata = "N/A";
      await savelogService.insertLog({
        tablename,
        newdata: req.body,
        olddata: olddata,
        action: "NEW",
        createBy,
      });
      return SendCreate(res, "Group approve created successfully", req.body);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in createnewapprove controller:", error);
      return SendError(res, 500, "Error creating group approve.");
    }
  }
  async updategroupapprove(req, res) {
    try {
      const { Id, groupName } = req.body;
      const createBy = req.user.email;
      if (!Id || !groupName) {
        return SendError400(res, "Id and Group Name are required.");
      }
      const olddata = await groupapproveService.getgroupapproveById(Id);
      const updatedGroupApprove = await groupapproveService.updategroupapprove({
        Id,
        groupName,
        createBy,
      });
      if (updatedGroupApprove.message === "Duplicate Data.") {
        return SendDuplicateData(res, updatedGroupApprove.message);
      }
      //this is save log
      const tablename = "groupApprove";
      await savelogService.insertLog({
        tablename,
        newdata: req.body,
        olddata: olddata.dataValues,
        action: "UPDATE",
        createBy,
      });
      return SendSuccess(res, "Group approve updated successfully", req.body);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in updategroupapprove controller:", error);
      return SendError(res, 500, "Error updating group approve.");
    }
  }
  async deletegroupapprove(req, res) {
    try {
      const { Id } = req.body;
      const createBy = req.user.email;
      if (!Id) {
        return SendError400(res, "Id and Group Name are required.");
      }
      const olddata = await groupapproveService.getgroupapproveById(Id);
      const updatedGroupApprove = await groupapproveService.deleteapprove({
        Id,
      });
      //this is save log
      const tablename = "groupApprove";
      await savelogService.insertLog({
        tablename,
        newdata: req.body,
        olddata: olddata.dataValues,
        action: "UPDATE",
        createBy,
      });
      return SendSuccess(res, "Group approve updated successfully", req.body);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in updatedGroupApprove controller:", error);
      return SendError(res, 500, "Error updating group approve.");
    }
  }
  async getapprovegroup(req, res) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const groupapproves = await groupapproveService.getapprovegroup(
        parseInt(page),
        parseInt(limit),
        search
      );
      return SendSuccess(
        res,
        "Group approves fetched successfully",
        groupapproves
      );
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in getapprovegroup controller:", error);
      return SendError(res, 500, "Error getting all group approves.");
    }
  }
}
module.exports = groupapproveController;
