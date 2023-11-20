
//optins for user role
export enum UserRole {
  Tenant = "Tenant",
  SuperAdmin = "SuperAdmin",
  Agent = "Agent",
  // Add more roles as needed
}

// email config

export interface IEmail {
  from: string;
  to: string | Array<string>;
  subject: string;
  text: string;
  html: string;
  isHtml: boolean;
  attachments?: Array<any>;
  name?: string;
  companyName?: string;
}
