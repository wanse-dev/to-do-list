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
exports.deleteFolder = exports.updateTitle = exports.getFoldersByUser = exports.getFolderById = exports.getFolders = exports.createFolder = void 0;
const folder_1 = __importDefault(require("../../models/folder"));
const task_1 = __importDefault(require("../../models/task"));
const user_1 = __importDefault(require("../../models/user"));
const createFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firebaseUid } = req.body;
        if (!firebaseUid) {
            res.status(400).json({
                message: "firebaseUID is required",
                error: true,
            });
            return;
        }
        const user = yield user_1.default.findOne({ firebaseUid });
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
        yield folder.save();
        user.folders.push(folder._id);
        yield user.save();
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
});
exports.createFolder = createFolder;
const getFolders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const folders = yield folder_1.default.find();
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
});
exports.getFolders = getFolders;
const getFolderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const folder = yield folder_1.default.findById(id);
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
});
exports.getFolderById = getFolderById;
const getFoldersByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firebaseUid } = req.params;
        const user = yield user_1.default.findOne({ firebaseUid }).populate("folders");
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
});
exports.getFoldersByUser = getFoldersByUser;
const updateTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const folder = yield folder_1.default.findByIdAndUpdate(id, { title: req.body.title }, { new: true });
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
});
exports.updateTitle = updateTitle;
const deleteFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id, firebaseUid } = req.params;
        if (!firebaseUid) {
            res.status(400).json({
                message: "firebaseUID is required",
                error: true,
            });
            return;
        }
        const user = yield user_1.default.findOne({ firebaseUid });
        if (!user) {
            res.status(404).json({
                message: "User not found",
                error: true,
            });
            return;
        }
        // obtengo los IDs de las tasks que pertenecen a esta folder
        const tasksInFolder = yield task_1.default.find({ folder: id });
        const taskIdsToRemoveFromUser = tasksInFolder.map((task) => task._id);
        // quito las referencias de estas tasks del array de tasks del user
        if (user.tasks && taskIdsToRemoveFromUser.length > 0) {
            // filtro el array de tasks del user para eliminar las tasks de la folder eliminada
            user.tasks = user.tasks.filter((taskId) => !taskIdsToRemoveFromUser.some((idToRemove) => idToRemove.equals(taskId)));
            yield user.save(); // guardo el user con el array de tasks actualizado
        }
        // quito la referencia de la folder del array de folders del user
        user.folders = (_a = user.folders) === null || _a === void 0 ? void 0 : _a.filter((folderId) => folderId.toString() !== id);
        yield user.save();
        // elimino físicamente todas las tasks asociadas a esta folder
        yield task_1.default.deleteMany({ folder: id });
        // elimino la carpeta en sí
        const deletedFolder = yield folder_1.default.findByIdAndDelete(id);
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
});
exports.deleteFolder = deleteFolder;
