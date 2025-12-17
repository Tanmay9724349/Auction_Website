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

// CORS config - support a comma-separated whitelist from env
const rawFrontends = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "";
const whitelist = rawFrontends.split(",").map((s) => s.trim()).filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server or same-origin requests
      if (whitelist.length === 0) return callback(null, true); // no whitelist => allow all
      if (whitelist.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"), false);
    },
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
