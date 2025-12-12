import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

const app = express();

// Apply Rate Limiting (Global)
const globalLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 200, // Limit each IP to 200 requests per window
    message: "Too many requests, please try again later",
    headers: true
});

app.use(globalLimiter); // Apply rate limiting to all routes

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRouter from './routes/user.routes.js';
import adminRouter from './routes/admin.routes.js';
import companyRouter from './routes/company.routes.js';
import farmerRouter from './routes/farmer.routes.js';
import contractRouter from './routes/contract.routes.js';
import disputeRouter from './routes/dispute.routes.js';
import feedbackRouter from './routes/feedback.routes.js';
import paymentRouter from './routes/payment.routes.js';

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/companies", companyRouter);
app.use("/api/v1/farmers", farmerRouter);
app.use("/api/v1/contracts", contractRouter);
app.use("/api/v1/disputes", disputeRouter);
app.use("/api/v1/feedbacks", feedbackRouter);
app.use("/api/v1/payments", paymentRouter);
export { app };
