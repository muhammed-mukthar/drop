import regx from "../utils/regex";

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public errCode: number = 0 // Default error code if not provided
  ) {
    super();
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  public logError() {
    const errorMessage = `API Error: ${this.message} (status ${this.status}, code ${this.errCode})`;

    return errorMessage;
  }
}

export const isGenericPhoneNumber = (value: string) => {
  // Implement your custom phone number validation logic here
  // You can use regular expressions or any other method
  // For example, a simple check for numeric characters:
  return regx.number.test(value);
};
