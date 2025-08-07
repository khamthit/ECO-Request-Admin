const { sequelize } = require("../config/db.js");
const { Op } = require("sequelize");
const origincriterionModel = require("../models/origincriterionModel");
class origincriterionService {
  static async neworigincriterion(data) {
    try {
      const { code, originName, createBy } = data;
      //this is check data first
      const existingCriterion = await origincriterionModel.findOne({
        where: {
          [Op.or]: [{ code: code }, { originName: originName }],
          statusId: 1,
        },
      });
      if (existingCriterion) {
        return { error: "DUPLICATE", message: "Duplicate Data." };
      }

      //this is create new origin criterion with function
      const result = await sequelize.query(
        `
                select f_neworigincriterion(:code, :originName, :createBy) as result
                `,
        {
          replacements: { code, originName, createBy },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      return result[0] || null;
    } catch (error) {
      console.error("Error in neworigincriterion:", error);
      throw error;
    }
  }
  static async updateorigincriterion(data) {
    try {
      const { Id, code, originName, updateBy } = data;
      //this is check data first
      const existingCriterion = await origincriterionModel.findOne({
        where: {
          [Op.or]: [{ code: code }, { originName: originName }],
          statusId: 1,
        },
      });
      if (existingCriterion) {
        return { error: "DUPLICATE", message: "Duplicate Data." };
      }
      //this is update origin criterion without function and procedure
      const result = await origincriterionModel.update(
        {
          code: code,
          originName: originName,
        },
        {
          where: { Id: Id },
        }
      );
      return result;
    } catch (error) {
      console.error("Error in updateorigincriterion:", error);
      throw error;
    }
  }
  static async getOriginCriterionById(Id) {
    try {
      const criterion = await origincriterionModel.findOne({
        where: { Id: Id, statusId: 1 },
      });
      return criterion;
    } catch (error) {
      console.error("Error in getOriginCriterionById:", error);
      throw error;
    }
  }
  static async deleteorigincriterion(getData) {
    try {
      const { Id, createBy } = getData;
      //this is update statusId to 2 (deleted)
      const result = await origincriterionModel.update(
        { statusId: 2, updateBy: createBy },
        { where: { Id: Id } }
      );
      return result;
    } catch (error) {
      console.error("Error in deleteorigincriterion:", error);
      throw error;
    }
  }
  static async getAllOriginCriteria({ page, limit, search }) {
    try {
      const offset = (page - 1) * limit;
      let whereClause = { statusId: 1 };
      if (search && search.trim() !== "") {
        const searchConditions = [
          { code: { [Op.iLike]: `%${search}%` } },
          { originName: { [Op.iLike]: `%${search}%` } },
        ];
        whereClause = {
          [Op.and]: [{ statusId: 1 }, { [Op.or]: searchConditions }],
        };
      }
      const result = await origincriterionModel.findAndCountAll({
        where: whereClause,
        limit: limit,
        offset: offset,
        order: [["code", "ASC"]],
      });
      return result;
    } catch (error) {
      console.error("Error in getAllOriginCriteria:", error);
      throw error;
    }
  }
}
module.exports = origincriterionService;
