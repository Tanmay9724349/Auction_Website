import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./router/userRoutes.js";
import auctionItemRouter from "./router/auctionItemRoutes.js";
import bidRouter from "./router/bidRoutes.js";
import commissionRouter from "./router/commissionRouter.js";
import superAdminRouter from "./router/superAdminRoutes.js";
import { endedAuctionCron } from "./automation/endedAuctionCron.js";
import { verifyCommissionCron } from "./automation/verifyCommissionCron.js";

const app = express();
config({
  path: "./config/config.env",
});

// Allow multiple frontend origins via FRONTEND_URL env (comma-separated)
// If FRONTEND_URL is not set (e.g., on remote deploy), include the
// known frontend Vercel URL so CORS still allows browser requests.
const rawFrontend =
  process.env.FRONTEND_URL ||
  "https://auction-website-gules.vercel.app";
const allowedOrigins = rawFrontend.split(",").map((s) => s.trim()).filter(Boolean);

console.log("CORS allowed origins:", allowedOrigins);
console.log("Current NODE_ENV:", process.env.NODE_ENV);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auctionitem", auctionItemRouter);
app.use("/api/v1/bid", bidRouter);
app.use("/api/v1/commission", commissionRouter);
app.use("/api/v1/superadmin", superAdminRouter);

endedAuctionCron();
verifyCommissionCron();
connection();
app.use(errorMiddleware);

export default app;
