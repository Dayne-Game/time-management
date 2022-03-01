import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        task_name: {
            type: String,
            required: true,
        },
        done: {
            type: Boolean,
            default: false,
        },
        note: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const TimeLogSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        date: {
            type: Date,
            default: Date.now,
            required: true,
        },
        tasks: [taskSchema],
    },
    {
        timestamps: true,
    }
);

const TimeLog = mongoose.model("TimeLog", TimeLogSchema);

export default TimeLog;
