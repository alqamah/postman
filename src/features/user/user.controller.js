import jwt from "jsonwebtoken";
import UserRepository from "./user.repo.js";
import bcrypt from "bcrypt";

const userRepo = new UserRepository();

export default class UserController {
  async signUp(req, res) {
    try {
      const { name, email, password, gender } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userRepo.signUp({ name, email, password: hashedPassword, gender });
      if (user) return res.status(201).send({ msg: "User created successfully", data: user });
      else return res.status(400).send({ msg: "Error in user creation" });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ msg: "Server-side Error" });
    }
  }

  async signIn(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userRepo.findByEmail(email);
      if (user) {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
          const token = jwt.sign({ email: user.email }, 'secretkey');
          res.cookie('jwtToken', token, { httpOnly: true });
          res.cookie('userId', user.id);
          return res.status(200).send({ msg: "User logged in successfully", data: user });
        } else {
          return res.status(401).send({ msg: "Invalid password" });
        }
      } else {
        return res.status(401).send({ msg: "Email does not exist" });
      }
    } catch (err) {
      console.log(err);

      return res.status(400).send({ msg: err.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userRepo.resetPassword(email, hashedPassword);
      return res.status(200).send({ msg: "Password reset successfully", data: user });
    } catch (err) {
      console.log(err);

      return res.status(400).send({ msg: err.message });
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie('jwtToken');
      res.clearCookie('userId');
      return res.status(200).send({ msg: "User logged out successfully" });
    } catch (err) {
      console.log(err);

      return res.status(400).send({ msg: "Error logging out user" });
    }
  }
}