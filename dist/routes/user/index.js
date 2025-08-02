"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../../controllers/user/index");
const router = express_1.default.Router();
router.post("/", index_1.createUser);
router.get("/", index_1.getUsers);
router.get("/:firebaseUid", index_1.getUserById);
router.put("/update/:firebaseUid", index_1.updateUser);
router.patch("/disable/:firebaseUid", index_1.disableUser);
router.patch("/enable/:firebaseUid", index_1.enableUser);
router.delete("/:firebaseUid", index_1.deleteUser);
exports.default = router;
//# sourceMappingURL=index.js.map