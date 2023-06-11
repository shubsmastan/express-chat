import mongoose, { Document } from "mongoose";

export interface UserDoc extends Document {
  username: string;
  password: string;
}

const UserSchema = new mongoose.Schema<UserDoc>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    password: { type: String, required: true, minLength: 8, maxLength: 30 },
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDoc>("User", UserSchema);
