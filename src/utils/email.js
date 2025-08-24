import nodemailer from 'nodemailer';
import logger from '../config/logger.js';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async ({ email, subject, message }) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject,
            text: message,
            html: message,
        };

        await transporter.sendMail(mailOptions);
        logger.info(`Email sent to ${email}`);
    } catch (error) {
        logger.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}; 