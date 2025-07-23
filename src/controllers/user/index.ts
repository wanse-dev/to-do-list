import User from "../../models/user";
import { Request, Response } from "express";

const createUser = async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({
      message: "User created successfully",
      data: user,
      error: false,
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json({
      message: "Users obtained successfully",
      data: users,
      error: false,
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.params;
    const user = await User.findOne({ firebaseUid }); // en vez de findById, uso FindOne para traer el UID de firebase
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
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.params;
    const user = await User.findOneAndUpdate(
      { firebaseUid }, 
      { $set: req.body },
      { new: true }
    );
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
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const disableUser = async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.params;
    const user = await User.findOneAndUpdate(
      { firebaseUid }, 
      { isActive: false },
      { new: true }
    );
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
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const enableUser = async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.params;
    const user = await User.findOneAndUpdate(
      { firebaseUid }, 
      { isActive: true },
      { new: true }
    );
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
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.params;
    const user = await User.findOneAndDelete({ firebaseUid });
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
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

export {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  disableUser,
  enableUser,
  deleteUser,
};
