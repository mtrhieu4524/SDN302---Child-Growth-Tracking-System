import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  role: number;
  avatar: string;
  googleId: string;
  email: string;
  phoneNumber: string;
  password: string;
  resetPasswordPin: {
    value: string | null;
    expiresAt: Date | null;
    isVerified: boolean;
  };
  subscription: {
    startDate: Date | null;
    endDate: Date | null;
    currentPlan: Types.ObjectId | null;
    futurePlan: Types.ObjectId | null;
    viewChart: {
      counter: number;
      lastCalled: Date;
    };
  };

  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
