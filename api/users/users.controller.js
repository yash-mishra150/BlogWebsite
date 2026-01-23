import ApiError from "../../utils/ApiError.util.js";
import UsersDAO from "../../DAO/users.dao.js";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../../utils/jwt.util.js";

export class UsersController {
  static async apiLoginUser(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
      }

      const user = await UsersDAO.loginUser(email);

      if (!user) {
        throw new ApiError(401, "Account does not exist");
      }

      if (!(await bcrypt.compare(password, user.password))) {
        throw new ApiError(401, "Invalid email or password");
      }

      const token = generateToken({ id: user._id, email: user.email, name: user.name });

      res.json({ message: "Login successful", token });
    } catch (error) {
      throw new ApiError(
        500,
        error.message || error || "Internal Server Error",
      );
    }
  }

  static async apiAddUser(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        throw new ApiError(400, "Name, email, and password are required");
      }

      const hashedPassword = await bcrypt.hash(
        password,
        parseInt(process.env.SALT_ROUNDS),
      );
      const result = await UsersDAO.addUser(name, email, hashedPassword);

      res.status(201).json({ message: "User added successfully" });
    } catch (error) {
      throw new ApiError(
        500,
        error.message || error || "Internal Server Error",
      );
    }
  }

  static async apiGetUserByID(req, res) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];

      const payload = verifyToken(token);
      const user = await UsersDAO.getUserByID(payload.id);

      if (!user) {
        throw new ApiError(404, "User not found");
      }
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      throw new ApiError(
        500,
        error.message || error || "Internal Server Error",
      );
    }
  }
}

export default UsersController;
