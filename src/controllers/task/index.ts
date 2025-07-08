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
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate("tasks");

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
      data: user.tasks,
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
  updateTitle,
  completeTask,
  undoneTask,
  disableTask,
  enableTask,
  deleteTask,
};
