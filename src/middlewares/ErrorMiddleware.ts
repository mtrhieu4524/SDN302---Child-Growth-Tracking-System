import { Request, Response, NextFunction } from "express";
import StatusCodeEnum from "../enums/StatusCodeEnum";
import CustomException from "../exceptions/CustomException";

const ErrorMiddleware = async (
  err: CustomException,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
    if (err.name && err.name.toLowerCase().includes("mongo")) {
      res
        .status(StatusCodeEnum.InternalServerError_500)
        .json({ message: `Database Error: ${err.message}` });
      return;
    }

    const statusCode = Object.values(StatusCodeEnum).includes(err.code || 0)
      ? err.code || StatusCodeEnum.InternalServerError_500
      : StatusCodeEnum.InternalServerError_500;

    res.status(statusCode).json({ message: err.message });
};

export default ErrorMiddleware;
