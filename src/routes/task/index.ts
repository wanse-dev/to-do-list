import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  getTasksByUser,
  updateTitle,
  completeTask,
  undoneTask,
  disableTask,
  enableTask,
  deleteTask,
} from "../../controllers/task/index";

const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.get("/user/:firebaseUid", getTasksByUser);
router.put("/update/:id", updateTitle);
router.patch("/complete/:id", completeTask);
router.patch("/undone/:id", undoneTask);
router.patch("/disable/:id", disableTask);
router.patch("/enable/:id", enableTask);
router.delete("/:id", deleteTask);

export default router;