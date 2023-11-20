import passport, { use } from "passport";
import passportJwt from "passport-jwt";

import mongoose from "mongoose";
import { User, UserDoc } from "../models/User";
const jwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

import dotenv from "dotenv"; // Import dotenv

dotenv.config(); // Load environment variables

const userAuth = new jwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback: true,
  },
  async (request: any, payload: any, done: any) => {
    let user: UserDoc[] = await User.find({
      _id: new mongoose.Types.ObjectId(payload._id),
      isDeleted: false,
    }).lean();

    if (user.length) {
      const authUser = user[0];

      if (!authUser) {
        return done(null, false, { message: "User not found" });
      } else {
        const { password, ...userData } = authUser;

        return done(null, userData);
      }
    } else {
      return done(null, false, { message: "Unauthorized" });
    }
  }
);

passport.use(userAuth);
