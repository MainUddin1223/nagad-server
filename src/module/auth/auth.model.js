import bcrypt from "bcrypt";
import config from "../../utils/config/index.js";

import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "user", "agent"],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.isPasswordMatched = async function (
  password,
  savedPassword
) {
  const isPasswordMatched = await bcrypt.compare(password, savedPassword);
  return isPasswordMatched;
};

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );

  if (this.role === "user") {
    this.isApproved = true;
  }

  next();
});

const User = model("user", userSchema);

export default User;
