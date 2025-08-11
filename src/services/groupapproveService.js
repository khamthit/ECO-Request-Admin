const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const moment = require("moment");
const { Op } = require("sequelize");
const groupapproveModel = require("../models/groupapproveModel");
class groupapproveService {
  static async createnewapprove(groupName, createBy) {
    try {
      const existingGroup = await groupapproveModel.findOne({
        where: {
          groupName: groupName,
          statusId: 1,
        },
      });
      if (existingGroup) {
        return { message: "Duplicate Data." };
      }
      const result = await sequelize.query(
        `SELECT f_insertGroupApprove(:groupName, :createBy) as result`,
        {
          replacements: { groupName, createBy },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      return result;
    } catch (error) {
      console.error("Error in createnewapprove service:", error);
      throw error;
    }
  }
  static async updategroupapprove(getData) {
    try {
      const { Id, groupName, createBy } = getData;
      const existingGroup = await groupapproveModel.findOne({
        where: {
          groupName: groupName,
          statusId: 1,
        },
      });
      if (existingGroup) {
        return { message: "Duplicate Data." };
      }
      const result = await groupapproveModel.update(
        {
          groupName: groupName,
          createBy: createBy,
        },
        {
          where: { Id: Id },
        }
      );
      return result;
    } catch (error) {
      console.error("Error in updategroupapprove service:", error);
      throw error;
    }
  }
  static async getgroupapproveById(Id) {
    try {
      const result = await groupapproveModel.findOne({
        where: { Id: Id, statusId: 1 },
      });
      return result;
    } catch (error) {
      console.error("Error in getgroupapproveById service:", error);
      throw error;
    }
  }
  static async deleteapprove(getData) {
    try {
      const { Id } = getData;
      const result = await groupapproveModel.update(
        {
          statusId: 2,
        },
        {
          where: { Id: Id },
        }
      );
      return result;
    } catch (error) {
      console.error("Error in updateapprove service:", error);
      throw error;
    }
  }
  static async getapprovegroup(page, limit, search){
    try {
      const offset = (page - 1) * limit;
      let whereClause = { statusId: 1 };
      if (search && search.trim() !== "") {
        const searchConditions = [
          { groupName: { [Op.iLike]: `%${search}%` } },
        ];
        whereClause = {
          [Op.and]: [{ statusId: 1 }, { [Op.or]: searchConditions }],
        };
      }
      const result = await groupapproveModel.findAndCountAll({
        where: whereClause,
        limit: limit,
        offset: offset,
        order: [["groupName", "ASC"]],
      });
      return result;
    } catch (error) {
      console.error("Error in getapprovegroup service:", error);
      throw error;
    }
  }
}
module.exports = groupapproveService;
