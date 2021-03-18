import { Request, Response, NextFunction } from "express";
import { authResponseMessages } from "../controllers/responseMessages/auth";

const { must_be_logged_in } = authResponseMessages;

export const requireLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: must_be_logged_in,
    });
  }

  return next();
};