
import mongoose from "mongoose";


interface IRegisteringUser {
  username: string;
  email: string;
  password: string;

  phone: number;
  address: string;
  district: string;
  bloodGroup: string;
  dob: Date;
  lastDonatedDate: Date;
  isVerified: boolean;
  otp: string;
}

interface RegisteringUserDoc extends mongoose.Document {
  username: string;
  email: string;
  password: string;

  phone: number;
  address: string;
  district: string;
  bloodGroup: string;
  dob: Date;
  lastDonatedDate: Date;
  isVerified: boolean;
  otp: string;
}

interface RegisteringUserModelInterface extends mongoose.Model<RegisteringUserDoc> {
  build(attr: IRegisteringUser): RegisteringUserDoc;
}

const RegisteringUserSchema = new mongoose.Schema<RegisteringUserDoc>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: { type: Number, required: true },
    address: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    lastDonatedDate: {
      type: Date,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

RegisteringUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });

const RegisteringUser = mongoose.model<RegisteringUserDoc, RegisteringUserModelInterface>(
  "RegisteringUser",
  RegisteringUserSchema
);


export { RegisteringUser, RegisteringUserDoc, IRegisteringUser };
