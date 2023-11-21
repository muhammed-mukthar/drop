import { Request, Response, NextFunction } from "express";
import { User, UserDoc } from "../../models/User";
import { userLogger } from "../../utils/logger";
import { bcryptCompare } from "../../utils/bcrypt";
import { check, validationResult } from "express-validator";
import { isGenericPhoneNumber } from "../../helpers/helperFunctions";

export const checkUserDoesntExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, phone } = req.body; // You can modify this to match the request body structure

    const isExist = await User.findOne({
      $or: [
        { email: { $regex: new RegExp(email, "i") } }, // Case-insensitive search for email
        { phone },
      ],
    });

    console.log(isExist,'User not exist');

    if (isExist) {
      if (isExist.isDeleted) {
        await User.findByIdAndUpdate(
          {
            _id: isExist._id,
          },
          { isDeleted: false }
        );

        return res.status(200).json({
          success: true,
          message: "recovered account login with the credentials",
        });
      } else {
        return res
          .status(409)
          .json({ success: false, message: "User details already exist" });
      }
    }

    next();
  } catch (error) {
    userLogger.error("errror occured on checkUserExists ", {
      error,
    });
    return res.status(500).json({ success: false, message: error });
  }
};

export const checkPasswordMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = req.user as UserDoc;
    const { current, previous } = req.body;

    // Find the user by ID
    const userDetails = await User.findOne({
      _id: userData._id,
      isDeleted: false,
    });

    if (!userDetails) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    // Compare the current password with the stored password using bcrypt

    const isPasswordCorrect = await bcryptCompare(
      previous,
      userDetails.password
    );

    if (!isPasswordCorrect) {
      return res
        .status(409)
        .json({ success: false, message: "incorrect Password" });
    }

    next();
  } catch (error) {
    // Handle errors
    userLogger.error("Error occurred on checkPasswordMiddleware: ", error);
    return res.status(500).json({ success: false, message: error });
  }
};

export const checkUserWithEmailExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body; // You can modify this to match the request body structure
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email  is required" });
    }
    let query: any = {
      isDeleted: false,
    };

    if (email) {
      query.email = { $regex: new RegExp(email, "i") };
    }

    const isExist = await User.findOne(query);

    if (!isExist) {
      return res
        .status(409)
        .json({ success: false, message: "User doesn't exist" });
    }

    next();
  } catch (error) {
    userLogger.error("errror occured on checkUserWithEmailExistsMiddleware ", {
      error,
    });
    return res.status(500).json({ success: false, message: error });
  }
};

export const ValidateUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await check("tenantPersonalDetails.honorific", "honorific is required")
      .isString()
      .optional()
      .run(req);

    await check("tenantPersonalDetails.name", "name is required")
      .isString()
      .optional()
      .run(req);

    await check("tenantPersonalDetails.dob", "date of birth is required")
      .isString()
      .optional()
      .run(req);

    await check("tenantPersonalDetails.address", "address is required")
      .isString()
      .optional()
      .run(req);

    await check(
      "tenantPersonalDetails.description",
      "Description must be a string"
    )
      .isString()
      .optional()
      .run(req);

    await check(
      "tenantFinanceInfo.employmentStatus",
      "Employment status is required and must be a string"
    )
      .isString()
      .optional()
      .run(req);

    await check(
      "tenantFinanceInfo.savingsInfo",
      "Savings data must be a string"
    )
      .isString()
      .optional()
      .run(req);

    await check("tenantCreditInfo.hasCCJ", "CCJ must be a boolean")
      .optional()
      .run(req);

    await check(
      "tenantCreditInfo.hasMultipleCCJs",
      "Multiple CCJs must be a boolean"
    )
      .isBoolean()
      .optional()
      .run(req);

    await check(
      "tenantAdditionalInfo.livingWithChildren",
      "Living with children must be a boolean"
    )
      .isBoolean()
      .optional()
      .run(req);

    await check(
      "tenantAdditionalInfo.doDependentsSmoke",
      "Dependents smoking must be a boolean"
    )
      .isBoolean()
      .optional()
      .run(req);

    await check("tenantAdditionalInfo.hasPets", "Has pets must be a boolean")
      .isBoolean()
      .optional()
      .run(req);

    await check(
      "tenantGuarantorInfo.hasGuarantor",
      "Has guarantor must be a boolean"
    )
      .isBoolean()
      .optional()
      .run(req);
    await check("email", "Email is not valid").isEmail().optional().run(req);
    await check("password", "Password must be at least 6 characters long")
      .isLength({ min: 6 })
      .optional()
      .run(req);
    await check("phone", "Phone must be a valid phone number")
      .custom(isGenericPhoneNumber)
      .optional()
      .run(req);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        success: false,
        message: "Invalid Request parameters",
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};

export const checkDuplicateEmailOrPhone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, phone } = req.body; // Check if email or phone is being updated

    if (email) {
      // Check for duplicate email
      const userWithSameEmail = await User.findOne(
        { email: { $regex: new RegExp(email, "i") } } // Case-insensitive search for email
      );
      if (userWithSameEmail) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another user.",
        });
      }
    }

    if (phone) {
      // Check for duplicate phone number
      const userWithSamePhone = await User.findOne({ phone });
      if (userWithSamePhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number is already in use by another user.",
        });
      }
    }

    next(); // Proceed to the next middleware or controller if no duplicates are found
  } catch (error) {
    userLogger.error("error occurred on checkDuplicateEmailOrPhone ", {
      error,
    });

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
