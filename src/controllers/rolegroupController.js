const rolegroupService = require("../services/rolegroupService");
const {
  SendCreate,
  SendSuccess,
  SendError400,
  SendError,
  SendDuplicateData,
} = require("../utils/response");
const jwt = require("jsonwebtoken");
const savelogService = require("../services/savelogService");

class rolegroupController {
  async newrolegroup(req, res) {
    try {
      const { roleGroupName } = req.body;
      const createBy = req.user.email;
      if (!roleGroupName) {
        return SendError400(res, "Role Group Name is required.");
      }
      const newRoleGroup = await rolegroupService.newrolegroup({
        roleGroupName,
        createBy,
      });
      if (newRoleGroup.message === "Duplicate Data.") {
        return SendDuplicateData(res, newRoleGroup.message);
      }
      //this is save log
      const tablename = "rolegroup";
      const olddata = "N/A";
      await savelogService.insertLog({
        tablename,
        newdata: req.body,
        olddata: olddata,
        action: "NEW",
        createBy,
      });
      return SendCreate(res, "Role group created successfully", req.body);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in newrolegroup controller:", error);
      return SendError(res, 500, "Error creating role group.");
    }
  }
  async updaterolegroup(req, res) {
    try {
      const { Id, roleGroupName } = req.body;
      const createBy = req.user.email;
      if (!Id || !roleGroupName) {
        return SendError400(res, "Id and Role Group Name are required.");
      }
      const olddata = await rolegroupService.getrolegroupById(Id);
      const updatedRoleGroup = await rolegroupService.updaterolegroup({
        Id,
        rolegroup: roleGroupName,
        createBy,
      });
      if (updatedRoleGroup.message === "Duplicate Data.") {
        return SendDuplicateData(res, updatedRoleGroup.message);
      }
      //this is save log
      const tablename = "rolegroup";
      await savelogService.insertLog({
        tablename,
        newdata: req.body,
        olddata: olddata.dataValues,
        action: "UPDATE",
        createBy,
      });
      return SendSuccess(res, "Role group updated successfully", req.body);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in updaterolegroup controller:", error);
      return SendError(res, 500, "Error updating role group.");
    }
  }
  async deleterolegroup(req, res) {
    try {
      const { Id } = req.body;
      const createBy = req.user.email;
      if (!Id) {
        return SendError400(res, "Id is required.");
      }
      const olddata = await rolegroupService.getrolegroupById(Id);
      const deletedRoleGroup = await rolegroupService.deleterolegroup({ Id });
      if (!deletedRoleGroup) {
        return SendError(res, 404, "Role Group not found.");
      }
      //this is save log
      const tablename = "rolegroup";
      await savelogService.insertLog({
        tablename,
        newdata: { Id, statusId: 2 },
        olddata: olddata.dataValues,
        action: "DELETE",
        createBy,
      });
      return SendSuccess(res, "Role group deleted successfully");
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in deleterolegroup controller:", error);
      return SendError(res, 500, "Error deleting role group.");
    }
  }
  async getallrolegroup(req, res) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const rolegroups = await rolegroupService.getAllRoleGroup(
        parseInt(page),
        parseInt(limit),
        search
      );
      return SendSuccess(res, "Role groups fetched successfully", rolegroups);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in getallrolegroup controller:", error);
      return SendError(res, 500, "Error getting all role groups.");
    }
  }
}
module.exports = rolegroupController;
