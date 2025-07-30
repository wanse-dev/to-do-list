import express from "express";
import userRouter from "./user/";
import taskRouter from "./task/";
import folderRouter from "./folder/";

const router = express.Router();

router.use("/users", userRouter);
router.use("/task", taskRouter);
router.use("/folder", folderRouter);

export default router;
