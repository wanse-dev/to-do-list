import mongoose, { Schema } from "mongoose";

interface Task {
  title: string;
  isCompleted: boolean;
  isActive: boolean;
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
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model<Task>("Task", TaskSchema);

export default Task;
