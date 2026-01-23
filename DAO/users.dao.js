import mongodb from "mongodb";
import ApiError from "../utils/ApiError.util.js";
const ObjectId = mongodb.ObjectId;


let users;

export default class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      users = await conn.db().collection("users");
    } catch (e) {
      throw new ApiError(500, e.message || "Internal Server Error");
    }
  }

  static async addUser(name, email, hashedPassword) {
    try {
      const userDoc = {
        name: name,
        email: email,
        password: hashedPassword,
      };
      return await users.insertOne(userDoc);
    } catch (e) {
      throw new ApiError(500, e.message || "Internal Server Error");
    }
  }

  static async loginUser(email) {
    try {
      return await users.findOne({ email: email });
    } catch (e) {
      throw new ApiError(500, e.message || "Internal Server Error");
    }
  }

  static async getUserByID(id) {
    try {
      return await users.findOne({ _id: new ObjectId(id) });
    } catch (e) {
      throw new ApiError(500, e.message || "Internal Server Error");
    }
  }
}
