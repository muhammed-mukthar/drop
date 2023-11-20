import { Request, Response } from "express";
import { ApiError } from "../helpers/helperFunctions";
import { IUser, UserDoc } from "../models/User";
import sharp from "sharp";
import mime from "mime-types";
import path from "path";

import {
  deleteUserHandler,
  forgotPasswordHandler,
  getUserProfileHandler,
  loginUserHandler,
  registerUserHandler,
  updateUserPasswordHandler,

} from "../handlers/user";
import { userLogger } from "../utils/logger";
import { generateFileName } from "../utils/mutlerConfig";

// Register New User
export const registerUserController = async (req: Request, res: Response) => {
  try {
    const userData: IUser = req.body;

    // Add data and send email
    const data = await registerUserHandler(userData);

    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err instanceof ApiError) {
      return res
        .status(err.status)
        .json({ success: false, message: err.message });
    }
    userLogger.error(`error occurred on registerUserController`, { err });

    return res.status(500).json({
      success: false,
      message: err,
    }); //the err.message is only avaiable in apierror so i am adding err object
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const email: string = req.body.email;
    const password: string = req.body.password;

    // Add data and send email
    const data = await loginUserHandler(email, password);

    return res.status(200).json({ success: true, data });
  } catch (err) {
    userLogger.error(`error occurred on loginUserController`, { err });

    if (err instanceof ApiError) {
      return res
        .status(err.status)
        .json({ success: false, message: err.message });
    }

    return res.status(500).json({ success: false, message: err });
  }
};

export const userChangePasswordController = async (
  req: Request,
  res: Response
) => {
  try {
    const current: string = req.body.current;
    const UserData = req.user as UserDoc;
    // Add data and send email
    const data = await updateUserPasswordHandler(UserData, current);

    return res
      .status(200)
      .json({ success: true, message: "password Updated Successfully" });
  } catch (err) {
    userLogger.error(`error occurred on userChangePasswordController`, { err });

    if (err instanceof ApiError) {
      return res
        .status(err.status)
        .json({ success: false, message: err.message });
    }

    return res.status(500).json({ success: false, message: err });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const UserData = req.user as UserDoc;
    // Add data and send email
    const data = await deleteUserHandler(UserData);

    return res
      .status(200)
      .json({ success: true, message: "user deleted Successfully" });
  } catch (err) {
    userLogger.error(`error occurred on deleteUserController`, { err });

    if (err instanceof ApiError) {
      return res
        .status(err.status)
        .json({ success: false, message: err.message });
    }

    return res.status(500).json({ success: false, message: err });
  }
};

export const userForgetPasswordController = async (
  req: Request,
  res: Response
) => {
  try {
    let { email } = req.body;
    // Add data and send email
    const data = await forgotPasswordHandler(email);

    return res.status(200).json({
      success: true,
      message: "reset password email sent Successfully",
      data,
    });
  } catch (err) {
    userLogger.error(`error occurred on deleteUserController`, { err });

    if (err instanceof ApiError) {
      return res
        .status(err.status)
        .json({ success: false, message: err.message });
    }

    return res.status(500).json({ success: false, message: err });
  }
};

export const verifyJwtController = async (req: Request, res: Response) => {
  try {
    if (req.user) {
      const user: UserDoc | any = req.user;
      userLogger.info("successfully verified User");
      return res.status(200).json({
        success: true,
        message: "successfully verified User",
        userData: { ...user },
      });
    }
    return res
      .status(500)
      .json({ success: false, message: "User verification failed" });
  } catch (err) {
    userLogger.error(`error occurred on verifyJwtController`, { err });

    return res.status(500).json({ success: false, message: err });
  }
};

export const userUpdatePasswordController = async (
  req: Request,
  res: Response
) => {
  try {
    const password: string = req.body.password;
    const UserData = req.user as UserDoc;
    // Add data and send email
    const data = await updateUserPasswordHandler(UserData, password);

    return res
      .status(200)
      .json({ success: true, message: "password Updated Successfully" });
  } catch (err) {
    userLogger.error(`error occurred on userUpdatePasswordController`, { err });

    if (err instanceof ApiError) {
      return res
        .status(err.status)
        .json({ success: false, message: err.message });
    }

    return res.status(500).json({ success: false, message: err });
  }
};

export const viewProfileController = async (req: Request, res: Response) => {
  try {
    const userId = req.user as UserDoc;
    const data = await getUserProfileHandler(userId._id);

    return res.status(200).json({ success: true, data });
  } catch (err) {
    userLogger.error(`error occurred on viewProfileController`, { err });

    if (err instanceof ApiError) {
      return res
        .status(err.status)
        .json({ success: false, message: err.message });
    }

    return res.status(500).json({ success: false, message: err });
  }
};
