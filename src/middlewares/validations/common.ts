import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import { isGenericPhoneNumber } from "../../helpers/helperFunctions";

export const ValidateRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password must be at least 6 characters long")
      .isLength({ min: 6 })
      .run(req);
    await check("phone", "Phone must be a valid phone number")
      .custom(isGenericPhoneNumber)
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        errors: errors.array(),
        success: false,
        message: "Invalid Request parameters",
      });
    next();
  } catch (err) {
    next(err);
  }
};

export const ValidateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password must be at least 6 characters long")
      .isLength({ min: 6 })
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        errors: errors.array(),
        success: false,
        message: "Invalid Request parameters",
      });
    next();
  } catch (err) {
    next(err);
  }
};

export const ValidateChangingPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await check("previous", "Password must be at least 6 characters long")
      .isLength({ min: 6 })
      .run(req);
    await check("current", "Password must be at least 6 characters long")
      .isLength({ min: 6 })
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        errors: errors.array(),
        success: false,
        message: "Invalid Request parameters",
      });
    next();
  } catch (err) {
    next(err);
  }
};

export const validateEmailMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await check("email", "Email is not valid").isEmail().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        errors: errors.array(),
        success: false,
        message: "Invalid Request parameters",
      });
    next();
  } catch (err) {
    next(err);
  }
};

export const ValidatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await check("password", "Password must be at least 6 characters long")
      .isLength({ min: 6 })
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        errors: errors.array(),
        success: false,
        message: "Invalid Request parameters",
      });
    next();
  } catch (err) {
    next(err);
  }
};
