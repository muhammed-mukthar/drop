import mime from "mime-types";

import dotenv from "dotenv";
import path from "path";
import * as AWS from "aws-sdk";
import * as fs from "fs";
import sharp from "sharp";

dotenv.config();

const bucketName = process.env.AWS_BUCKET;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.ACCESS_KEY_AWS;
const secretAccessKey = process.env.SECRET_AWS;

export const s3Config = {
  accessKeyId: process.env.ACCESS_KEY_AWS ?? "",
  secretAccessKey: process.env.SECRET_AWS ?? "",
  region: process.env.AWS_REGION ?? "",
};
export const s3 = new AWS.S3(s3Config);
export const defaultBucket: string = process.env.AWS_BUCKET ?? "us-east-2";

export const uploadProfilePic = (filePath: string) => {
  const file = fs.createReadStream(filePath);
  const uploadParams: AWS.S3.PutObjectRequest = {
    Bucket: `${defaultBucket}`,
    Key: `${path.basename(filePath)}`,
    Body: file,
  };
  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, async (err, data) => {
      if (err) {
        console.log("err", err);
        const data = await uploadToUserFolder(filePath);
        if (data) {
          resolve(data);
          return;
        }
        reject(err);
      } else {
        fs.unlinkSync(filePath);
        console.log("uploaded");
        resolve(data);
      }
    });
  });
};

export const uploadToUserFolder = async (filePath: string) => {
  const file = fs.createReadStream(filePath);
  const uploadParams: AWS.S3.PutObjectRequest = {
    Bucket: defaultBucket,
    Key: `${path.basename(filePath)}`,
    Body: file,
  };
  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, (err, data) => {
      if (err) {
        console.log("err line 56", err);
        resolve(null);
      } else {
        fs.unlinkSync(filePath);
        resolve(data);
      }
    });
  });
};

export const resizeImageUserid = async (imagePath: string) => {
  try {
    const compressedImagePath = `${imagePath.split(".")[0]}-compressed.jpeg`;

    await sharp(imagePath)
      .resize(200)
      .toFormat("jpeg", { mozjpeg: true })
      .toFile(compressedImagePath);

    const res = await uploadProfilePic(compressedImagePath);
    console.log("compressres");
    console.log(res);
    return compressedImagePath;
  } catch (error) {
    console.log(error);
  }
};

export const deleteFile = (filePath: string) => {
  try {
    const uploadParams: AWS.S3.PutObjectRequest = {
      Bucket: defaultBucket,
      Key: filePath,
    };
    return new Promise((resolve, reject) => {
      s3.deleteObject(uploadParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  } catch (error) {
    console.log("error: ", error);
    return false;
  }
};

export const getImageProfile = async (req: any, res: any) => {
  try {
    const fileType = mime.lookup(req.params["image"]);
    console.log(req.params);

    const data: AWS.S3.GetObjectOutput | null = await getImageMetaDatav1(
      req.params["image"]
    );

    if (data) {
      res.writeHead(200, { "Content-Type": fileType });
      res.write(data.Body, "binary");
      res.end(null, "binary");
      return;
    }
    const projectDirPath = path.join(__dirname, "..", "..");
    console.log("default pic send");
    res.sendFile(path.join(projectDirPath, "./addProfilePic.jpg"));
  } catch (error) {
    console.log(error, "line ~~239");
  }
};

export const getImageMetaDatav1 = (
  fileName: string
): Promise<AWS.S3.GetObjectOutput | null> => {
  const params: AWS.S3.PutObjectRequest = {
    Bucket: defaultBucket,
    Key: `${fileName}`,
  };

  return new Promise((resolve, reject) => {
    s3.getObject(params, function (err, data) {
      if (err) {
        // console.log(err);
        resolve(null);
      }
      resolve(data);
    });
  });
};
