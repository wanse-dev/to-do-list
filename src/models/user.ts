import mongoose, { Schema, Types } from "mongoose";

interface User {
  username: string;
  avatarURL?: string;
  email: string;
  tasks?: Types.ObjectId[];
  isActive: boolean;
}

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    avatarURL: {
      type: String,
      default: "https://unavatar.io/github/wanse-dev",
    },
    email: {
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

const User = mongoose.model<User>("User", UserSchema);

export default User;
