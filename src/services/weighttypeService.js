const { sequelize } = require("../config/db");
const { Op } = require("sequelize");
const moment = require("moment");
const weighttypeModel = require("../models/weighttypeModel");

class weighttypeService {
  static async newweighttype(getData) {
    try {
      const { code, weightName, createBy } = getData;
      //this is check data first
      const existingData = await weighttypeModel.findOne({
        where: {
          [Op.or]: [{ code: code }, { weightName: weightName }],
          statusId: 1,
        },
      });
      if (existingData) {
        return { message: "Duplicate Data." };
      }
      //create new weighttype with function command.
      const result = await sequelize.query(
        `
                select f_insertWeight (:code, :weightName, :createBy) as result`,
        {
          replacements: { code, weightName, createBy },
          type: sequelize.QueryTypes.INSERT,
        }
      );
      return result;
    } catch (error) {
      console.error("Error in newweighttype service:", error);
      throw error;
    }
  }
  static async updateweighttype(getData) {
    try {
      const { Id, code, weightName, createBy } = getData;
      //this is check data first
      const existingData = await weighttypeModel.findOne({
        where: {
          [Op.or]: [{ code: code }, { weightName: weightName }],
          statusId: 1,
        },
      });
      if (existingData) {
        return { message: "Duplicate Data." };
      }
      //update weighttype without function and procedure command.
      const result = await weighttypeModel.update(
        {
          code: code,
          weightName: weightName,
          createBy: createBy,
        },
        {
          where: { Id: Id },
        }
      );
      return result;
    } catch (error) {
      console.error("Error in updateweighttype service:", error);
      throw error;
    }
  }
  static async getweighttypebyId(Id) {
    try {
      const weighttype = await weighttypeModel.findOne({
        where: { Id: Id, statusId: 1 },
      });
      return weighttype;
    } catch (error) {
      console.error("Error in getweighttypebyId service:", error);
      throw error;
    }
  }
  static async deleteweighttype(getData) {
    try {
      const { Id } = getData;
      //this is delete or update status id = 2
      const result = await weighttypeModel.update(
        { statusId: 2 },
        { where: { Id: Id } }
      );
      return result;
    } catch (error) {
      console.error("Error in deleteweighttype service:", error);
      throw error;
    }
  }
  //this is getallweighttype with page, limit, search
  static async getweighttype(page, limit, search) {
    try {
      const offset = (page - 1) * limit;
      let whereClause = { statusId: 1 };
      if (search && search.trim() !== "") {
        const searchConditions = [
          { code: { [Op.iLike]: `%${search}%` } },
          { weightName: { [Op.iLike]: `%${search}%` } },
        ];
        whereClause = {
          [Op.and]: [{ statusId: 1 }, { [Op.or]: searchConditions }],
        };
      }
      const result = await weighttypeModel.findAndCountAll({
        where: whereClause,
        limit: limit,
        offset: offset,
        order: [["code", "ASC"]],
      });
      return result;
    } catch (error) {
      console.error("Error in getweighttype service:", error);
      throw error;
    }
  }
}
module.exports = weighttypeService;
