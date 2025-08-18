export function generateContactFormEmail(data) {
	const { name, email, message, submittedAt } = data;
	
	return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: 1px;">
                📧 New Contact Message
            </h1>
            <p style="margin: 10px 0 0 0; color: #e8e8e8; font-size: 16px;">
                You have received a new message from your website
            </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            <!-- Submission Info -->
            <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
                <h2 style="margin: 0 0 15px 0; color: #333; font-size: 20px; font-weight: 600;">
                    📋 Submission Details
                </h2>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; align-items: center;">
                        <span style="font-weight: 600; color: #555; min-width: 80px;">Name:</span>
                        <span style="color: #333;">${name}</span>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span style="font-weight: 600; color: #555; min-width: 80px;">Email:</span>
                        <span style="color: #333;">
                            <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                        </span>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span style="font-weight: 600; color: #555; min-width: 80px;">Date:</span>
                        <span style="color: #333;">${submittedAt}</span>
                    </div>
                </div>
            </div>

            <!-- Message Content -->
            <div style="margin-bottom: 30px;">
                <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px; font-weight: 600;">
                    💬 Message
                </h2>
                <div style="background-color: #ffffff; border: 1px solid #e1e5e9; border-radius: 8px; padding: 25px; line-height: 1.6;">
                    <p style="margin: 0; color: #333; font-size: 16px; white-space: pre-wrap;">${message}</p>
                </div>
            </div>

            <!-- Action Buttons -->
            <div style="text-align: center; margin-top: 40px;">
                <a href="mailto:${email}?subject=Re: Your message from ${name}" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; margin: 0 10px; transition: transform 0.2s ease;">
                    ✉️ Reply to ${name}
                </a>
                <a href="mailto:${email}" 
                   style="display: inline-block; background-color: #6c757d; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; margin: 0 10px; transition: transform 0.2s ease;">
                    📧 Send Email
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e1e5e9;">
            <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">
                This message was sent from your website's contact form
            </p>
            <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
                <a href="#" style="color: #667eea; text-decoration: none; font-size: 14px;">Privacy Policy</a>
                <span style="color: #ccc;">|</span>
                <a href="#" style="color: #667eea; text-decoration: none; font-size: 14px;">Unsubscribe</a>
            </div>
        </div>
    </div>
</body>
</html>
	`.trim();
}

// Template for auto-reply to the user
export function generateAutoReplyEmail(userName) {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for your message</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: 1px;">
                ✅ Message Received!
            </h1>
            <p style="margin: 10px 0 0 0; color: #e8e8e8; font-size: 16px;">
                Thank you for reaching out to us
            </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px; font-weight: 600;">
                Hi ${userName}! 👋
            </h2>
            
            <p style="margin: 0 0 20px 0; color: #555; font-size: 16px; line-height: 1.6;">
                Thank you for taking the time to send us a message. We've received your inquiry and will get back to you as soon as possible.
            </p>

            <div style="background-color: #f8f9fa; border-left: 4px solid #28a745; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px; font-weight: 600;">
                    📋 What happens next?
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #555;">
                    <li style="margin-bottom: 8px;">We'll review your message within 24 hours</li>
                    <li style="margin-bottom: 8px;">You'll receive a personalized response</li>
                    <li style="margin-bottom: 8px;">We'll address all your questions and concerns</li>
                </ul>
            </div>

            <p style="margin: 30px 0 20px 0; color: #555; font-size: 16px; line-height: 1.6;">
                In the meantime, feel free to explore our website for more information about our services and offerings.
            </p>

            <!-- Call to Action -->
            <div style="text-align: center; margin: 40px 0;">
                <a href="#" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600;">
                    🌐 Visit Our Website
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e1e5e9;">
            <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">
                This is an automated response. Please do not reply to this email.
            </p>
            <p style="margin: 0; color: #999; font-size: 12px;">
                © 2024 Your Website. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
	`.trim();
}

// Helper function to format date
export function formatDate(date) {
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		timeZoneName: 'short'
	}).format(date);
} 