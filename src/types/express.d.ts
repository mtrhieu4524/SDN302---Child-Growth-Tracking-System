// types/express.d.ts
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      isProtectedRoute: boolean,
      excelJsonData: { [key: string]: any; }[],
      userInfo: {
        userId: string,
        email: string,
        role: number,
      }
    }
  }
  
  type LooseObject = {
    [key: string]: any;
  };
}
