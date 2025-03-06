import StatusCodeEnum from "../enums/StatusCodeEnum";
import { Request, Response, NextFunction } from "express";
import UserEnum from "../enums/UserEnum";
import { IUser } from "../interfaces/IUser";
import UserRepository from "../repositories/UserRepository";

/**
 *
 * @param roles - The required roles
 * @returns An async function
 */
const RoleMiddleware = (roles: Array<number>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.userInfo;
      const userRepository = new UserRepository();

      const user: IUser | null = await userRepository.getUserById(
        userId,
        false
      );
      if (!user) {
        res
          .status(StatusCodeEnum.NotFound_404)
          .json({ message: "User not found" });
        return;
      }

      if (user.role === UserEnum.ADMIN || user.role === UserEnum.SUPER_ADMIN) {
        return next();
      }
      
      if (!roles.includes(user?.role)) {
        res
          .status(StatusCodeEnum.Forbidden_403)
          .json({ message: "Unauthorized access" });
        return;
      }

      next();
    } catch {
      res
        .status(StatusCodeEnum.InternalServerError_500)
        .json({ message: "Internal Server Error" });
      return;
    }
  };
};

export default RoleMiddleware;
