const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const rolegroupdetailsModel = require("../models/rolegroupdetailsModel");
const { Op } = require("sequelize");
const { create } = require("domain");
const rolegroupModel = require("../models/rolegroupModel");
const userclientsModel = require("../models/userclientsModel");

class rolegroupdetailsService {
  static async newrolegroupdetails(getData) {
    try {
      const { userAdminId, roleGroupId, createBy, approveForm } = getData;
      //this is check data first
      const existingRoleGroupDetails = await rolegroupdetailsModel.findOne({
        where: { userAdminId: userAdminId, roleGroupId: roleGroupId },
      });
      if (existingRoleGroupDetails) {
        return { message: "Duplicate Data." };
      }
      //this is save data by function
      const result = await sequelize.query(
        `
                Select f_insertRoleGroupDetails(:userAdminId, :roleGroupId, :approveForm, :createBy) as result
                `,
        {
          replacements: { userAdminId, roleGroupId, approveForm, createBy },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      return result;
    } catch (error) {
      console.error("Error in newrolegroupdetails service:", error);
      throw error;
    }
  }

  //this is fect data page, limit, search
  static async getAllRoleGroupDetails(page, limit, search) {
    try {
      const offset = (page - 1) * limit;
      let whereClause = { statusId: 1 };

      if (search && search.trim() !== "") {
        whereClause = {
          [Op.and]: [
            { statusId: 1 },
            {
              [Op.or]: [
                { "$userAdmin.email$": { [Op.iLike]: `%${search}%` } },
                { "$userAdmin.name$": { [Op.iLike]: `%${search}%` } },
                { "$userAdmin.surname$": { [Op.iLike]: `%${search}%` } },
                { "$roleGroup.roleGroupName$": { [Op.iLike]: `%${search}%` } },
                { approveForm: { [Op.iLike]: `%${search}%` } },
              ],
            },
          ],
        };
      }

      const result = await rolegroupdetailsModel.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: rolegroupModel,
            as: "roleGroup",
            attributes: ["roleGroupName"],
          },
          {
            model: userclientsModel,
            as: "userAdmin",
            attributes: ["email", "name", "surname"],
          },
        ],
        limit: limit,
        offset: offset,
        order: [["roleGroupId", "ASC"]],
      });
      return result;
    } catch (error) {
      console.error("Error in getAllRoleGroupDetails service:", error);
      throw error;
    }
  }

  static async updaterolegroupdetails(getData) {
    try {
      const { Id, userAdminId, roleGroupId, approveForm, createBy } = getData;

      //this is update data without function
      const result = await rolegroupdetailsModel.update(
        { userAdminId, roleGroupId, approveForm, createBy },
        { where: { Id: Id } }
      );
      return result;
    } catch (error) {
      console.error("Error in updaterolegroupdetails service:", error);
      throw error;
    }
  }
  static async getrolegroupdetailsById(Id) {
    try {
      const result = await rolegroupdetailsModel.findOne({
        where: { Id: Id, statusId: 1 },
      });
      return result;
    } catch (error) {
      console.error("Error in getrolegroupdetailsById service:", error);
      throw error;
    }
  }
  static async deleterolegroupdetails(getData) {
    try {
      const { Id } = getData;
      //this is update statusId to 2
      const result = await rolegroupdetailsModel.update(
        { statusId: 2 },
        { where: { Id: Id } }
      );
      return result;
    } catch (error) {
      console.error("Error in deleterolegroupdetails service:", error);
      throw error;
    }
  }
  static async deleterolegroupdetailsbyuserId(getData){
    try {        
      const { userAdminId } = getData;
      //this is update statusId to 2
      const result = await rolegroupdetailsModel.update(
        { statusId: 2 },
        { where: { userAdminId: userAdminId } }
      );
      return result;
    } catch (error) {        
      console.error("Error in deleterolegroupdetailsbyuserId service:", error);
      throw error;      
    }
  }
  static async getrolegroupdetailbyuserId(getData){
    try {
      const { userAdminId } = getData;
      const result = await rolegroupdetailsModel.findAll({
        where: { userAdminId: userAdminId, statusId: 1 },
      });
      return result;
    } catch (error) {
      console.error("Error in getrolegroupdetailbyuserId service:", error);
      throw error;
      
    }
  }
}
module.exports = rolegroupdetailsService;
