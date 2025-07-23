import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  disableUser,
  enableUser,
  deleteUser,
} from "../../controllers/user/index";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:firebaseUid", getUserById);
router.put("/update/:firebaseUid", updateUser);
router.patch("/disable/:firebaseUid", disableUser);
router.patch("/enable/:firebaseUid", enableUser);
router.delete("/:firebaseUid", deleteUser);

export default router;