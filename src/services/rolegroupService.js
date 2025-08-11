const rolegroupModel = require("../models/rolegroupModel");
const { sequelize } = require("../config/db");
const { Op } = require("sequelize");

class rolegroupService {
  static async newrolegroup(getData) {
    try {
      const { roleGroupName, createBy } = getData;
      //this is check data first
      const existingRoleGroup = await rolegroupModel.findOne({
        where: { roleGroupName: roleGroupName, statusId: 1 },
      });
      if (existingRoleGroup) {
        return { message: "Duplicate Data." };
      }
      //this is save data by function
      const result = await sequelize.query(
        `
                Select f_insertRoleGroup(:roleGroupName, :createBy) as result
                `,
        {
          replacements: { roleGroupName, createBy },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      return result;
    } catch (error) {
      console.error("Error in newrolegroup service:", error);
      throw error;
    }
  }
  static async updaterolegroup(getData) {
    try {
      const { Id, rolegroup, createBy } = getData;
      //this is check data first
      const existingRoleGroup = await rolegroupModel.findOne({
        where: { roleGroupName: rolegroup, statusId: 1 },
      });
      if (existingRoleGroup) {
        return { message: "Duplicate Data." };
      }
      //this is update data without function
      const result = await rolegroupModel.update(
        { roleGroupName: rolegroup },
        { where: { Id: Id } }
      );
      return result;
    } catch (error) {
      console.error("Error in updaterolegroup service:", error);
      throw error;
    }
  }
  static async getrolegroupById(Id) {
    try {
      const result = await rolegroupModel.findOne({
        where: { Id: Id, statusId: 1 },
      });
      return result;
    } catch (error) {
      console.error("Error in getrolegroupById service:", error);
      throw error;
    }
  }
  static async deleterolegroup(getData) {
    try {
      const { Id } = getData;
      //this is update statusId to 2
      const result = await rolegroupModel.update(
        { statusId: 2 },
        { where: { Id: Id } }
      );
      return result;
    } catch (error) {
      console.error("Error in deleterolegroup service:", error);
      throw error;
    }
  }
  //this is get all data rolegroup with page, limit, search
  static async getAllRoleGroup(page, limit, search) {
    try {
      const offset = (page - 1) * limit;
      let whereClause = { statusId: 1 };
      if (search && search.trim() !== "") {
        const searchConditions = [
          { roleGroupName: { [Op.iLike]: `%${search}%` } },
        ];
        whereClause = {
          [Op.and]: [{ statusId: 1 }, { [Op.or]: searchConditions }],
        };
      }
      const result = await rolegroupModel.findAndCountAll({
        where: whereClause,
        limit: limit,
        offset: offset,
        order: [["roleGroupName", "ASC"]],
      });
      return result;
    } catch (error) {
      console.error("Error in getAllRoleGroup service:", error);
      throw error;
    }
  }
}
module.exports = rolegroupService;
