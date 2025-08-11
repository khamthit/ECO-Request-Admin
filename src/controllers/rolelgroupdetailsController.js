const rolegroupdetailsService = require("../services/rolegroupdetailsService");
const {
  SendCreate,
  SendSuccess,
  SendError400,
  SendError,
  SendDuplicateData,
} = require("../utils/response");
const jwt = require("jsonwebtoken");
const savelogService = require("../services/savelogService");

class rolegroupdetailsController {
  async newrolegroupdetails(req, res) {
    try {
      const { userAdminId, roleGroupId, approveForm } = req.body;
      const createBy = req.user.email;
      if (!userAdminId || !roleGroupId) {
        return SendError400(
          res,
          "User Admin ID and Role Group ID are required."
        );
      }
      const newRoleGroupDetails =
        await rolegroupdetailsService.newrolegroupdetails({
          userAdminId,
          roleGroupId,
          approveForm,
          createBy,
        });
      if (newRoleGroupDetails.message === "Duplicate Data.") {
        return SendDuplicateData(res, newRoleGroupDetails.message);
      }
      //this is save log
      const tablename = "rolegroupdetails";
      const olddata = "N/A";
      await savelogService.insertLog({
        tablename,
        newdata: req.body,
        olddata: olddata,
        action: "NEW",
        createBy,
      });
      return SendCreate(
        res,
        "Role group details created successfully",
        req.body
      );
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in newrolegroupdetails controller:", error);
      return SendError(res, 500, "Error creating role group details.");
    }
  }
  async getAllRoleGroupDetails(req, res) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const rolegroupdetails =
        await rolegroupdetailsService.getAllRoleGroupDetails(
          parseInt(page),
          parseInt(limit),
          search
        );
      return SendSuccess(
        res,
        "Role group details fetched successfully",
        rolegroupdetails
      );
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in getAllRoleGroupDetails controller:", error);
      return SendError(res, 500, "Error getting all role group details.");
    }
  }
  async updaterolegroupdetails(req, res) {
    try {
      const { Id, userAdminId, roleGroupId, approveForm } = req.body;
      const createBy = req.user.email;
      if (!Id || !userAdminId || !roleGroupId) {
        return SendError400(
          res,
          "Id, User Admin ID and Role Group ID are required."
        );
      }
      const olddata = await rolegroupdetailsService.getrolegroupdetailsById(Id);
      const updatedRoleGroupDetails =
        await rolegroupdetailsService.updaterolegroupdetails({
          Id,
          userAdminId,
          roleGroupId,
          approveForm,
          createBy,
        });
      //this is save log
      const tablename = "rolegroupdetails";
      await savelogService.insertLog({
        tablename,
        newdata: req.body,
        olddata: olddata.dataValues,
        action: "UPDATE",
        createBy,
      });
      return SendSuccess(
        res,
        "Role group details updated successfully",
        req.body
      );
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in updaterolegroupdetails controller:", error);
      return SendError(res, 500, "Error updating role group details.");
    }
  }
  async deleterolegroupdetails(req, res) {
    try {
      const { Id } = req.body;
      const createBy = req.user.email;
      if (!Id) {
        return SendError400(res, "Id is required.");
      }
      const olddata = await rolegroupdetailsService.getrolegroupdetailsById(Id);
      const deletedRoleGroupDetails =
        await rolegroupdetailsService.deleterolegroupdetails({ Id });
      if (!deletedRoleGroupDetails) {
        return SendError(res, 404, "Role Group Details not found.");
      }
      //this is save log
      const tablename = "rolegroupdetails";
      await savelogService.insertLog({
        tablename,
        newdata: { Id, statusId: 2 },
        olddata: olddata.dataValues,
        action: "DELETE",
        createBy,
      });
      return SendSuccess(res, "Role group details deleted successfully");
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in deleterolegroupdetails controller:", error);
      return SendError(res, 500, "Error deleting role group details.");
    }
  }
  async deleterolegroupdetailsbyuserId(req, res) {
    try {
      const { userAdminId } = req.body;
      const createBy = req.user.email;
      if (!userAdminId) {
        return SendError400(res, "User Admin ID is required.");
      }
      // No olddata retrieval here as we are deleting multiple records
      const deletedRoleGroupDetails =
        await rolegroupdetailsService.deleterolegroupdetailsbyuserId({
          userAdminId,
        });
      if (!deletedRoleGroupDetails) {
        return SendError(
          res,
          404,
          "Role Group Details not found for this user."
        );
      }
      //this is save log
      const tablename = "rolegroupdetails";
      await savelogService.insertLog({
        tablename,
        newdata: { userAdminId, statusId: 2 },
        olddata: "N/A", // Since multiple records might be deleted, olddata might be complex to capture
        action: "DELETE_BY_USERID",
        createBy,
      });
      return SendSuccess(
        res,
        "Role group details for user deleted successfully"
      );
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error(
        "Error in deleterolegroupdetailsbyuserId controller:",
        error
      );
      return SendError(
        res,
        500,
        "Error deleting role group details by user ID."
      );
    }
  }
  async getrolegroupdetailsbyuserId(req, res){
    try {
      const { userAdminId } = req.body;
      if (!userAdminId) {
        return SendError400(res, "User Admin ID is required.");
      }
      const rolegroupdetails =
        await rolegroupdetailsService.getrolegroupdetailbyuserId({
          userAdminId,
        });
      if (!rolegroupdetails || rolegroupdetails.length === 0) {
        return SendError(res, 404, "No role group details found for this user.");
      }
      return SendSuccess(
        res,
        "Role group details fetched successfully by user ID",
        rolegroupdetails
      );
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in getrolegroupdetailsbyuserId controller:", error);
      return SendError(
        res,
        500,
        "Error getting role group details by user ID."
      );
    }
  }
}
module.exports = rolegroupdetailsController;
