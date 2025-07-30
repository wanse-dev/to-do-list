import Task from "../../models/task";
import Folder from "../../models/folder";
import User from "../../models/user";
import { Request, Response } from "express";

const createTask = async (req: Request, res: Response) => {
  try {
    const { firebaseUid, folderId, title, isCompleted, isActive } = req.body;

    if (!firebaseUid || !folderId) {
      res.status(400).json({
        message: "firebaseUID and folderID are required",
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
    if (!user.tasks) {
      user.tasks = [];
    }

    const folder = await Folder.findById(folderId);
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

    const task = new Task(newTask);
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
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({
      message: "Tasks obtained successfully",
      data: tasks,
      error: false,
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
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
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const getTasksByUser = async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.params; // en vez de userId, traigo el UID de firebase
    const user = await User.findOne({ firebaseUid }).populate("tasks");
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
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const getTasksByFolder = async (req: Request, res: Response) => {
  try {
    const { folderId } = req.params;
    const tasks = await Task.find({ folder: folderId, isActive: true });

    res.status(200).json({
      message: "Tasks by folder obtained successfully",
      data: tasks,
      error: false,
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
    const task = await Task.findByIdAndUpdate(
      id,
      { title: req.body.title },
      { new: true }
    );
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
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const completeTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(
      id,
      { isCompleted: true },
      { new: true }
    );
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
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const undoneTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(
      id,
      { isCompleted: false },
      { new: true }
    );
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
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const disableTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
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
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const enableTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );
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
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id, firebaseUid } = req.params;

    if (!firebaseUid) {
      res.status(400).json({
        message: "firebaseUID is required",
        error: true,
      });
      return;
    }

    const user = await User.findOneAndUpdate(
      { firebaseUid },
      { $pull: { tasks: id } },
      { new: true }
    );

    const task = await Task.findByIdAndDelete(id);

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
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

export {
  createTask,
  getTasks,
  getTaskById,
  getTasksByUser,
  getTasksByFolder,
  updateTitle,
  completeTask,
  undoneTask,
  disableTask,
  enableTask,
  deleteTask,
};
