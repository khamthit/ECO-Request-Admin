const {
  SendCreate,
  SendSuccess,
  SendError400,
  SendError,
  SendDuplicateData,
} = require("../utils/response");
const jwt = require("jsonwebtoken");
const userclientsService = require("../services/userclientsService");

class userclientsController {
  async userclientlogin(req, res) {
    try {
      const { userlogin, passwords } = req.body;
      const datas = await userclientsService.userclientlogin({
        userlogin,
        passwords,
      });
      if (!datas) {
        return SendError400(res, "Invalid username or password.");
      }
      return SendSuccess(res, "Login successful", datas);
    } catch (error) {
      console.error("Error in userclientlogin controller:", error);
      return SendError(res, 500, "Error logging in.");
    }
  }
  async newuserAdmin(req, res) {
    try {
      const { email, password, name, surname, tel, genderId } = req.body;
      //this is using tokenkey
      const createBy = req.user.id;


      const result = await userclientsService.newuserAdmin({
        email,
        password,
        name,
        surname,
        tel,
        createBy,
        genderId,
      });

      if (result && result.error === "DUPLICATE_EMAIL") {
        return SendDuplicateData(
          res,
          "Duplicate email found. User with this email already exists."
        );
      }

      // Assuming the service returns the created user or a success object on success
      return SendCreate(res, "User created successfully", result);
    } catch (error) {
      //console.error("Error in newuserAdmin controller:", error);
      return SendError(res, 500, error.message || "Error creating user.");
    }
  }
  async updatepassword(req, res) {
    try {
      const { email, password } = req.body;
      if (!password) {
        return SendError400(res, "A new password is required.");
      }
      // Call the service with a single object containing email and the new password.
      const result = await userclientsService.changepassword({ email, password });

      // The service returns the number of updated rows, e.g., [1] or [0].
      if (!result || result[0] === 0) {
        return SendError400(res, "User not found or password could not be updated.");
      }
      return SendSuccess(res, "Password updated successfully");
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return SendError(res, 401, "Token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return SendError(res, 401, "Token is invalid.");
      }
      console.error("Error in updatepassword controller:", error);
      return SendError(res, 500, "Error updating password.");
    }
  }
  async getuserall(req, res) {
    try {
        
      const { page, limit, searchtext } = req.query;
      const datas = await userclientsService.getuser({
        page,
        limit,
        searchtext,
      });
      if (!datas || datas.items.length === 0) {
        return SendError400(res, "Not Found data.");
      }
      return SendSuccess(res, "Fect data is successful", datas);
        
    } catch (error) {
      console.error("Error in getuserall controller:", error);
      return SendError(res, 500, "Error retrieving users.");
        
    }
  }
}
module.exports = userclientsController;
