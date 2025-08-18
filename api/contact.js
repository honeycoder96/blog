import { Resend } from 'resend';
import { generateContactFormEmail, generateAutoReplyEmail, formatDate } from '../src/utils/emailTemplate.js';

const resend = new Resend(process.env.RESEND_API_KEY);

// Security configuration
const ALLOWED_ORIGINS = [
  'https://honeyhimself.com',
  'https://www.honeyhimself.com',
  'https://blog.honeyhimself.com',
  'https://www.blog.honeyhimself.com',
];

const SECRET_TOKEN = process.env.CONTACT_FORM_TOKEN;



export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Security: Origin check
  const origin = req.headers.origin || req.headers.referer;
  const isAllowedOrigin = ALLOWED_ORIGINS.some(allowedOrigin => 
    origin && origin.startsWith(allowedOrigin)
  );
  
  if (!isAllowedOrigin) {
    console.warn('Blocked request from unauthorized origin:', origin);
    return res.status(403).json({ error: "Unauthorized origin" });
  }

  // Security: Secret token check
  const providedToken = req.headers['x-contact-token'] || req.body.token;
  if (!SECRET_TOKEN || providedToken !== SECRET_TOKEN) {
    console.warn('Blocked request with invalid token');
    return res.status(403).json({ error: "Invalid token" });
  }

  try {
    const { email, name, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const submittedAt = formatDate(new Date());

    // Generate beautiful email content using our templates
    const notificationEmail = generateContactFormEmail({
      name,
      email,
      message,
      submittedAt
    });

    const autoReplyEmail = generateAutoReplyEmail(name);

    // Send auto-reply to the user
    const autoReplyData = await resend.emails.send({
      from: "Honey Sharma <contact@honeyhimself.com>", 
      to: email,
      subject: "Thank you for contacting! I will get back to you as soon as possible.",
      html: autoReplyEmail,
    });

    // Send notification email to you
    const notificationData = await resend.emails.send({
      from: "Honey Sharma <contact@honeyhimself.com>", 
      to: "honey.singhroi@gmail.com",
      subject: `New contact form submission from ${name}`,
      html: notificationEmail,
    });

    res.status(200).json({ 
      success: true, 
      message: 'Emails sent successfully',
      autoReply: autoReplyData,
      notification: notificationData
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
