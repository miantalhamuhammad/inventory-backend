import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { CustomError } from '../utils/custom-error.js';
import { sendEmail } from '../utils/email.js';

// Temporary in-memory user storage
const users = [];

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const generateResetToken = () => {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    return { resetToken, hashedToken };
};

export const register = async (userData) => {
    const { username, email, password } = userData;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
        throw new CustomError('User with this email or username already exists', 400);
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

    // Create new user
    const user = {
        _id: crypto.randomBytes(16).toString('hex'),
        username,
        email,
        password,
        emailVerificationToken: hashedVerificationToken,
        emailVerificationExpire: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        isEmailVerified: false,
    };
    users.push(user);

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await sendEmail({
        email: user.email,
        subject: 'Email Verification',
        message: `Please verify your email by clicking on this link: ${verificationUrl}`,
    });

    return {
        message: 'Registration successful. Please check your email to verify your account.',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    };
};

export const login = async (credentials) => {
    const { email, password } = credentials;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
        throw new CustomError('Invalid credentials', 401);
    }

    // Check if password is correct
    if (user.password !== password) {
        throw new CustomError('Invalid credentials', 401);
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
        throw new CustomError('Please verify your email before logging in', 401);
    }

    // Generate token
    const token = generateToken(user._id);

    return {
        message: 'Login successful',
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    };
};

export const forgotPassword = async (email) => {
    const user = users.find(u => u.email === email);
    if (!user) {
        throw new CustomError('No user found with this email', 404);
    }

    // Generate reset token
    const { resetToken, hashedToken } = generateResetToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail({
        email: user.email,
        subject: 'Password Reset',
        message: `Please reset your password by clicking on this link: ${resetUrl}`,
    });

    return { message: 'Password reset email sent' };
};

export const resetPassword = async (token, newPassword) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const user = users.find(u =>
        u.resetPasswordToken === hashedToken &&
        u.resetPasswordExpire > Date.now(),
    );

    if (!user) {
        throw new CustomError('Invalid or expired reset token', 400);
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    return { message: 'Password reset successful' };
};

export const verifyEmail = async (token) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const user = users.find(u =>
        u.emailVerificationToken === hashedToken &&
        u.emailVerificationExpire > Date.now(),
    );

    if (!user) {
        throw new CustomError('Invalid or expired verification token', 400);
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    return { message: 'Email verified successfully' };
};
