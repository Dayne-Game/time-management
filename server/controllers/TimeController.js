import asyncHandler from "express-async-handler";
import TimeLog from "../models/TimeModel.js";
import User from "../models/UserModel.js";

const getTimeLogs = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await TimeLog.countDocuments();
    const times = await TimeLog.find()
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ times, page, pages: Math.ceil(count / pageSize) });
});

const getTimeLog = asyncHandler(async (req, res) => {
    // Get user using the id in the JWT
    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(401);
        throw new Error("User not found");
    }

    const timeLog = await TimeLog.findById(req.params.id);

    if (!timeLog) {
        res.status(404);
        throw new Error("Ticket not found");
    }

    if (timeLog.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("Not Authorized");
    }

    res.status(200).json(timeLog);
});

const createTimeLog = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(401);
        throw new Error("User not found");
    }

    const timelog = await TimeLog.create({
        user: req.user.id,
    });

    res.status(201).json(timelog);
});

// @route   GET api/timelogs/tasks/:id
// @desc    Get all Tasks, asscoiated to a TimeLog
// @access  Private
const getAllTasks = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const timeLog = await TimeLog.findById(req.params.id);

        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !timeLog.tasks) {
            res.status(404);
            throw new Error("Task not found!");
        } else {
            if (timeLog.user.toString() === req.user.id) {
                res.json(timeLog.tasks);
            } else {
                res.status(401);
                throw new Error("You cannot access this data");
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500);
        throw new Error("Server Error");
    }
});

// POST     api/timelogs/tasks/:id
// @desc    Record Task about the timeLog
// @access  Private
const createTask = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const timeLog = await TimeLog.findById(req.params.id);

        const newtask = {
            task_name: req.body.task_name,
            user: req.user.id,
        };

        if (timeLog.user.toString() === req.user.id) {
            timeLog.tasks.unshift(newtask);

            await timeLog.save();
        } else {
            res.status(401);
            throw new Error("You cannot access this data");
        }

        res.json(timeLog.tasks);
    } catch (err) {
        console.log(err);
        res.status(500);
        throw new Error("Server Error");
    }
});

const updateTask = asyncHandler(async (req, res) => {
    try {
        const timeLog = await TimeLog.findById(req.params.id);

        // if (task.user.toString() !== req.user.id) {
        //     res.status(401);
        //     throw new Error("User not Authorized");
        // }

        timeLog.update({ _id: req.params.id, user: req.user.id, "tasks.id": req.params.task_id }, { $set: { "tasks.$.done": true } });

        res.status(200).json("Updated");
    } catch (err) {
        console.log(err);
        res.status(500);
        throw new Error("Server Error");
    }
});

export { getTimeLogs, getTimeLog, createTimeLog, createTask, getAllTasks, updateTask };
