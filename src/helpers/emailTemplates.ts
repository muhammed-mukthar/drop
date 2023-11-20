export const generatePasswordResetEmailTemplate = (
  resetLink: string,
  name?: string
): string => {
  return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Password Reset</title>
      </head>
      <body>
        <p>Hello ${name ? name : ""},</p>
        <p>You have requested a password reset for your account. To reset your password, please click the following link:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you did not request this password reset, please ignore this email.</p>
        <p>Thank you.</p>
      </body>
      </html>
    `;
};

export const uniqueProfileEmailTemplate = (
  profileLink: string,
  name?: string
): string => {
  return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Profile Link</title>
      </head>
      <body>
        <p>Hello${name ? ` ${name},` : ""}</p>
        <p>Your unique profile link is ready. You can access get profile info by clicking the following link:</p>
        <a href="${profileLink}">Access Your Profile</a>
        <p>If you have any questions or need assistance, please feel free to contact us.</p>
        <p>Thank you.</p>
      </body>
      </html>
    `;
};




export const updateProfileEmailTemplate = (
  profileLink: string,
  name?: string
): string => {
  return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Updated Profile Link</title>
      </head>
      <body>
        <p>Hello${name ? ` ${name},` : ""}</p>
        <p>Your Updated profile link is ready. You can get your profile info by clicking the following link:</p>
        <a href="${profileLink}">Access Your Profile</a>
        <p>If you have any questions or need assistance, please feel free to contact us.</p>
        <p>Thank you.</p>
      </body>
      </html>
    `;
};
