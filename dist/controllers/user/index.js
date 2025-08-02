"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.enableUser = exports.disableUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const user_1 = __importDefault(require("../../models/user"));
const createUser = async (req, res) => {
    try {
        const user = new user_1.default(req.body);
        await user.save();
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
};
exports.createUser = createUser;
const getUsers = async (req, res) => {
    try {
        const users = await user_1.default.find();
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
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const { firebaseUid } = req.params;
        const user = await user_1.default.findOne({ firebaseUid }); // en vez de findById, uso FindOne para traer el UID de firebase
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
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    try {
        const { firebaseUid } = req.params;
        const user = await user_1.default.findOneAndUpdate({ firebaseUid }, { $set: req.body }, { new: true });
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
};
exports.updateUser = updateUser;
const disableUser = async (req, res) => {
    try {
        const { firebaseUid } = req.params;
        const user = await user_1.default.findOneAndUpdate({ firebaseUid }, { isActive: false }, { new: true });
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
};
exports.disableUser = disableUser;
const enableUser = async (req, res) => {
    try {
        const { firebaseUid } = req.params;
        const user = await user_1.default.findOneAndUpdate({ firebaseUid }, { isActive: true }, { new: true });
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
};
exports.enableUser = enableUser;
const deleteUser = async (req, res) => {
    try {
        const { firebaseUid } = req.params;
        const user = await user_1.default.findOneAndDelete({ firebaseUid });
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
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=index.js.map