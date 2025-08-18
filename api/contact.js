import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, subject, message } = req.body;

    // Send email
    const data = await resend.emails.send({
      from: "Your Name <onboarding@resend.dev>",  // Replace with your verified sender
      to: email,
      subject: subject,
      html: `<p>${message}</p>`,
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
