import dotenv from 'dotenv';
dotenv.config();

import EmailService from './src/services/emailService.js';

async function testEmailService() {
    console.log('🧪 Testing Mailtrap Email Service...\n');

    // Create email service instance
    const emailService = new EmailService();

    // Test connection first
    console.log('1. Testing SMTP connection...');
    const connectionTest = await emailService.testConnection();

    if (!connectionTest) {
        console.error('❌ Email connection failed. Please check your .env configuration.');
        return;
    }

    // Test sending a welcome email
    console.log('\n2. Testing welcome email...');

    const testCompanyData = {
        name: 'Test Company Inc',
        address: '123 Test Street, Test City, TC 12345',
        phone: '+1-555-TEST',
        email: 'info@testcompany.com',
        website: 'https://testcompany.com'
    };

    const testAdminData = {
        username: 'admin_test_company',
        email: 'admin@testcompany.com'
    };

    const testPassword = 'TestPass123!';

    try {
        const result = await emailService.sendCompanyWelcomeEmail(
            testCompanyData,
            testAdminData,
            testPassword
        );

        if (result.success) {
            console.log('✅ Test email sent successfully!');
            console.log(`📧 Email sent to: ${result.recipient}`);
            console.log(`📮 Message ID: ${result.messageId}`);
            console.log('\n🔍 Check your Mailtrap inbox to view the email:');
            console.log('   https://mailtrap.io/inboxes');
        } else {
            console.error('❌ Failed to send test email:', result.error);
        }
    } catch (error) {
        console.error('❌ Error during email test:', error.message);
    }
}

// Run the test
testEmailService();
