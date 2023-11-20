import bcrypt from "bcrypt-nodejs";
import mongoose from "mongoose";

export const bcryptCompare = (password: string, hash: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result); // Resolve with a boolean value (true for a match, false for no match)
      }
    });
  });
};




// Function to hash a password and return the hashed password
export const hashPassword = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return reject(err);
      }
      bcrypt.hash(password, salt, null, (err: mongoose.Error, hash) => {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    });
  });
};

