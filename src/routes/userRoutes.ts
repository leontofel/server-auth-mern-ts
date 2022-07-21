import express from "express";
import { UserController } from "../controllers/userController";
import { TokenValidation } from "../middleware/auth";

const router = express.Router();

router
    .get("/users", TokenValidation, UserController.listUsers)
    .post("/users/login", UserController.login)
    .post("/users/register", UserController.register)
    .put("/users/:id", TokenValidation, UserController.editUser)
    .delete("/users/:id", TokenValidation, UserController.deleteUser);

export default router;