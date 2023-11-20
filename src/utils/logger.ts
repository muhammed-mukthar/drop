import { createLogger, transports, format } from "winston";


export const userLogger = createLogger({
  transports: [
    new transports.File({
      filename: `userController.log`,
      format: format.combine(
        format.label({ label: "userController" }),
        format.timestamp(),
        format.splat(),
        format.prettyPrint()
      ),
    }),
  ],
});



export const commonLogger = createLogger({
  transports: [
    new transports.File({
      filename: `commonLogger.log`,
      format: format.combine(
        format.label({ label: "commonLogger" }),
        format.timestamp(),
        format.splat(),
        format.prettyPrint()
      ),
    }),
  ],
});

