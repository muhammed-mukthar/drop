import { sign } from "jsonwebtoken";

export const generateToken = (user: any, expires: string = '30d'): any => {
  const payload = { email: user.email, _id: user._id, role: user.role };
  return sign(payload, `${process.env.JWT_SECRET}`,{ expiresIn: expires });
};
