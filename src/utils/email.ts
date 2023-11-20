import sgMail from "@sendgrid/mail";
import { IEmail } from "../helpers/interfaces";
import { commonLogger } from "./logger";
import dotenv from "dotenv"; // Import dotenv

dotenv.config(); // Load environment variables
const API_KEY: string = process.env.SGMAIL_API_KEY ?? "";

sgMail.setApiKey(API_KEY);

export const sendEmail = async (data: IEmail) => {

  try {
    const { from, to, subject, text, html, isHtml, attachments = [] } = data;
    const msg = isHtml
      ? {
          to,
          from,
          subject,
          html,
          attachments,
        }
      : {
          from,
          to,
          subject,
          text,
        };
    const status = await sgMail.send(msg);
    commonLogger.info(`Email sent successFully: ${status}`);
  } catch (error: any) {
    commonLogger.error(`Email not sent error occured on sendEmail `, { error });
  }
};
