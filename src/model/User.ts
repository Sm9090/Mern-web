import mongoose, { Schema, Document } from "mongoose";

export interface message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

export interface user extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpire: Date;
  isAcceptingMessage: boolean;
  messages: message[];
  isVerified: boolean;
}

const UserSchema: Schema<user> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please fill a valid email address"],
  },
  password: { type: String, required: true },
  verifyCode: { type: String, required: [true, "Verify Code is required"] },
  verifyCodeExpire: { type: Date, required: true },
  isVerified: { type: Boolean, required: true, default: false },
  isAcceptingMessage: { type: Boolean, required: true, default: true },
  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<user>) ||
  mongoose.model<user>("User", UserSchema);

export default UserModel;
