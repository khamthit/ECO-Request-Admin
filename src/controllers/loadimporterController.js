const {
  SendCreate,
  SendSuccess,
  SendError400,
  SendError,
  SendDuplicateData,
} = require("../utils/response");
const jwt = require("jsonwebtoken");
const loadimporterService = require("../services/loadimporterService");
const savelogService = require("../services/savelogService");

class loadimporterController {
  async createLoadImporter(req, res) {
    try {
      const { code, loadImporterName } = req.body;
      const createBy = req.user.email; // Use the integer user ID from the token
      if (!code || !loadImporterName) {
        return SendError400(res, "Code and Load Importer Name are required.");
      }

      const result = await loadimporterService.createLoadImporter({
        code,
        loadImporterName,
        createBy,
      });

      if (result && result.error === "DUPLICATE") {
        return SendDuplicateData(res, result.message);
      }

      return SendCreate(res, result.message, result.data);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error creating load importer:", error);
      return SendError(
        res,
        500,
        "Error creating load importer in controllers."
      );
    }
  }
  async updateLoadImporter(req, res) {
    try {
      const { Id, code, loadImporterName } = req.body;
      const createBy = req.user.email; // Use the integer user ID from the token
      if (!Id || !code || !loadImporterName) {
        return SendError400(
          res,
          "ID, Code, and Load Importer Name are required."
        );
      }
      //this is olddata
      const oldData = await loadimporterService.getLoadImporterById({ Id });
      if (!oldData) {
        return SendError(res, 404, "Load importer not found.");
      }

      const result = await loadimporterService.updateloadimporter({
        Id,
        code,
        loadImporterName,
        createBy,
      });
      if (result && result.error === "DUPLICATE") {
        return SendDuplicateData(res, result.message);
      }
      //this is save log
      const tablename = "loadImporter";
      const action = "Update";
      await savelogService.insertLog({
        tablename,
        newdata: req.body,
        olddata: oldData.dataValues,
        action: "UPDATE",
        createBy,
      });

      return SendSuccess(res, "Load importer updated successfully", req.body);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error updating load importer:", error);
      return SendError(
        res,
        500,
        "Error updating load importer in controllers."
      );
    }
  }
  async deleteLoadImporter(req, res) {
    try {
      const { Id } = req.body;
      const createBy = req.user.email; // Use the integer user ID from the token
      if (!Id) {
        return SendError400(res, "ID is required.");
      }

      //this is olddata
      const oldData = await loadimporterService.getLoadImporterById({ Id });
      if (!oldData) {
        return SendError(res, 404, "Load importer not found.");
      }

      //this is delete data without function and procedure
      const deletedata = await loadimporterService.deleteLoadImporter({ Id });
      if (deletedata[0] === 0) {
        return SendError(res, 404, "Load importer not found or already deleted.");
      }

      //this is save log
      const tablename = "loadImporter";
      const action = "Delete";
      await savelogService.insertLog({
        tablename,
        newdata: req.body,
        olddata: oldData.dataValues,
        action: "DELETE",
        createBy,
      });
      return SendSuccess(res, "Load importer deleted successfully", req.body);
      
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error deleting load importer:", error);
      return SendError(res, 500, "Error deleting load importer in controllers.");
      
    }
  }

  async getloadimporter(req, res) {
    try {
      const { page, limit, search } = req.query;
      const pageNumber = parseInt(page) || 1; // Default to page 1 if not provided
      const limitNumber = parseInt(limit) || 10; // Default to 10 items
      const loadImporters = await loadimporterService.getloadimporter(
        pageNumber,
        limitNumber,
        search
      );
      if (!loadImporters || loadImporters.length === 0) {
        return SendError(res, 404, "No load importers found.");
      }
      return SendSuccess(
        res,
        "Load importers fetched successfully",
        loadImporters
      );      
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error fetching load importers:", error);
      return SendError(res, 500, "Error fetching load importers in controllers.");
      
    }
  }
}
module.exports = loadimporterController;
