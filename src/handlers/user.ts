import mongoose, { ObjectId } from "mongoose";
import {
  generatePasswordResetEmailTemplate,
  updateProfileEmailTemplate,
} from "../helpers/emailTemplates";
import { generateToken } from "../helpers/generateToken";
import { ApiError } from "../helpers/helperFunctions";
import { IEmail, UserRole } from "../helpers/interfaces";
import { IUser, User, UserDoc } from "../models/User";
import { bcryptCompare, hashPassword } from "../utils/bcrypt";
import { sendEmail } from "../utils/email";
import { userLogger } from "../utils/logger";

export const registerUserHandler = async (userData: IUser) => {
  try {
    // Create and save user data
    const user: UserDoc = User.build(userData);
    let plainUser = await user.save();
    const createdUser = plainUser.toObject(); // Convert to plain JavaScript object

    console.log(createdUser, "this is user");

    const token = generateToken(createdUser);
    const { password, ...userDetails } = createdUser;

    const userInfo = { ...userDetails, jwtToken: token };

    userLogger.info("user registered successFully");

    return {
      userData: userInfo,
    };
  } catch (err) {
    userLogger.error(`error occurred on registerUserHandler`, { err });

    if (err instanceof ApiError) {
      throw err;
    }

    throw new ApiError("Could not create user", 500);
  }
};

export const loginUserHandler = async (email: string, password: string) => {
  try {
    const isExist = await User.findOne({
      email: { $regex: new RegExp(email, "i") },
      isDeleted: false,
    }).lean();

    const currentUser = isExist; // Now currentUser is a plain JavaScript object

    if (!isExist) {
      throw new ApiError("Invalid Credentials", 409);
    }
    // Await the result of bcryptCompare
    const isPasswordCorrect = await bcryptCompare(password, isExist.password);

    if (!isPasswordCorrect) {
      throw new ApiError("Invalid Credentials", 409);
    }
    const token = generateToken(currentUser);
    userLogger.info("user login successFully");

    const userData = { ...currentUser, jwtToken: token };
    delete userData.password;

    return {
      userData,
    };
  } catch (err) {
    userLogger.error(`error occurred on loginUserHandler`, { err });

    if (err instanceof ApiError) {
      throw err;
    }

    throw new ApiError("Could not login user", 500);
  }
};

export const updateUserPasswordHandler = async (
  userDetails: UserDoc,
  changingPassword: string
) => {
  try {
    const hashedPassword = await hashPassword(changingPassword); // Call the hashPassword function

    let update = await User.findByIdAndUpdate(
      { _id: userDetails._id },
      { password: hashedPassword }
    );

    return {
      update,
    };
  } catch (err) {
    userLogger.error(`error occurred on updateUserPasswordHandler`, { err });

    if (err instanceof ApiError) {
      throw err;
    }

    throw new ApiError("Could not update user", 500);
  }
};

export const deleteUserHandler = async (userDetails: UserDoc) => {
  try {
    await User.findByIdAndUpdate({ _id: userDetails._id }, { isDeleted: true });

    return {
      _id: userDetails._id,
    };
  } catch (err) {
    userLogger.error(`error occurred on deleteUserHandler`, { err });

    if (err instanceof ApiError) {
      throw err;
    }

    throw new ApiError("Could not delete user", 500);
  }
};

export const forgotPasswordHandler = async (email: string) => {
  try {
    const isExist = await User.findOne({
      email: { $regex: new RegExp(email, "i") },
      isDeleted: false,
    }).lean();

    const currentUser = isExist; // Now currentUser is a plain JavaScript object
    if (!isExist) {
      throw new ApiError("User Not found", 409);
    }
    let username = "";

    const token = generateToken(currentUser, "30m");
    const resetLink = `${process.env.REACT_APP_CHANGE_PASSWORD_PATH}?token=${token}`;
    const emailData: IEmail = {
      from: `${process.env.CLIENT_SENDER}`,
      to: email,
      subject: "Password Reset",
      text: "Please click the link to reset your password",
      isHtml: true,
      html: generatePasswordResetEmailTemplate(resetLink, username),
    };

    await sendEmail(emailData); // Use the sendEmail function to send the email

    userLogger.info("token created and email   successFully");

    return {
      link: resetLink,
    };
  } catch (err) {
    userLogger.error(`error occurred on forgotPasswordHandler`, { err });

    if (err instanceof ApiError) {
      throw err;
    }

    throw new ApiError("Could not reset password", 500);
  }
};

export const getUserProfileHandler = async (userId: ObjectId) => {
  try {
    const userData = await User.findOne({
      _id: userId,
      isDeleted: false,
    }).lean();

    if (!userData) {
      throw new ApiError("User not found", 404);
    }

    return {
      userData: userData,
    };
  } catch (err) {
    userLogger.error("Error occurred on getUserProfileHandler", {
      err,
    });

    if (err instanceof ApiError) {
      throw err;
    }

    throw new ApiError("Could not get user data", 500);
  }
};
