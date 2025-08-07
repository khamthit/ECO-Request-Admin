const {sequelize} = require("../config/db");
const {Op} = require("sequelize");
const moment = require("moment");

class savelogService {
  //this is insert
    static async insertLog(logData) {
        try {
            const {tablename, newdata, olddata, action, createBy} = logData;
            //this is insert by procedure
            const query = await sequelize.query(`CALL pd_saveLog(:tablename, :newdata, :olddata, :action, :createBy)`, {
                replacements: {
                    tablename,
                    newdata: JSON.stringify(newdata),
                    olddata: JSON.stringify(olddata),
                    action,
                    createBy,
                },
                type: sequelize.QueryTypes.RAW,
            }
            );
            return query;
            
        } catch (error) {
            console.error("Error in insertLog service:", error);
            throw new Error("Error inserting log data.");
            
        }
    }
}
module.exports = savelogService;