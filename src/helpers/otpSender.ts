const nodemailer = require('nodemailer');

export const sendOtpEmail = async (toEmail: string, otp: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODE_MAILER_EMAIL,
                pass: process.env.NODE_MAILER_PASSWORD,
            },
        });

        // Define the email options
        const mailOptions = {
            from: process.env.NODE_MAILER_EMAIL,
            to: toEmail,
            subject: 'Registration Confirmation and OTP Verification',
            html: `<div style="text-align: center;">
            <p><img src="https://static.vecteezy.com/system/resources/previews/019/152/949/non_2x/hand-holding-a-drop-of-blood-world-blood-donor-day-blood-donation-illustration-donor-symbol-blood-donation-symbol-free-png.png" alt="Your Image" style="width: 200px; height: 150px;"></p>
            <p style="font-size: 15px;">Thank you for registering with our Blood Donation Portal!</p>
            <p style="font-size: 17px;">Your OTP for registration is: <span style="font-weight: 900;">${otp}</span></p>
        </div>`,
        };


        // Send the email
        await transporter.sendMail(mailOptions);

        console.log(`OTP sent to ${toEmail}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw error;
    }
};

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};