import bcrypt from "bcrypt-nodejs";
import mongoose from "mongoose";
import {

  UserRole,
} from "../helpers/interfaces";


interface IUser {
  role: UserRole;
  email: string;
  password: string;
  phone: number;
  
  isDeleted:boolean,

}

interface UserDoc extends mongoose.Document {
  role: UserRole;
  email: string;
  password: string;
  phone: number;
 
  isDeleted:boolean,


}

interface UserModelInterface extends mongoose.Model<UserDoc> {
  build(attr: IUser): UserDoc;
}

const UserSchema = new mongoose.Schema<UserDoc>(
  {
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
  
    role: {
      type: String,
      default:UserRole.Tenant
    },
    isDeleted:{
      type:Boolean,
      default:false
    }

  },
  { timestamps: true }
);

UserSchema.pre("save", function save(next) {
  const User = this as UserDoc;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(User.password, salt, null, (err: mongoose.Error, hash) => {
      if (err) {
        return next(err);
      }
      User.password = hash;
      next();
    });
  });
});

UserSchema.statics.build = (attr: IUser) => new User(attr);
const User = mongoose.model<UserDoc, UserModelInterface>(
  "User",
  UserSchema
);

export { User, UserDoc, IUser };
