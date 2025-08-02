"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI ?? "");
        console.log("Database connected");
    }
    catch (error) {
        console.error("ERROR: connection failed", error);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=database.js.map