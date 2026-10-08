import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import advertisementRoutes from "./routes/AdvertisementRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js"
import roundRoutes from "./routes/interviewPipelineRoutes.js";
import connectDB from "./utils/dbConfig.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import interviewerRoutes from "./routes/interviewerRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js"
import interviewerDashboardRoutes from "./routes/interviewerDashboardRoutes.js"
import offerLetterRoutes from "./routes/offerLetterRoutes.js"
import dashboardRoutes from './routes/orgDashboardRoutes.js';
import socialRoutes from "./routes/socialRoutes.js";
import headerRoutes from "./routes/headerRoutes.js";

const app = express();
const port = process.env.PORT || 3000;
// deploying the application
app.use(cors());
app.use(express.json());

connectDB();
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.use('/api/v1', dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/header", headerRoutes);
app.use("/api/advertisement",advertisementRoutes );
app.use("/api/application",applicationRoutes);
app.use("/api/form",candidateRoutes);
app.use("/api/round",roundRoutes);
app.use("/api/interviewer",interviewerRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/interview",interviewRoutes);
app.use("/api/interviewer/dash",interviewerDashboardRoutes);
app.use("/api/offer",offerLetterRoutes);
app.use(
  "/api/organization/social",
  socialRoutes
);


app.get("/", (req, res) => {
  console.log("server is runing...");
});

app.use(errorMiddleware);

export default app;
