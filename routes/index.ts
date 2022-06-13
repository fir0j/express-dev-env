import express from "express";
import userRoutes from "./user.route";
import movieRoutes from "./movie.route";
const router = express.Router();

router.use("/", userRoutes);
router.use("/", movieRoutes);
export default router;
