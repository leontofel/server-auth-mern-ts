import { Request, Response } from 'express';
import { ICadaster } from '../interface/ICadaster';
import IUser from '../interface/IUser';
import users from '../models/Users';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import env from 'dotenv';
import { isAdmin } from '../middleware/auth';
import mongoose from 'mongoose';
env.config();


export class UserController {
  static login = async (req: Request, res: Response) => {
    try {
      const { name, password }: ICadaster = req.body

      if (!name || !password) {
        return res.json({ ok: false, why: 'please insert name and password' })
      }
      if (typeof (name) !== "string" || typeof (password) !== "string") {
        return res.status(500).json({ ok: false, why: 'format is wrong' })
      }

      let user = await users.findOne({ "name": name })

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { user_id: (user._id) },
          process.env.TOKEN_KEY || "TOKENkey",
          {
            expiresIn: "6h",
          }
        );
        return res.status(200).header('auth-token', token).send(`logged as ${name}`);
      }

      return res.status(400).send("Invalid Credentials");

    } catch (err) {
      console.log(err);

    }
  }


  static register = async (req: Request, res: Response) => {
    try {
      const { id, name, email, password, role }: IUser = req.body
      if (!(email && password && id && name)) {
        res.status(400).send("All input is required");
      }
      const oldUser = await users.findOne({ "name": name, "password": password })
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }

      let encryptedUserPassword = await bcrypt.hash(password, 10);

      const user = await users.create({
        "id": id,
        "name": name,
        "email": email.toLocaleLowerCase(),
        "password": encryptedUserPassword,
        "role": "USER"
      });

      const token: string = jwt.sign(
        { user_id: user._id, id },
        process.env.TOKEN_KEY || "TOKENkey",
        {
          expiresIn: "6h",
        }
      );

      return res.status(201).header('auth-token', token).json(user);
    } catch (err) {
      console.log(err);

    }

  }

  static listUsers = (req: Request, res: Response) => {
    if (isAdmin(req, res) === false) {
      return res.status(401).send("Only ADMIN can access")
    }

    users.find()
        .exec((err, users) => {
            if (err) console.log(err);
            return res.status(200).json(users);
        });
}

  static editUser = (req: Request, res: Response) => {
    if (isAdmin(req, res) === false) {
      return res.status(401).send("Only ADMIN can access")
    }
    const id = req.params.id;
    users.find({ "_id": mongoose.Types.ObjectId(id) })
      .updateOne({ $set: req.body }, (err) => {
        if (!err) {
          return res.status(200).send({ message: 'The user was updated.' });
        } else {
          return res.status(500).send({ message: err.message });
        }
      });
  }

  static deleteUser = (req: Request, res: Response) => {
    if (isAdmin(req, res) === false) {
      return res.status(401).send("Only ADMIN can access")
    }
    const id = req.params.id;

    users.find({ "_id": mongoose.Types.ObjectId(id) })
      .deleteOne()
      .exec((err) => {
        if (!err) {
          res.status(200).send({ message: 'user was successfully deleted' })
        } else {
          res.status(500).send({ message: err.message })
        }
      })

  }

}
