import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EmailService {
    constructor() {
        // Configure email transporter for Mailtrap SMTP
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
            port: parseInt(process.env.EMAIL_PORT) || 587,
            secure: process.env.EMAIL_SECURE === 'true', // false for 587, true for 465
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            // Additional options for better compatibility
            tls: {
                rejectUnauthorized: false // Allow self-signed certificates
            }
        });
    }

    // Test email connection
    async testConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ Email server is ready to take our messages');
            console.log(`📧 Using SMTP: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`);
            return true;
        } catch (error) {
            console.error('❌ Email server connection failed:', error.message);
            return false;
        }
    }

    // Send welcome email to new company admin
    async sendCompanyWelcomeEmail(companyData, adminUserData, plainPassword) {
        try {
            const emailTemplate = this.generateWelcomeEmailTemplate(companyData, adminUserData, plainPassword);

            const mailOptions = {
                from: process.env.EMAIL_FROM || '"Invento Support" <support@invento.com>',
                to: adminUserData.email,
                subject: `Welcome to Invento - ${companyData.name} Account Setup Complete`,
                html: emailTemplate.html,
                text: emailTemplate.text
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Welcome email sent to ${adminUserData.email}:`, info.messageId);

            return {
                success: true,
                messageId: info.messageId,
                recipient: adminUserData.email
            };
        } catch (error) {
            console.error('❌ Failed to send welcome email:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Generate HTML and text templates for welcome email
    generateWelcomeEmailTemplate(companyData, adminUserData, plainPassword) {
        const currentYear = new Date().getFullYear();
        const loginUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Invento</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
                .credentials-box { background: white; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0; }
                .credential-item { margin: 10px 0; padding: 8px; background: #f1f3f4; border-radius: 4px; }
                .credential-label { font-weight: bold; color: #495057; }
                .credential-value { font-family: monospace; color: #212529; background: #e9ecef; padding: 2px 6px; border-radius: 3px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
                .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎉 Welcome to Invento!</h1>
                <p>Your company account has been successfully set up</p>
            </div>
            
            <div class="content">
                <h2>Hello ${adminUserData.username}!</h2>
                
                <p>Congratulations! Your company <strong>${companyData.name}</strong> has been successfully registered with Invento - your comprehensive inventory management solution.</p>
                
                <div class="credentials-box">
                    <h3>🔐 Your Admin Login Credentials</h3>
                    <p>Use these credentials to access your admin dashboard:</p>
                    
                    <div class="credential-item">
                        <span class="credential-label">Login URL:</span><br>
                        <span class="credential-value">${loginUrl}</span>
                    </div>
                    
                    <div class="credential-item">
                        <span class="credential-label">Username:</span><br>
                        <span class="credential-value">${adminUserData.username}</span>
                    </div>
                    
                    <div class="credential-item">
                        <span class="credential-label">Email:</span><br>
                        <span class="credential-value">${adminUserData.email}</span>
                    </div>
                    
                    <div class="credential-item">
                        <span class="credential-label">Temporary Password:</span><br>
                        <span class="credential-value">${plainPassword}</span>
                    </div>
                </div>

                <div class="warning">
                    <strong>⚠️ Important Security Notice:</strong>
                    <ul>
                        <li>Please log in and change your password immediately</li>
                        <li>Keep your credentials secure and don't share them</li>
                        <li>This email contains sensitive information - please delete it after logging in</li>
                    </ul>
                </div>

                <div style="text-align: center;">
                    <a href="${loginUrl}" class="button">🚀 Access Your Dashboard</a>
                </div>

                <h3>🏢 Company Details</h3>
                <ul>
                    <li><strong>Company Name:</strong> ${companyData.name}</li>
                    ${companyData.address ? `<li><strong>Address:</strong> ${companyData.address}</li>` : ''}
                    ${companyData.phone ? `<li><strong>Phone:</strong> ${companyData.phone}</li>` : ''}
                    ${companyData.website ? `<li><strong>Website:</strong> ${companyData.website}</li>` : ''}
                </ul>

                <h3>🎯 What's Next?</h3>
                <ol>
                    <li>Log in to your admin dashboard</li>
                    <li>Change your temporary password</li>
                    <li>Complete your company profile</li>
                    <li>Start adding your inventory, suppliers, and team members</li>
                    <li>Explore the powerful features of Invento</li>
                </ol>

                <p>If you have any questions or need assistance getting started, please don't hesitate to contact our support team.</p>
                
                <p>Welcome aboard!</p>
                <p><strong>The Invento Team</strong></p>
            </div>

            <div class="footer">
                <p>© ${currentYear} Invento. All rights reserved.</p>
                <p>This email was sent to ${adminUserData.email} for company registration confirmation.</p>
            </div>
        </body>
        </html>`;

        const textTemplate = `
Welcome to Invento!

Hello ${adminUserData.username}!

Congratulations! Your company "${companyData.name}" has been successfully registered with Invento.

Your Admin Login Credentials:
- Login URL: ${loginUrl}
- Username: ${adminUserData.username}
- Email: ${adminUserData.email}
- Temporary Password: ${plainPassword}

IMPORTANT SECURITY NOTICE:
- Please log in and change your password immediately
- Keep your credentials secure and don't share them
- Delete this email after logging in

Company Details:
- Company Name: ${companyData.name}
${companyData.address ? `- Address: ${companyData.address}` : ''}
${companyData.phone ? `- Phone: ${companyData.phone}` : ''}
${companyData.website ? `- Website: ${companyData.website}` : ''}

What's Next?
1. Log in to your admin dashboard
2. Change your temporary password
3. Complete your company profile
4. Start adding your inventory, suppliers, and team members
5. Explore the powerful features of Invento

Access your dashboard: ${loginUrl}

If you have any questions, please contact our support team.

Welcome aboard!
The Invento Team

© ${currentYear} Invento. All rights reserved.
        `;

        return {
            html: htmlTemplate,
            text: textTemplate
        };
    }

    // Send general email
    async sendEmail(to, subject, htmlContent, textContent = null) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM || '"Invento Support" <support@invento.com>',
                to,
                subject,
                html: htmlContent,
                text: textContent || htmlContent.replace(/<[^>]*>/g, '') // Strip HTML for text version
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email sent to ${to}:`, info.messageId);

            return {
                success: true,
                messageId: info.messageId,
                recipient: to
            };
        } catch (error) {
            console.error('❌ Failed to send email:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default EmailService;
