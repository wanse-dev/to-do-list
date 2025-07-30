import mongoose, { Types, Schema } from "mongoose";

interface Folder {
  title: string;
  tasks?: Types.ObjectId[];
  isActive: boolean;
}

const FolderSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Folder = mongoose.model<Folder>("Folder", FolderSchema);

export default Folder;