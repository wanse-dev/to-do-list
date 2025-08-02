import Folder from "../../models/folder";
import Task from "../../models/task";
import User from "../../models/user";
import { Request, Response } from "express";
import mongoose from "mongoose";

const createFolder = async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.body;
    if (!firebaseUid) {
      res.status(400).json({
        message: "firebaseUID is required",
        error: true,
      });
      return;
    }

    const user = await User.findOne({ firebaseUid });
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

    const folder = new Folder(req.body);
    await folder.save();
    user.folders.push(folder._id);
    await user.save();

    res.status(201).json({
      message: "Folder created and assigned to user successfully",
      data: folder,
      error: false,
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const getFolders = async (req: Request, res: Response) => {
  try {
    const folders = await Folder.find();
    res.status(200).json({
      message: "Folders obtained successfully",
      data: folders,
      error: false,
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const getFolderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const folder = await Folder.findById(id);
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
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const getFoldersByUser = async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.params;
    const user = await User.findOne({ firebaseUid }).populate("folders");
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
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const updateTitle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const folder = await Folder.findByIdAndUpdate(
      id,
      { title: req.body.title },
      { new: true }
    );
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
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const deleteFolder = async (req: Request, res: Response) => {
  try {
    const { id, firebaseUid } = req.params;

    if (!firebaseUid) {
      res.status(400).json({
        message: "firebaseUID is required",
        error: true,
      });
      return;
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      res.status(404).json({
        message: "User not found",
        error: true,
      });
      return;
    }

    // obtengo los IDs de las tasks que pertenecen a esta folder
    const tasksInFolder = await Task.find({ folder: id });
    const taskIdsToRemoveFromUser = tasksInFolder.map((task) => task._id);

    // quito las referencias de estas tasks del array de tasks del user
    if (user.tasks && taskIdsToRemoveFromUser.length > 0) {
      // filtro el array de tasks del user para eliminar las tasks de la folder eliminada
      user.tasks = user.tasks.filter(
        (taskId: mongoose.Types.ObjectId) =>
          !taskIdsToRemoveFromUser.some((idToRemove: mongoose.Types.ObjectId) =>
            idToRemove.equals(taskId)
          )
      );
      await user.save(); // guardo el user con el array de tasks actualizado
    }

    // quito la referencia de la folder del array de folders del user
    user.folders = user.folders?.filter(
      (folderId: mongoose.Types.ObjectId) => folderId.toString() !== id
    );
    await user.save();

    // elimino físicamente todas las tasks asociadas a esta folder
    await Task.deleteMany({ folder: id });

    // elimino la carpeta en sí
    const deletedFolder = await Folder.findByIdAndDelete(id);
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
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

export {
  createFolder,
  getFolders,
  getFolderById,
  getFoldersByUser,
  updateTitle,
  deleteFolder,
};
