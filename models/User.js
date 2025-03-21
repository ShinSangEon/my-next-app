import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lastLoginAttempt: {
      type: Date,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // 오타 수정! (da**f**ault → default)
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// ⭐️ Next.js에서는 재정의 방지
export const User = mongoose.models.User || mongoose.model("User", userSchema);
