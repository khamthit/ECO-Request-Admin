const { sequelize } = require("../config/db");
const userclientsModel = require("../models/userclientsModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const genderModel = require("../models/genderModel");

class userclientsService {
  static async userclientlogin({ userlogin, passwords }) {
    try {
      // Find the user by their email address first.
      const user = await userclientsModel.findOne({
        where: {
          email: userlogin,
        },
      });

      if (!user) {
        // User not found.
        return null;
      }

      // User found, now compare the provided password with the stored hash.
      const isMatch = await bcrypt.compare(passwords, user.password);

      if (!isMatch) {
        // Passwords do not match.
        return null;
      }

      // Create a payload for the JWT token
      const payload = {
        id: user.Id,
        email: user.email,
      };

      // Sign the token. Use a strong secret from your environment variables.
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "8h",
      });

      const userResponse = user.toJSON();
      delete userResponse.password;

      return { user: userResponse, tokenKey: token };
    } catch (error) {
      console.log("error in login service", error);
      throw error;
    }
  }
  static async newuserAdmin(getData) {
    try {
      const { email, password, name, surname, tel, createBy, genderId } =
        getData;
      console.log("getData in newuserAdmin service", getData);
      //this is check data first
      const existingUser = await userclientsModel.findOne({
        where: { email: email, statusId: 1 },
      });
      if (existingUser) {
        return {
          error: "DUPLICATE_EMAIL",
          message: "User with this email already exists.",
        };
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      //this is save data by function purcedure sequalize
      const result = await sequelize.query(
        `
  Select f_newuserAdmin(:email::varchar(100), :password::varchar(100), :name::varchar(100), :surname::varchar(100), :tel::varchar(100), :createBy::varchar(100), :genderId::integer) as result`,
        {
          replacements: {
            email,
            password: hashedPassword,
            name,
            surname,
            tel,
            createBy,
            genderId,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      return result[0] || null;
    } catch (error) {
      console.log("error in new user service", error);
      throw error;
    }
  }
  static async changepassword({ email, password }) {
    try {
      // Hash the new password before updating the database.
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const result = await userclientsModel.update(
        { password: hashedPassword },
        { where: { email: email, statusId: 1 } }
      );
      return result;
    } catch (error) {
      console.log("error in change password service", error);
      throw error;
    }
  }
  //this is get user all with pagination and statusId = 1 and search text like username or email
  static async getuser({ page, limit, searchtext }) {
    try {
      const currentPage = page ? parseInt(page, 10) : 1;
      const pageLimit = limit ? parseInt(limit, 10) : 10;
      const offset = (currentPage - 1) * pageLimit;

      const whereCondition = {
        statusId: 1,
      };
      if (searchtext && searchtext.trim() !== "") {
        whereCondition[Op.or] = [
          { email: { [Op.iLike]: `%${searchtext}%` } },
          { name: { [Op.iLike]: `%${searchtext}%` } },
          { surname: { [Op.iLike]: `%${searchtext}%` } },
          { tel: { [Op.iLike]: `%${searchtext}%` } },
        ];
      }

      const { count, rows } = await userclientsModel.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: genderModel,
            as: "gender",
            attributes: ["genderName"],
          },
        ],
        limit: pageLimit,
        offset: offset,
        order: [["createDate", "DESC"]],
        attributes: { exclude: ["password"] }, // Exclude password from results
      });

      return {
        items: rows,
        totalItems: count,
        totalPages: Math.ceil(count / pageLimit),
        currentPage: currentPage,
      };
    } catch (error) {
      console.log("error in get user service", error);
      throw error;
    }
  }
}
module.exports = userclientsService;
