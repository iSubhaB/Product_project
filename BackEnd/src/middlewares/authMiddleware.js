import jwt from "jsonwebtoken";
import User from "../models/User.js"; 
import dotenv from "dotenv";

dotenv.config();

export const protect = async (req, res, next) => {
    try {
        let token;


        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        next();
    } catch (error) {
        console.error("❌ Auth error:", error.message);
        res.status(401).json({ success: false, message: "Not authorized, invalid token" });
    }
};
