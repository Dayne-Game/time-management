import path from "path";
import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/error_middleware.js";
import connectDB from "./config/db.js";

import User_Routes from "./routes/User_Routes.js";
import TimeLog_Routes from "./routes/TimeLog_Routes.js";

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/users", User_Routes);
app.use("/api/timelogs", TimeLog_Routes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/build")));

    app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html")));
} else {
    app.get("/", (req, res) => {
        res.send("API is running....");
    });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
