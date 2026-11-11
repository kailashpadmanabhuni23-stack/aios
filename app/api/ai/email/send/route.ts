import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, html, text } = body;

    if (!to) {
      return NextResponse.json({ error: 'Recipient email address (to) is required.' }, { status: 400 });
    }
    if (!subject) {
      return NextResponse.json({ error: 'Email subject is required.' }, { status: 400 });
    }

    const emailContent = html || `<div style="font-family: sans-serif; line-height: 1.6; color: #333;">${text || 'No content provided.'}</div>`;

    // ── 1. Resend API Integration (Recommended) ───────────────────
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const fromEmail = process.env.EMAIL_FROM || 'AIOS Operations <onboarding@resend.dev>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: Array.isArray(to) ? to : [to],
          subject,
          html: emailContent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('[email:send] Resend API error:', data);
        return NextResponse.json(
          { error: data.message || 'Resend provider rejected email dispatch.' },
          { status: res.status }
        );
      }

      return NextResponse.json({
        success: true,
        provider: 'resend',
        id: data.id,
        message: `Email successfully delivered to ${to} via Resend.`,
      });
    }

    // ── 2. SendGrid API Integration ───────────────────────────────
    const sendgridKey = process.env.SENDGRID_API_KEY;
    if (sendgridKey) {
      const fromEmail = process.env.EMAIL_FROM || 'operations@aios.app';
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: fromEmail, name: 'AIOS Autonomous Operations' },
          subject,
          content: [{ type: 'text/html', value: emailContent }],
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('[email:send] SendGrid API error:', errorText);
        return NextResponse.json({ error: 'SendGrid rejected delivery.' }, { status: res.status });
      }

      return NextResponse.json({
        success: true,
        provider: 'sendgrid',
        message: `Email successfully delivered to ${to} via SendGrid.`,
      });
    }

    // ── 3. Standby / Configuration Reminder ───────────────────────
    // If no API key is configured yet in Render environment variables
    console.warn('[email:send] Neither RESEND_API_KEY nor SENDGRID_API_KEY is configured in env.');
    return NextResponse.json({
      success: true,
      simulated: true,
      provider: 'standby',
      message: `Email to ${to} has been generated and validated! To deliver real emails to inboxes, add RESEND_API_KEY (free at resend.com) to your Render Environment Variables.`,
    });
  } catch (err: any) {
    console.error('[email:send] Unexpected exception:', err);
    return NextResponse.json({ error: err.message || 'Failed to dispatch email.' }, { status: 500 });
  }
}
