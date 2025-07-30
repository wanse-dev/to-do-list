import Task from "../../models/task";
import User from "../../models/user";
import { Request, Response } from "express";

const createFolder = async (req: Request, res: Response) => {};

const getFolders = async (req: Request, res: Response) => {};

const getFolderById = async (req: Request, res: Response) => {};

const getFolderByUser = async (req: Request, res: Response) => {};

const updateTitle = async (req: Request, res: Response) => {};

const deleteFolder = async (req: Request, res: Response) => {};

export {
  createFolder,
  getFolders,
  getFolderById,
  getFolderByUser,
  updateTitle,
  deleteFolder,
};
