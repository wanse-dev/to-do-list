import Task from "../../models/task";
import User from "../../models/user";
import { Request, Response } from "express";

const createTask = async (req: Request, res: Response) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json({
      message: "Task created successfully",
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
  const { firebaseUid } = req.params; // en vez de userId, traigo el UID de firebase
  try {
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

const assignTaskToUser = async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.params;
    const { taskId } = req.body;

    if (!firebaseUid || !taskId) {
      // verifico que la request traiga tanto el UID como el taskID
      res.status(400).json({
        message: "firebaseUID and taskID are required",
        error: true,
      });
      return;
    }
    const user = await User.findOne({ firebaseUid }); // busco al usuario por el UID de firebase
    if (!user) {
      res.status(404).json({
        message: "User not found",
        error: true,
      });
      return;
    }
    const task = await Task.findById(taskId); // busco el task por id
    if (!task) {
      res.status(404).json({
        message: "Task not found",
        error: true,
      });
      return;
    }
    if (!user.tasks) {
      // si el usuario no tiene tasks, le inicializo un array vacío
      user.tasks = [];
    }
    if (user.tasks.includes(taskId)) {
      // le verifico que la task no exista en el array del usuario ( igual es imposible a nivel front que esto ocurra)
      res.status(400).json({
        message: "Task is already assigned to this user",
        error: true,
      });
      return;
    }

    user.tasks.push(taskId); // agrego la task al array del usuario
    await user.save();

    res.status(200).json({
      message: "Task assigned to user successfully",
      data: { user, task },
      error: false,
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const removeTaskFromUser = async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.params;
    const { taskId } = req.body;

    if (!firebaseUid || !taskId) {
      res.status(400).json({
        message: "firebaseUID and taskID are required",
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

    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({
        message: "Task not found",
        error: true,
      });
      return;
    }

    if (!user.tasks || !user.tasks.includes(taskId)) {
      res.status(400).json({
        message: "Task is not assigned to this user",
        error: true,
      });
      return;
    }

    user.tasks = user.tasks.filter((id) => id.toString() !== taskId);
    await user.save();

    res.status(200).json({
      message: "Task removed from user successfully",
      data: { user, task },
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
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      res.status(404).json({
        message: "Task not found",
        error: true,
      });
      return;
    }
    res.status(200).json({
      message: "Task deleted successfully",
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
  assignTaskToUser,
  removeTaskFromUser,
  updateTitle,
  completeTask,
  undoneTask,
  disableTask,
  enableTask,
  deleteTask,
};
