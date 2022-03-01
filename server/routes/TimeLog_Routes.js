import express from "express";
const router = express.Router();

import { getTimeLogs, getTimeLog, createTimeLog, getAllTasks, createTask, updateTask } from "../controllers/TimeController.js";
import { protect } from "../middleware/auth_middleware.js";

router.route("/").get(protect, getTimeLogs).post(protect, createTimeLog);
router.route("/:id").get(protect, getTimeLog);
router.route("/tasks/:id").get(protect, getAllTasks).post(protect, createTask);
router.route("/tasks/:id/:task_id").put(protect, updateTask);

export default router;
