import express from "express";
import GrowthMetricsHandler from "../handlers/GrowthMetricsHandler";
import { uploadFile } from "../middlewares/storeFile";
import GrowthMetricsController from "../controllers/GrowthMetricsController";
import AuthMiddleware from "../middlewares/AuthMiddleware";

const growthMetricsRoute = express.Router();
const growthMetricsHandler = new GrowthMetricsHandler();
const growthMetricsController = new GrowthMetricsController();

growthMetricsRoute.use(AuthMiddleware);

growthMetricsRoute.post(
    "/upload",
    uploadFile.single("excelFile"),
    growthMetricsHandler.uploadGrowthMetricsFile, 
    growthMetricsController.uploadGrowthMetricsFile
);

export default growthMetricsRoute;