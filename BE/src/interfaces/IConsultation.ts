import { IBaseEntity } from "../models/BaseModel";
import { ObjectId } from "mongoose";

export enum ConsultationStatus {
  Ongoing = "Ongoing",
  Ended = "Ended",
}
export interface IConsultation extends IBaseEntity {
  requestId: ObjectId;
  status: ConsultationStatus;
  rating: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  requestDetails: Record<string, any>;
}
