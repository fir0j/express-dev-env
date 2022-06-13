import express from "express";
import {
  postUsers,
  deleteUsers,
  getAllUsers,
  getUsersById,
  putUsers,
  patchUsers,
} from "../controllers/user.controller";
const router = express.Router();

router.get("/users", getAllUsers);
router.get("/users/:id", getUsersById);
router.post("/users", postUsers);
router.put("/users/:id", putUsers);
router.patch("/users/:id", patchUsers);
router.delete("/users/:id", deleteUsers);

export default router;
