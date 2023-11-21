import { Request, Response } from "express";
import { ApiError } from "../helpers/helperFunctions";
import { IUser, UserDoc } from "../models/User";
import {
  IRegisteringUser,
  RegisteringUser,
  RegisteringUserDoc,
} from "../models/RegisteringUser";
import { userLogger } from "../utils/logger";
import {
  deleteUserHandler,
  forgotPasswordHandler,
  getUserProfileHandler,
  loginUserHandler,
  registerUserHandler,
  updateUserPasswordHandler,
  verifyUserHandler,
} from "../handlers/user";
import { generateOTP, sendOtpEmail } from "../helpers/otpSender";
import { hashPassword } from "../utils/bcrypt";

//Verify Registering User Otp
export const verifyOtpUserController = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const data = await verifyUserHandler(email,otp)
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err instanceof ApiError) {
      return res
        .status(err.status)
        .json({ success: false, message: err.message });
    }

    return res.status(500).json({ success: false, message: err });
  }
};

//resend otp
export const resendOtpUserController = async (req:Request,res:Response) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();
    await sendOtpEmail(email, otp);
    return res.status(200).json({ success: true, message:'Successfully resend OTP' });
  } catch (err) {
    if (err instanceof ApiError) {
      return res
        .status(err.status)
        .json({ success: false, message: err.message });
    }
    userLogger.error(`error occurred on resend otp`, { err });

    return res.status(500).json({
      success: false,
      message: err,
    });
  }
}

// Register New User
export const registerUserController = async (req: Request, res: Response) => {
  try {
    const userData: IRegisteringUser = req.body;
    const otp = generateOTP();
    await sendOtpEmail(userData.email, otp);

    const hashedPassword = await hashPassword(userData.password); 

    //check whether user exist in dummy collection
    const userExist = await RegisteringUser.findOne({ email: userData.email });

    let user: any; // :RegisteringUserDoc
    if (userExist) {
      await RegisteringUser.findOneAndReplace(
        { _id: userExist._id },
        {
          ...userData,
          password: hashedPassword,
          otp,
        }
      );
    } else {
      user = new RegisteringUser({
        ...userData,
        password: hashedPassword,
        otp,
      });
      await user.save();
    }

    const createdUser = userExist? userExist.toObject() : user.toObject();

    // const data = await registerUserHandler(userData);

    const { password, ...userDetails } = createdUser;

    const userInfo = { ...userDetails };

    userLogger.info("user registered successFully");

    return res.status(200).json({ success: true, data: userInfo });
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
    }); 
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
