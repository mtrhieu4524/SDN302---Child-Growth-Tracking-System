import { IBaseEntity } from "../models/BaseModel";
import { ObjectId } from "mongoose";

export interface IConsultationMessage extends IBaseEntity {
  sender: ObjectId;
  consultationId: ObjectId;
  message: string;
  attachments: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
