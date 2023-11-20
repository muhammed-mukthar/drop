import express from "express";
import {
  ValidateLogin,
  ValidateChangingPassword,
  ValidateRegister,
  validateEmailMiddleware,
  ValidatePassword,
} from "../middlewares/validations/common";
import {
  deleteUserController,
  loginUserController,
  registerUserController,
  userChangePasswordController,
  userForgetPasswordController,
  userUpdatePasswordController,
  verifyJwtController,
  viewProfileController,
} from "../controllers/userController";
import {

  checkPasswordMiddleware,
  checkUserDoesntExists,
  checkUserWithEmailExistsMiddleware,
} from "../middlewares/validations/user";
import passport from "passport";
import { upload } from "../utils/mutlerConfig";
import { getImageProfile } from "../utils/awsS3Config";
import { uploadUserProfile } from "../middlewares/uploadFiles/uploadFiles";

const router = express.Router();

router.post(
  "/signup",
  ValidateRegister,
  checkUserDoesntExists,
  registerUserController
);
router.post(
  "/login",
  ValidateLogin,
  loginUserController
);
//this api will have previous and changing password previous password will be checked if it is valid
router.post(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  ValidateChangingPassword,
  checkPasswordMiddleware,
  userChangePasswordController
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteUserController
);

router.post(
  "/forgot-password",
  validateEmailMiddleware,
  checkUserWithEmailExistsMiddleware,
  userForgetPasswordController
);
router.get(
  "/verify-jwt",
  passport.authenticate("jwt", { session: false }),
  verifyJwtController
);
//this will update the password with req.body.password
router.post(
  "/update-password",
  passport.authenticate("jwt", { session: false }),
  ValidatePassword,
  userUpdatePasswordController
);

router.get(
  "/view-profile",
  passport.authenticate("jwt", { session: false }),
  viewProfileController
);

router.get("/profile-pic/:image", getImageProfile);

export { router as userRouter };
