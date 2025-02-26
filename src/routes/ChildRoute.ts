import express from "express";
import GrowthDataController from "../controllers/GrowthDataController";
import UserEnum from "../enums/UserEnum";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import GrowthDataHandler from "../handlers/GrowthDataHandler";
import ChildController from "../controllers/ChildController";
import ChildHandler from "../handlers/ChildHandler";
import RoleMiddleware from "../middlewares/RoleMiddleware";

const childRoutes = express.Router();
const childHandler = new ChildHandler();
const growthDataHandler = new GrowthDataHandler();
const childController = new ChildController();
const growthDataController = new GrowthDataController();

childRoutes.use(AuthMiddleware);

childRoutes.post(
  "/",
  RoleMiddleware([UserEnum.MEMBER]),
  childHandler.createChild,
  childController.createChild
);

childRoutes.get(
  "/",
  RoleMiddleware([UserEnum.MEMBER, UserEnum.DOCTOR]),
  childHandler.getChildrenByUserId,
  childController.getChildrenByUserId
);

childRoutes.put(
  "/:childId",
  RoleMiddleware([UserEnum.MEMBER]),
  childHandler.updateChild,
  childController.updateChild
);

childRoutes.delete(
  "/:childId",
  RoleMiddleware([UserEnum.MEMBER]),
  childHandler.deleteChild,
  childController.deleteChild
);

childRoutes.get(
  "/:childId",
  RoleMiddleware([UserEnum.MEMBER, UserEnum.DOCTOR]),
  childHandler.getChildById,
  childController.getChildById
);

childRoutes.get(
  "/:childId/growth-velocity",
  growthDataHandler.getGrowthDataByChildId,
  RoleMiddleware([UserEnum.MEMBER, UserEnum.DOCTOR]),
  growthDataController.generateGrowthVelocityByChildId
);

childRoutes.get(
  "/:childId/growth-data",
  growthDataHandler.getGrowthDataByChildId,
  RoleMiddleware([UserEnum.MEMBER, UserEnum.DOCTOR]),
  growthDataController.getGrowthDataByChildId
);

childRoutes.post(
  "/:childId/growth-data",
  growthDataHandler.createGrowthData,
  RoleMiddleware([UserEnum.MEMBER]),
  growthDataController.createGrowthData
);

childRoutes.put(
  "/:childId/growth-data/:growthDataId",
  growthDataHandler.updateGrowthData,
  RoleMiddleware([UserEnum.MEMBER]),
  growthDataController.updateGrowthData
);

childRoutes.delete(
  "/:childId/growth-data/:growthDataId",
  growthDataHandler.deleteGrowthData,
  RoleMiddleware([UserEnum.MEMBER]),
  growthDataController.deleteGrowthData
);

childRoutes.get(
  "/:childId/growth-data/:growthDataId",
  growthDataHandler.getGrowthDataById,
  RoleMiddleware([UserEnum.MEMBER, UserEnum.DOCTOR]),
  growthDataController.getGrowthDataById
);

export default childRoutes;
