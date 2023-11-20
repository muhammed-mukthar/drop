import { Request, Response, NextFunction } from "express";
import { User, UserDoc } from "../../models/User";


import {
  deleteFile,
  resizeImageUserid,
  uploadProfilePic,
} from "../../utils/awsS3Config";
import { commonLogger, userLogger } from "../../utils/logger";

export const uploadUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUser: UserDoc | any = req.user;
    let file: string = req.file ? req.file.filename : req.body.profilePic;
    userLogger.info(`uploaded user file: ${file}`);
    if (req.file) {
      const compressedImage = await resizeImageUserid(
        `src/temp/userProfile/${req.file.filename}`
      );

      const uploadres: any = await uploadProfilePic(
        `src/temp/userProfile/${req.file.filename}`
      );
      console.log("uploadres");
      console.log(uploadres);
      file = uploadres.key;
    }
    if (req.body.profilePic === "") {
      const userInfo: any = await User.findOne(
        { _id: currentUser._id },
        { profilePic: 1 }
      );
      if (userInfo) {
        const prevFile: string = userInfo.profilePic ?? "";
        if (prevFile) await deleteFile(prevFile);
      }
    }
    req.body.profilePic = file;
    req.body.compressedProfilePic =
      file && file.split(".")[0] + "-compressed" + ".jpeg";

    //change password

    next();
  } catch (err) {
    userLogger.error(`User profile upload failed: ${err}`);
    next(err);
  }
};

