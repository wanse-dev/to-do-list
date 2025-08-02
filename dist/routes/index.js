"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./user/"));
const task_1 = __importDefault(require("./task/"));
const folder_1 = __importDefault(require("./folder/"));
const router = express_1.default.Router();
router.use("/users", user_1.default);
router.use("/task", task_1.default);
router.use("/folder", folder_1.default);
exports.default = router;
