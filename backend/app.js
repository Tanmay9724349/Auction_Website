import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import { connection } from "./database/connection.js";
import userRoutes from "./router/userRoutes.js";
import auctionItemRoutes from "./router/auctionItemRoutes.js";
import bidRoutes from "./router/bidRoutes.js";
import commissionRouter from "./router/commissionRouter.js";
import superAdminRoutes from "./router/superAdminRoutes.js";
import { errorMiddleware } from "./middlewares/error.js";

dotenv.config();

const app = express();

// Connect to database
connection();

// CORS config
const allowedOrigin = process.env.FRONTEND_URL || "*";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auctionitem", auctionItemRoutes);
app.use("/api/v1/bid", bidRoutes);
app.use("/api/v1/commission", commissionRouter);
app.use("/api/v1/superadmin", superAdminRoutes);

// Error middleware
app.use(errorMiddleware);

export default app;
