import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '../../lib/mailSender';

interface ContactPayload {
  name: string;
  phone: string;
  email: string;
  title: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Partial<ContactPayload>;

    const { name, phone, email, title, message } = payload;

    if (!name || !phone || !email || !title || !message) {
      return NextResponse.json(
        { success: false, message: 'Please complete all fields before sending your request.' },
        { status: 400 }
      );
    }

    const htmlContent = `
      <div style="font-family: sans-serif; padding: 24px; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">New Contact Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
      </div>
    `;

    await sendEmail({
      to: [{ email: 'succoursurrogacy@gmail.com', name: 'Succour Surrogacy Agency' }],
      subject: `New request: ${title}`,
      htmlContent,
    });

    return NextResponse.json({ success: true, message: 'Request sent successfully.' });
  } catch (error) {
    console.error('Contact form submission failed:', error);
    return NextResponse.json(
      { success: false, message: 'Unable to send request right now. Please try again later.' },
      { status: 500 }
    );
  }
}
