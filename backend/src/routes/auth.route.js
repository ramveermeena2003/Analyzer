import express from "express";
import { deleteAdminController, deleteUserController, getAllAdmins, getAllUsers, login, logout,signup } from "../controllers/auth.controller.js";
import { isAdmin, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup",signup)

router.post("/login",login);

router.post("/logout",logout);

router.get("/all-users",getAllUsers);

router.get("/all-admins",getAllAdmins);

router.delete("/delete-user/:id",protectRoute,isAdmin, deleteUserController);

router.delete("/delete-admin/:id",protectRoute,isAdmin, deleteAdminController);



router.get("/me", protectRoute, (req, res) => {
  if (req.user) {
    res.status(200).json({ success: true, user: req.user });
  } else if (req.admin) {
    res.status(200).json({ success: true, admin: req.admin });
  } else {
    res.status(401).json({ message: "Unauthorized - no user/admin found" });
  }
});


export default router;