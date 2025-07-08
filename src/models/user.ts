import mongoose, { Schema, Types } from "mongoose";

interface User {
  username: string;
  avatarURL?: string;
  email: string;
  notes?: Types.ObjectId[];
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
    notes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Note",
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
