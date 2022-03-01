import asyncHandler from "express-async-handler";
import Generate_Token from "../utils/Generate_Token.js";
import User from "../models/UserModel.js";

const Login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: Generate_Token(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid email or Password");
    }
});

const Register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Invalid Data");
    }

    // CHECK IF USER EMAIL ALL READY EXISTS
    const userEmailExists = await User.findOne({ email });

    if (userEmailExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // CREATE USER
    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: Generate_Token(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid User Data");
    }
});

export { Login, Register };
