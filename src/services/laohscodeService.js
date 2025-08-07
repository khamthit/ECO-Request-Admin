const { sequelize } = require("../config/db");
const { Op } = require("sequelize");
const moment = require("moment");
const laohscodeModel = require("../models/laohscodeModel");

class laohscodeService {
  static async newlaohscode(getData) {
    try {
      const { code, hscodeName, createBy } = getData;
      // Check if the code already exists
      const existingCode = await laohscodeModel.findOne({
        where: {
          [Op.or]: [{ code: code }, { hscodeName: hscodeName }],
        },
      });
      if (existingCode) {
        throw new Error("Duplicate code or hscodeName.");
      }
      // Create a new record with function moment
      const result = await sequelize.query(
        `SELECT f_newlaohscode(:code, :hscodeName, :createBy)`,
        {
          replacements: { code, hscodeName, createBy },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      return result[0];
    } catch (error) {
      console.error("Error in newlaohscode:", error);
      throw error;
    }
  }
  static async updatelaohscode(getData) {
    try {
        const { Id, code, hscodeName, createBy } = getData;
        // Check if the code already exists for another record
        const existingCode = await laohscodeModel.findOne({ 
             where: {
          [Op.or]: [{ code: code }, { hscodeName: hscodeName }],
          statusId: 1,
        },
            });
        if (existingCode) {
           return { error: 'DUPLICATE', message: 'Duplicate code or laoHScode.' };
        }
        //Update table hsLaocode
        const result = await laohscodeModel.update(
            { code: code, hscodeName: hscodeName, updateBy: createBy },
            { where: { Id: Id } }
        );
        return result;
        
    } catch (error) {
      console.error("Error in updatelaohscode:", error);
      throw error;
        
    }
  }
  static async deletelaohscode(getData) {
    try {
      const { Id, createBy } = getData;
      // Soft delete by updating statusId to 2
      const result = await laohscodeModel.update(
        { statusId: 2, updateBy: createBy },
        { where: { Id: Id } }
      );
      return result;
    } catch (error) {
      console.error("Error in deletelaohscode:", error);
      throw error;
    }
  }
  static async getlaohscodeById(getData) {
    try {
      const { Id } = getData;
      const result = await laohscodeModel.findOne({
        where: { Id: Id, statusId: 1 },
      });
      return result;
    } catch (error) {
      console.error("Error in getlaohscodeById:", error);
      throw error;
    }
  }
  static async getlaohscode(page, limit, search) {
    try {
        const offset = (page - 1) * limit;
        const whereCondition = search
            ? {
                [Op.or]: [
                { code: { [Op.like]: `%${search}%` } },
                { hscodeName: { [Op.like]: `%${search}%` } },
                ],
            }
            : {};
    
        const result = await laohscodeModel.findAndCountAll({
            where: {
            ...whereCondition,
            statusId: 1,
            },
            limit: limit,
            offset: offset,
            order: [["Id", "DESC"]],
        });
    
        return result;
        
    } catch (error) {
      console.error("Error in getlaohscode:", error);
      throw error;
        
    }
  }
    
      
}
module.exports = laohscodeService;
