import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    
    if (decoded.userId) {
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({ message: "Unauthorized - user not found" });
      }

      req.user = user;
    } else if (decoded.adminId) {
      const admin = await Admin.findById(decoded.adminId).select("-password");

      if (!admin) {
        return res.status(401).json({ message: "Unauthorized - admin not found" });
      }

      req.admin = admin;
    } else {
      return res.status(401).json({ message: "Unauthorized - Invalid token payload" });
    }

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const isAdmin = (req,res,next) => {
  if(req.admin && req.admin.role === 'admin') next();

  else res.status(403).json({message : "Access denied. Admins only."})
}
