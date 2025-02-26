import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction, Application } from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import getLogger from "./utils/logger";
import RouteMiddleware from "./middlewares/RouteMiddleware";

import growthMetricsRoute from "./routes/GrowthMetricsRoute";
import childRoutes from "./routes/ChildRoute";
import membershipPackageRoute from "./routes/MembershipPackageRoute";
import tierRoutes from "./routes/TierRoute";
import paymentRoutes from "./routes/PaymentRoute";
import receiptRoutes from "./routes/ReceiptRoute";

const app: Application = express();

// Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Files
app.use("/", express.static(__dirname));

// Enable trust proxy
app.set("trust proxy", 1);

// Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(cookieParser());

// Routes
app.use(RouteMiddleware); // Handle whether requested route is protected

app.use("/api/growth-metrics", growthMetricsRoute);
app.use("/api/children", childRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/tiers", tierRoutes);
app.use("/api/membership-packages", membershipPackageRoute);
app.use("/api/payments", paymentRoutes);

// Log API requests
app.use((req: Request, res: Response, next: NextFunction) => {
  const logger = getLogger("API");

  const startTime = new Date();

  res.on("finish", () => {
    const duration = new Date().getTime() - startTime.getTime();
    const logMessage = `${req.ip} ${req.method} ${
      req.originalUrl
    } ${req.protocol.toUpperCase()}/${req.httpVersion} ${res.statusCode} ${
      res.get("Content-Length") || 0
    } ${req.get("User-Agent")} ${duration}ms`;
    logger.info(logMessage);
  });

  next();
});

// Serve assets
app.use("/assets", express.static("assets"));

// Start server
const port: number = Number(process.env.DEVELOPMENT_PORT) || 4000;

const server: http.Server = http.createServer(app);

server.listen(port, async (err?: Error) => {
  const logger = getLogger("APP");
  if (err) {
    logger.error("Failed to start server:", err);
    process.exit(1);
  } else {
    logger.info(`Server is running at port ${port}`);
  }
});
