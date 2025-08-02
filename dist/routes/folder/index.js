"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../../controllers/folder/index");
const router = express_1.default.Router();
router.post("/", index_1.createFolder);
router.get("/", index_1.getFolders);
router.get("/:id", index_1.getFolderById);
router.get("/user/:firebaseUid", index_1.getFoldersByUser);
router.patch("/update/:id", index_1.updateTitle);
router.delete("/:id/:firebaseUid", index_1.deleteFolder);
exports.default = router;
//# sourceMappingURL=index.js.map