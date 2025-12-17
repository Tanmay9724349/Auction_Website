import express from "express";
import dotenv, { config } from "dotenv";
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

dotenv.config({ path: "./config/config.env" });

const app = express();

// Connect to database
connection();

// CORS config
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "https://auction-website-tf.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

const allowedOrigin = process.env.FRONTEND_URL || "*";
app.use(
  cors({
    origin: FRONTEND_URL,
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
