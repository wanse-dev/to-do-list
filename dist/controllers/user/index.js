"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.enableUser = exports.disableUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const user_1 = __importDefault(require("../../models/user"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new user_1.default(req.body);
        yield user.save();
        res.status(201).json({
            message: "User created successfully",
            data: user,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});
exports.createUser = createUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find();
        res.status(200).json({
            message: "Users obtained successfully",
            data: users,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firebaseUid } = req.params;
        const user = yield user_1.default.findOne({ firebaseUid }); // en vez de findById, uso FindOne para traer el UID de firebase
        if (!user) {
            res.status(404).json({
                message: "User not found",
                error: true,
            });
            return;
        }
        res.status(200).json({
            message: "User obtained successfully",
            data: user,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firebaseUid } = req.params;
        const user = yield user_1.default.findOneAndUpdate({ firebaseUid }, { $set: req.body }, { new: true });
        if (!user) {
            res.status(404).json({
                message: "User not found",
                error: true,
            });
            return;
        }
        res.status(200).json({
            message: "User updated successfully",
            data: user,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});
exports.updateUser = updateUser;
const disableUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firebaseUid } = req.params;
        const user = yield user_1.default.findOneAndUpdate({ firebaseUid }, { isActive: false }, { new: true });
        if (!user) {
            res.status(404).json({
                message: "User not found",
                error: true,
            });
            return;
        }
        res.status(200).json({
            message: "User disabled successfully",
            data: user,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});
exports.disableUser = disableUser;
const enableUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firebaseUid } = req.params;
        const user = yield user_1.default.findOneAndUpdate({ firebaseUid }, { isActive: true }, { new: true });
        if (!user) {
            res.status(404).json({
                message: "User not found",
                error: true,
            });
            return;
        }
        res.status(200).json({
            message: "User enabled successfully",
            data: user,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});
exports.enableUser = enableUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firebaseUid } = req.params;
        const user = yield user_1.default.findOneAndDelete({ firebaseUid });
        if (!user) {
            res.status(404).json({
                message: "User not found",
                error: true,
            });
            return;
        }
        res.status(200).json({
            message: "User deleted successfully",
            data: user,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});
exports.deleteUser = deleteUser;
