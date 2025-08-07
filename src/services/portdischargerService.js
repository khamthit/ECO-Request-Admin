const { sequelize } = require("../config/db");
const { Op } = require("sequelize");
const moment = require("moment");
const portdischargerModel = require("../models/portdischargerModel");

class pordischargerService {
  static async getportdischarger(page, limit, search) {
    try {
      //using where statusId = 1 for active records
      let whereClause = { statusId: 1 };
      if (search && search.trim() !== "") {
        const searchConditions = [
          { portDischargerName: { [Op.iLike]: `%${search}%` } },
        ];
        whereClause = {
          [Op.and]: [{ statusId: 1 }, { [Op.or]: searchConditions }],
        };
      }
      const offset = (page - 1) * limit;
      const portDischargers = await portdischargerModel.findAndCountAll({
        where: whereClause,
        limit: limit,
        offset: offset,
        order: [["portDischargerName", "ASC"]],
      });
      return portDischargers;
    } catch (error) {
      throw error;
    }
  }
  static async getportdischargerById(id) {
    try {
      const portDischarger = await portdischargerModel.findOne({
        where: { Id: id },
      });
      if (!portDischarger) {
        throw new Error("Port discharger not found.");
      }
      return portDischarger;
    } catch (error) {
      console.error("Error in getportdischargerById service:", error);
      throw error;
    }
  }
  static async newportdischarger(getData) {
    try {
      const { code, portDischargerName, createBy } = getData;
      // Check for duplicate data (either code or portDischargerName)
      const existingData = await portdischargerModel.findOne({
        where: {
          [Op.or]: [{ code: code }, { portDischargerName: portDischargerName }],
          statusId: 1,
        },
      });
      if (existingData) {
        return { status: "duplicate", message: "Duplicate data found." };
      }
      //create new portdischarger with function command.
      const result = await sequelize.query(
        `SELECT f_newportdischarger(:code, :portDischargerName, :createBy)`,
        {
          replacements: {
            code: code,
            portDischargerName: portDischargerName,
            createBy: createBy,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      return result[0] || null;
    } catch (error) {
      console.error("Error in newportdischarger service:", error);
      throw error;
    }
  }
  static async updateportdischarger(getData) {
    try {
      const { Id, code, portDischargerName, createBy } = getData;
      // Check if another record with the same code or name already exists.
      const existingData = await portdischargerModel.findOne({
        where: {
          [Op.or]: [{ code: code }, { portDischargerName: portDischargerName }],
          statusId: 1, // Exclude the current record from the check
        },
      });
      if (existingData) {
        return { status: "duplicate", message: "Duplicate data found." };
      }
      //update pordischarger without function and procedure command.
      const result = await portdischargerModel.update(
        {
          code: code,
          portDischargerName: portDischargerName,
          createBy: createBy,
          createDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          where: { Id: Id },
        }
      );
      return result;
    } catch (error) {
      console.error("Error in updateportdischarger service:", error);
      throw error;
    }
  }
  static async deleteportdischarger(getData) {
    try {
      const { Id, createBy } = getData;
      //this is delete or update status id = 2
      const result = await portdischargerModel.update(
        { statusId: 2 },
        { where: { Id: Id } }
      );
      return result;
    } catch (error) {
      console.error("Error in deleteportdischarger service:", error);
      throw error;
    }
  }
}
module.exports = pordischargerService;
