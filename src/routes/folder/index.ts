import express from "express";
import {
  createFolder,
  getFolders,
  getFolderById,
  getFolderByUser,
  updateTitle,
  deleteFolder,
} from "../../controllers/folder/index";

const router = express.Router();

router.post("/", createFolder);
router.get("/", getFolders);
router.get("/:id", getFolderById);
router.get("/user/:firebaseUid", getFolderByUser);
router.patch("/update/:id", updateTitle);
router.delete("/:id/:firebaseUid", deleteFolder);

export default router;
