import User from "../models/User.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
    const { email, password, fullName, role } = req.body;

    try {
        if (role === "Admin") {
            if (!email || !password || !fullName) {
                return res.status(400).json({ message: "All fields are required" });
            }
            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters" });
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }

            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({ message: "Admin already exists, please use a differrent one" });
            }

            const newAdmin = await Admin.create({
                email,
                fullName,
                password,
                role: "admin",
                profilePic: "",
            });

            res.status(201).json({ success: true, admin: newAdmin });
        }

        else {


            if (!email || !password || !fullName) {
                return res.status(400).json({ message: "All fields are required" });
            }
            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters" });
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists, please use a differrent one" });
            }

            const newUser = await User.create({
                email,
                fullName,
                password,
                profilePic: "",
            });

            const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
                expiresIn: "7d"
            })

            res.cookie("jwt", token, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true, // prevent XSS attacks,
                sameSite: "strict", // prevent CSRF attacks
                secure: process.env.NODE_ENV === "production",
            });

            res.status(201).json({ success: true, user: newUser });
        }

    } catch (error) {
        console.log("Error in signup controller");
        res.status(500).json({ message: "internal Server Error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password, role } = req.body;
        if (role === "User") {
            if (!email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const user = await User.findOne({ email });

            if (!user) return res.status(401).json({ message: "User does not exist" });

            const isPasswordCorrect = await user.matchPassword(password);

            if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
                expiresIn: "7d"
            });

            res.cookie("jwt", token, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });

            res.status(200).json({ success: true, user });
        }
        else if (role == "Admin") {
            if (!email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const admin = await Admin.findOne({ email });

            if (!admin) return res.status(401).json({ message: "Admin does not exist" });

            const isPasswordCorrect = await admin.matchPassword(password);

            if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

            const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET_KEY, {
                expiresIn: "7d"
            });

            res.cookie("jwt", token, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });

            res.status(200).json({ success: true, admin });
        }
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "Logout successful" });
}
export async function getAllUsers(req, res) {
    try {
        const users = await User.find(); // fetch all users from the user Schema
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error while fetching users", error });
    }
};

export async function getAllAdmins(req, res) {
    try {
        const admins = await Admin.find(); // fetch all admins from the admin schema
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: "Error while fetching admins ", error });
    }
}


export const deleteUserController = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.this.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
        console.log("Error deleting user : ", error);
        res.status(500).json({ message: "Failed to delete user ", error });
    }
};


export const deleteAdminController = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAdmin = await Admin.findByIdAndDelete(id);
        if (!deletedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({ message: "Admin deleted successfully", deletedAdmin });
    } catch (error) {
        console.log("Error deleting user : ", error);
        res.status(500).json({ message: "Failed to delete Admin ", error });
    }
};