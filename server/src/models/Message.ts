import mongoose, { Document } from "mongoose";

export interface MsgDoc extends Document {
  message: string;
  user: string;
}

const MsgSchema = new mongoose.Schema<MsgDoc>(
  {
    message: {
      type: String,
      required: true,
      minLength: 3,
    },
    user: { type: String, required: true },
  },
  { timestamps: true }
);

export const Message = mongoose.model<MsgDoc>("Message", MsgSchema);
