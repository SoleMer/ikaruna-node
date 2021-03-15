import { Request, Response, NextFunction } from "express";
import { findCurrentUser } from "../helpers";
import { User } from "../models/User";
import { authResponseMessages } from "../controllers/responseMessages/auth";

const { must_be_logged_in, not_same_user } = authResponseMessages;

export const requireSameUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const currentUser = await findCurrentUser(req.user);
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: must_be_logged_in,
    });
  } else if (currentUser instanceof User && id !== currentUser.id) {
    return res.status(401).json({ sucesss: false, message: not_same_user });
  } else {
    return next();
  }
};