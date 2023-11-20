import multer from "multer";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { commonLogger } from "./logger";
export const storage = multer.memoryStorage();
const tempStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const path = "src/temp/userProfile/";
      fs.mkdirSync(path, { recursive: true });
      return cb(null, path);
    },
    filename: (req, file, cb) => {
      console.log(file);
      commonLogger.info(`Uploading the file: ${file.originalname}`);
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
export const upload = multer({ storage: tempStorage });
export const generateFileName = (originalname:any, bytes = 8) =>{
   return`${crypto.randomBytes(bytes).toString("hex")}${originalname}`   ;

}
