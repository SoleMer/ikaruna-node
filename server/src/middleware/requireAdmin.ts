import { Request, Response, NextFunction } from "express";
import { findCurrentUser } from "../helpers";
import { User } from "../models/User";
import { authResponseMessages } from "../controllers/responseMessages/auth";

const { not_allowed_action } = authResponseMessages;

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const admin = req.params.admin;
  const currentUser = await findCurrentUser(req.user);
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: not_allowed_action,
    });
  } else if (currentUser instanceof User && admin != 1) {
    return res.status(401).json({ sucesss: false, message: not_allowed_action });
  } else {
    return next();
  }
};