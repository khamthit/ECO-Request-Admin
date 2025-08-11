const { sequelize } = require("../config/db");
const { Op } = require("sequelize");
const unitModel = require("../models/unitModel");

class unitService {
  //this is insert data
  static async newunit(getData) {
    try {
      const { code, unitName, creeateBy } = getData;
      //this is check data first with status = 1
      const checkData = await unitModel.findOne({
        where: {
          code: code,
          unitName: unitName,
          statusId: 1,
        },
      });
      if (checkData) {
        return { message: "Duplicate Data." };
      }
      //this is save data by function in deatabase
      const newData = sequelize.query(
        `
                Select f_insertUnit(:code, :unitName, :creeateBy) as result;
                `,
        {
          replacements: {
            code: code,
            unitName: unitName,
            creeateBy: creeateBy,
          },
        }
      );
      return newData;
    } catch (error) {
      throw new Error("Could not add new unit: " + error.message);
    }
  }
  static async updateunit(getData) {
    try {
      const { Id, code, unitName, creeateBy } = getData;
      //this is check data first with status = 1
      const checkData = await unitModel.findOne({
        where: {
          code: code,
          unitName: unitName,
          statusId: 1,
        },
      });
      if (checkData) {
        return { message: "Duplicate Data." };
      }
      //this is update table without query
      const updateData = await unitModel.update(
        {
          code: code,
          unitName: unitName,
          creeateBy: creeateBy,
        },
        {
          where: {
            Id: Id,
          },
        }
      );
      return updateData;
    } catch (error) {
      throw new Error("Could not update unit: " + error.message);
    }
  }
  static async getunitbyId(Id) {
    try {        
      const unit = await unitModel.findOne({
        where: {
          Id: Id,
          statusId: 1,
        },
      });
      return unit;      
        
    } catch (error) {        
      throw new Error("Could not get unit by Id: " + error.message);
      
    }
  }
  //this is get all unit by page, limit and search
  static async getunit(page, limit, search) {
    try {
        
      const offset = (page - 1) * limit;
      let whereClause = { statusId: 1 };
      if (search && search.trim() !== "") {
        const searchConditions = [
          { code: { [Op.iLike]: `%${search}%` } },
          { unitName: { [Op.iLike]: `%${search}%` } },
        ];
        whereClause = {
          [Op.and]: [{ statusId: 1 }, { [Op.or]: searchConditions }],
        };
      }
      const result = await unitModel.findAndCountAll({
        where: whereClause,
        limit: limit,
        offset: offset,
        order: [["code", "ASC"]],
      });
      return result;
        
    } catch (error) {        
      throw new Error("Could not get unit: " + error.message);
    }
  }
  //this is delete unit id
  static async deleteunit(getData) {
    try {
        
      const { Id } = getData;
      const deletedata = await unitModel.update(
        { statusId: 2 },
        { where: { Id: Id } }
      );
      return deletedata;
    } catch (error) {        
      throw new Error("Could not delete unit: " + error.message);
      
    }
  }
}
module.exports = unitService;
