const portdischargerService = require("../services/portdischargerService");
const {
  SendCreate,
  SendSuccess,
  SendError400,
  SendError,
  SendDuplicateData,
} = require("../utils/response");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const savelogService = require("../services/savelogService");

class portdischargerController {
  async getportdischarger(req, res) {
    try {
      const { page, limit, search } = req.query;
      const portDischargers = await portdischargerService.getportdischarger(
        page,
        limit,
        search
      );
      if (!portDischargers || portDischargers.rows.length === 0) {
        return SendError400(res, "No port dischargers found.");
      }
      return SendSuccess(
        res,
        "Port dischargers fetched successfully",
        portDischargers
      );
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in getportdischarger controller:", error);
      return SendError(res, 500, "Error fetching port dischargers.");
    }
  }
  async newportdischarger(req, res) {
    try {
      const { code, portDischargerName } = req.body;
      const createBy = req.user.email; // Assuming user ID is stored in req.user
      if (!code || !portDischargerName) {
        return SendError400(res, "Code and Port Discharger Name are required.");
      }
      const newPortDischarger = await portdischargerService.newportdischarger({
        code,
        portDischargerName,
        createBy,
      });
      if (newPortDischarger.status === "duplicate") {
        return SendDuplicateData(res, newPortDischarger.message);
      }
      return SendCreate(
        res,
        "New port discharger created successfully",
        req.body
      );
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in newportdischarger controller:", error);
      return SendError(res, 500, "Error creating new port discharger.");
    }
  }
  async updateportdischarger(req, res) {
    try {
      const { Id, code, portDischargerName } = req.body;
      const createBy = req.user.email;
      if (!Id || !code || !portDischargerName) {
        return SendError400(res, "All fields are required.");
      }

      //this is check portdischarger by id
      const existingPortDischarger =
        await portdischargerService.getportdischargerById(Id);
      if (!existingPortDischarger) {
        return SendError400(res, "Port discharger not found.");
      }
      //   console.log("existingPortDischarger:", existingPortDischarger.dataValues);
      const updatedPortDischarger =
        await portdischargerService.updateportdischarger({
          Id,
          code,
          portDischargerName,
          createBy,
        });
      if (updatedPortDischarger.status === "duplicate") {
        return SendDuplicateData(res, updatedPortDischarger.message);
      }

      const tablename = "portDischarger";
      //this is save log
      await savelogService.insertLog({
        tablename,
        newdata: req.body,
        olddata: existingPortDischarger.dataValues,
        action: "UPDATE",
        createBy,
      });

      return SendSuccess(res, "Port discharger updated successfully", req.body);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in updateportdischarger controller:", error);
      return SendError(res, 500, "Error updating port discharger.");
    }
  }
  async deleteportdischarger(req, res) {
    try {
      const { Id } = req.body;
      const createBy = req.user.email;
      if (!Id) {
        return SendError400(res, "Port discharger ID is required.");
      }
      const olddata = await portdischargerService.getportdischargerById(Id);
      if (!olddata) {
        return SendError400(res, "Port discharger not found.");
      }
      const tablename = "portDischarger";
      //this is save log
      await savelogService.insertLog({
        tablename,
        newdata: { Id, statusId: 2 },
        olddata: olddata.dataValues,
        action: "DELETE",
        createBy,
      });
      await portdischargerService.deleteportdischarger({ Id, createBy });

      return SendSuccess(res, "Port discharger deleted successfully");
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in deleteportdischarger controller:", error);
      return SendError(res, 500, "Error deleting port discharger.");
    }
  }

}
module.exports = portdischargerController;
