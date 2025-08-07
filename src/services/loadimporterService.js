const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");
const { Op } = require("sequelize");
const loadimporterModel = require("../models/loadimporterModel.js");

class LoadImporterService {
  //this is insert data
  static async createLoadImporter(data) {
    try {
      const { code, loadImporterName, createBy } = data;
      console.log("data", data);
      // Check if data with the same code or name already exists
      const existingImporter = await loadimporterModel.findOne({
        where: {
          [Op.or]: [{ code: code }, { loadImporterName: loadImporterName }],
          statusId: 1,
        },
      });

      if (existingImporter) {
        return {
          error: "DUPLICATE",
          message: "Duplicate code or load importer name.",
        };
      }

      // Use Sequelize's `create` with function
      const newImporter = await sequelize.query(
        `Select f_newloadimporter (:code ::varchar(50), :loadImporterName ::TEXT, :createBy ::varchar(50)) AS result`,
        {
          replacements: { code, loadImporterName, createBy },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return {
        message: "Load Importer created successfully.",
        data: newImporter,
      };
    } catch (error) {
      console.error("Error creating load importer:", error);
      throw error; // Re-throw the original error to be handled by the controller
    }
  }
  static async updateloadimporter(getData) {
    try {
      const { Id, code, loadImporterName, createBy } = getData;
      //this is check data first
      const existingImporter = await loadimporterModel.findOne({
        where: {
          [Op.or]: [{ code: code }, { loadImporterName: loadImporterName }],
          statusId: 1,
          Id: { [Op.ne]: Id }, // Exclude the current record from the check
        },
      });
      if (existingImporter) {
        return {
          error: "DUPLICATE",
          message: "Duplicate code or load importer name.",
        };
      }
      //this is update data without fuction and procedure
      const updatedata = await loadimporterModel.update(
        {
          code: code,
          loadImporterName: loadImporterName,
          createBy: createBy,
        },
        {
          where: { Id: Id },
        }
      );
      return updatedata;
    } catch (error) {
      console.error("Error updating load importer:", error);
      throw error; // Re-throw the original error to be handled by the controller
    }
  }

  static async getLoadImporterById({ Id }) {
    try {
      const loadImporter = await loadimporterModel.findOne({
        where: { Id: Id, statusId: 1 },
      });

      if (!loadImporter) {
        return null; // Return null if no record is found
      }
      return loadImporter;
    } catch (error) {
      console.error("Error fetching load importer by ID:", error);
      throw error; // Re-throw the original error to be handled by the controller
    }
  }

  static async deleteLoadImporter({ Id }) {
    try {
      //this is update data without fuction and procedure
      const deletedata = await loadimporterModel.update(
        { statusId: 2 }, // Set statusId to 2 for soft delete
        { where: { Id: Id } }
      );
      return deletedata;
    } catch (error) {
      console.error("Error deleting load importer:", error);
      throw error; // Re-throw the original error to be handled by the controller
    }
  }

  static async getloadimporter(page, limit, search){
    try {
      const offset = (page - 1) * limit;
      let whereClause = { statusId: 1 };
      if (search && search.trim() !== "") {
        const searchConditions = [
          { code: { [Op.iLike]: `%${search}%` } },
          { loadImporterName: { [Op.iLike]: `%${search}%` } },
        ];
        whereClause = {
          [Op.and]: [{ statusId: 1 }, { [Op.or]: searchConditions }],
        };
      }
      const result = await loadimporterModel.findAndCountAll({
        where: whereClause,
        limit: limit,
        offset: offset,
        order: [["code", "ASC"]],
      });
      return result;
      
    } catch (error) {
      console.error("Error fetching load importers:", error);
      throw error; // Re-throw the original error to be handled by the controller
      
    }
  }
}

module.exports = LoadImporterService;
