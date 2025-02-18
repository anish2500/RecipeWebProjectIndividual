import {User} from "../../model/userSchema.js"
import { generateToken } from "../../security/jwt-util.js";
import bcrypt from 'bcrypt';

const login = async (req, res) => {
    try {
      //fetching all the data from users table
      if (req.body.email == null) {
        return res.status(400).send({ message: "Email is required" });
      }
      if (req.body.password == null) {
        return res.status(400).send({ message: "Password is required" });
      }
      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Compare password using bcrypt
      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
      
      if (isPasswordValid) {
        const token = generateToken({ user: user.toJSON() });
        return res.status(200).send({
          data: { access_token: token },
          message: "Successfully logged in",
        });
      } else {
        return res.status(401).send({ message: "Invalid password" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Failed to login" });
    }
};

const init = async (req, res) => {
    try {
      const user = req.user.user;
      delete user.password;
      res
        .status(201)
        .send({ data: user, message: "Successfully fetched current user" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Failed to fetch users" });
    }
};

export const authController = {
    login,
    init,
};
