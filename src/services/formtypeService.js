const { sequelize } = require("../config/db");
const { Op } = require("sequelize");
const moment = require("moment");
const formtypeModel = require("../models/formtypeModel");
const { SendError } = require("../utils/response");

class formtypeService {
  static async getformtype({ page, limit, searchtext }) {
    try {
      const currentPage = page ? parseInt(page, 10) : 1;
      const pageLimit = limit ? parseInt(limit, 10) : 10;
      const offset = (currentPage - 1) * pageLimit;
      let whereClause = { statusId: 1 };
      if (searchtext && searchtext.trim() !== "") {
        const searchConditions = [
          { typeName: { [Op.iLike]: `%${searchtext}%` } },
        ];
        whereClause = {
          [Op.and]: [{ statusId: 1 }, { [Op.or]: searchConditions }],
        };
      }
      const { count, rows } = await formtypeModel.findAndCountAll({
        attributes: [
          "Id",
          "code",
          "typeName",
          "createDate",
          "createBy",
          "statusId",
        ],
        where: whereClause,
        limit: pageLimit,
        offset: offset,
        order: [["typeName", "ASC"]],
      });
      return {
        items: rows,
        totalItems: count,
        totalPages: Math.ceil(count / pageLimit),
        currentPage: currentPage,
      };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
  static async newformtype(getData) {
    try {
      const { code, typeName, createBy } = getData;
      console.log("getData in newformtype service", getData);
      // 1. Check for duplicate data (either code or typeName)
      const existingData = await formtypeModel.findOne({
        where: {
          [Op.or]: [{ code: code }, { typeName: typeName }],
          statusId: 1,
        },
      });

      if (existingData) {
        // Return a specific object to indicate a duplicate
        return {
          error: "DUPLICATE",
          message: "Duplicate data found.",
        };
      }
      // 2. Use Sequelize's `create` method for better maintainability and safety calling function in procedure
      const result = await sequelize.query(
        `
        select f_newFormtype(:code, :typeName, :createBy) as result
      `,
        {
          replacements: { code, typeName, createBy },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      return result[0] || null;
    } catch (error) {
      console.error("Error in newformtype service:", error);
      // Re-throw the original error to be handled by the controller
      throw error;
    }
  }
  static async updateformtype(getData) {
    try {
      const { Id, code, typeName } = getData;
      //this is check data first
      const existingData = await formtypeModel.findOne({
        where: { code: code, typeName: typeName, statusId: 1 },
      });
      if (existingData) {
        return {
          error: "NOT_FOUND",
          message: "Duplicate data.",
        };
      }
      //this is update table formType without procedure and function
      const result = await formtypeModel.update(
        {
          code: code,
          typeName: typeName,
          createDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          where: { Id: Id, statusId: 1 },
        }
      );
      return result;
      
    } catch (error) {
      console.error("Error in updateformtype service:", error);
      // Re-throw the original error to be handled by the controller
      throw error;
      
    }
  }
  static async deleteformtype(getData){
    try {
      const { Id } = getData;
      //this is delete data in table formType
      const result = await formtypeModel.update(
        { statusId: 2 }, // Set statusId to 0 for soft delete
        { where: { Id: Id} } // Only update if current statusId is 1
      );
      return result;      
    } catch (error) {
      console.error("Error in deleteformtype service:", error);
      // Re-throw the original error to be handled by the controller
      throw error;
      
    }
  }
}

module.exports = formtypeService;
