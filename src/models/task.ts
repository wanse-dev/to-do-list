import mongoose, { Schema, Types } from "mongoose";

interface Task {
  title: string;
  isCompleted: boolean;
  isActive: boolean;
  folder?: Types.ObjectId;
  user?: Types.ObjectId;
}

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    folder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model<Task>("Task", TaskSchema);

export default Task;
