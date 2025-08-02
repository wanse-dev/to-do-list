"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolder = exports.updateTitle = exports.getFoldersByUser = exports.getFolderById = exports.getFolders = exports.createFolder = void 0;
const folder_1 = __importDefault(require("../../models/folder"));
const task_1 = __importDefault(require("../../models/task"));
const user_1 = __importDefault(require("../../models/user"));
const createFolder = async (req, res) => {
    try {
        const { firebaseUid } = req.body;
        if (!firebaseUid) {
            res.status(400).json({
                message: "firebaseUID is required",
                error: true,
            });
            return;
        }
        const user = await user_1.default.findOne({ firebaseUid });
        if (!user) {
            res.status(404).json({
                message: "Folder not found",
                error: true,
            });
            return;
        }
        if (!user.folders) {
            user.folders = [];
        }
        const folder = new folder_1.default(req.body);
        await folder.save();
        user.folders.push(folder._id);
        await user.save();
        res.status(201).json({
            message: "Folder created and assigned to user successfully",
            data: folder,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};
exports.createFolder = createFolder;
const getFolders = async (req, res) => {
    try {
        const folders = await folder_1.default.find();
        res.status(200).json({
            message: "Folders obtained successfully",
            data: folders,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};
exports.getFolders = getFolders;
const getFolderById = async (req, res) => {
    try {
        const { id } = req.params;
        const folder = await folder_1.default.findById(id);
        if (!folder) {
            res.status(404).json({
                message: "Folder not found",
                error: true,
            });
            return;
        }
        res.status(200).json({
            message: "Folder obtained successfully",
            data: folder,
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};
exports.getFolderById = getFolderById;
const getFoldersByUser = async (req, res) => {
    try {
        const { firebaseUid } = req.params;
        const user = await user_1.default.findOne({ firebaseUid }).populate("folders");
        if (!user) {
            res.status(404).json({
                message: "User not found",
                error: true,
                data: undefined,
            });
            return;
        }
        res.status(200).json({
            message: "Folders obtained successfully",
            error: false,
            data: user.folders || [],
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};
exports.getFoldersByUser = getFoldersByUser;
const updateTitle = async (req, res) => {
    try {
        const { id } = req.params;
        const folder = await folder_1.default.findByIdAndUpdate(id, { title: req.body.title }, { new: true });
        if (!folder) {
            res.status(404).json({
                message: "Folder not found",
                error: true,
            });
            return;
        }
        res.status(200).json({
            message: "Folder updated successfully",
            data: folder,
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
const deleteFolder = async (req, res) => {
    try {
        const { id, firebaseUid } = req.params;
        if (!firebaseUid) {
            res.status(400).json({
                message: "firebaseUID is required",
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
        // obtengo los IDs de las tasks que pertenecen a esta folder
        const tasksInFolder = await task_1.default.find({ folder: id });
        const taskIdsToRemoveFromUser = tasksInFolder.map((task) => task._id);
        // quito las referencias de estas tasks del array de tasks del user
        if (user.tasks && taskIdsToRemoveFromUser.length > 0) {
            // filtro el array de tasks del user para eliminar las tasks de la folder eliminada
            user.tasks = user.tasks.filter((taskId) => !taskIdsToRemoveFromUser.some((idToRemove) => idToRemove.equals(taskId)));
            await user.save(); // guardo el user con el array de tasks actualizado
        }
        // quito la referencia de la folder del array de folders del user
        user.folders = user.folders?.filter((folderId) => folderId.toString() !== id);
        await user.save();
        // elimino físicamente todas las tasks asociadas a esta folder
        await task_1.default.deleteMany({ folder: id });
        // elimino la carpeta en sí
        const deletedFolder = await folder_1.default.findByIdAndDelete(id);
        if (!deletedFolder) {
            res.status(404).json({
                message: "Folder not found",
                error: true,
            });
            return;
        }
        res.status(200).json({
            message: "Folder and its tasks deleted successfully",
            error: false,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};
exports.deleteFolder = deleteFolder;
//# sourceMappingURL=index.js.map