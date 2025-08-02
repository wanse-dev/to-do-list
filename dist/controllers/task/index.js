"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.enableTask = exports.disableTask = exports.undoneTask = exports.completeTask = exports.updateTitle = exports.getTasksByFolder = exports.getTasksByUser = exports.getTaskById = exports.getTasks = exports.createTask = void 0;
const task_1 = __importDefault(require("../../models/task"));
const folder_1 = __importDefault(require("../../models/folder"));
const user_1 = __importDefault(require("../../models/user"));
const createTask = async (req, res) => {
    try {
        const { firebaseUid, folderId, title, isCompleted, isActive } = req.body;
        if (!firebaseUid || !folderId) {
            res.status(400).json({
                message: "firebaseUID and folderID are required",
                error: true,
            });
            return;
        }
        const user = await user_1.default.findOne({ firebaseUid });
        if (!user) {
            res.status(404).json({
                message: "User not found",
                error: true,
            });
            return;
        }
        if (!user.tasks) {
            user.tasks = [];
        }
        const folder = await folder_1.default.findById(folderId);
        if (!folder) {
            res.status(404).json({
                message: "Folder not found",
                error: true,
            });
            return;
        }
        if (!folder.tasks) {
            folder.tasks = [];
        }
        // creo un objeto task con los datos del req.body 
        const newTask = {
            title,
            isCompleted: isCompleted !== undefined ? isCompleted : false,
            isActive: isActive !== undefined ? isActive : true,
            folder: folderId,
            user: user._id,
        };
        const task = new task_1.default(newTask);
        await task.save();
        user.tasks.push(task._id);
        await user.save();
        folder.tasks.push(task._id);
        await folder.save();
        res.status(201).json({
            message: "Task created and assigned to user and folder successfully",
            data: task,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};
exports.createTask = createTask;
const getTasks = async (req, res) => {
    try {
        const tasks = await task_1.default.find();
        res.status(200).json({
            message: "Tasks obtained successfully",
            data: tasks,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};
exports.getTasks = getTasks;
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await task_1.default.findById(id);
        if (!task) {
            res.status(404).json({
                message: "Task not found",
                error: true,
            });
            return;
        }
        res.status(200).json({
            message: "Task obtained successfully",
            data: task,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};
exports.getTaskById = getTaskById;
const getTasksByUser = async (req, res) => {
    try {
        const { firebaseUid } = req.params; // en vez de userId, traigo el UID de firebase
        const user = await user_1.default.findOne({ firebaseUid }).populate("tasks");
        if (!user) {
            res.status(404).json({
                message: "User not found",
                error: true,
                data: undefined,
            });
            return;
        }
        res.status(200).json({
            message: "Tasks obtained successfully",
            error: false,
            data: user.tasks || [],
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};
exports.getTasksByUser = getTasksByUser;
const getTasksByFolder = async (req, res) => {
    try {
        const { folderId } = req.params;
        const tasks = await task_1.default.find({ folder: folderId, isActive: true });
        res.status(200).json({
            message: "Tasks by folder obtained successfully",
            data: tasks,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};
exports.getTasksByFolder = getTasksByFolder;
const updateTitle = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await task_1.default.findByIdAndUpdate(id, { title: req.body.title }, { new: true });
        if (!task) {
            res.status(404).json({
                message: "Task not found",
                error: true,
            });
            return;
        }
        res.status(200).json({
            message: "Task updated successfully",
            data: task,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};
exports.updateTitle = updateTitle;
const completeTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await task_1.default.findByIdAndUpdate(id, { isCompleted: true }, { new: true });
        if (!task) {
            res.status(404).json({
                message: "Task not found",
                error: true,
            });
            return;
        }
        res.status(200).json({
            message: "Task completed successfully",
            data: task,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};
exports.completeTask = completeTask;
const undoneTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await task_1.default.findByIdAndUpdate(id, { isCompleted: false }, { new: true });
        if (!task) {
            res.status(404).json({
                message: "Task not found",
                error: true,
            });
            return;
        }
        res.status(200).json({
            message: "Task marked as undone successfully",
            data: task,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};
exports.undoneTask = undoneTask;
const disableTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await task_1.default.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!task) {
            res.status(404).json({
                message: "Task not found",
                error: true,
            });
            return;
        }
        res.status(200).json({
            message: "Task disabled successfully",
            data: task,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};
exports.disableTask = disableTask;
const enableTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await task_1.default.findByIdAndUpdate(id, { isActive: true }, { new: true });
        if (!task) {
            res.status(404).json({
                message: "Task not found",
                error: true,
            });
            return;
        }
        res.status(200).json({
            message: "Task enabled successfully",
            data: task,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};
exports.enableTask = enableTask;
const deleteTask = async (req, res) => {
    try {
        const { id, firebaseUid } = req.params;
        if (!firebaseUid) {
            res.status(400).json({
                message: "firebaseUID is required",
                error: true,
            });
            return;
        }
        const user = await user_1.default.findOneAndUpdate({ firebaseUid }, { $pull: { tasks: id } }, { new: true });
        const task = await task_1.default.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({
                message: "User not found",
                error: true,
            });
            return;
        }
        if (!task) {
            res.status(404).json({
                message: "Task not found",
                error: true,
            });
            return;
        }
        res.status(200).json({
            message: "Task deleted and removed from user successfully",
            data: task,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};
exports.deleteTask = deleteTask;
//# sourceMappingURL=index.js.map