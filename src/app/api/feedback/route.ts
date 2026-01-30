import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const feedback = await request.json();

    // Log feedback (in production, send to your preferred service: Slack, email, database, etc.)
    console.log('User Feedback:', JSON.stringify(feedback, null, 2));

    // If you have a Slack webhook, you could send it there:
    const slackWebhook = process.env.SLACK_FEEDBACK_WEBHOOK;
    if (slackWebhook) {
      await fetch(slackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `New Feedback Received`,
          blocks: [
            {
              type: 'header',
              text: { type: 'plain_text', text: '📝 New Deck Generator Feedback' },
            },
            {
              type: 'section',
              fields: [
                { type: 'mrkdwn', text: `*Category:*\n${feedback.category}` },
                { type: 'mrkdwn', text: `*Project:*\n${feedback.projectName || 'Unknown'}` },
              ],
            },
            {
              type: 'section',
              text: { type: 'mrkdwn', text: `*Feedback:*\n${feedback.feedback}` },
            },
            {
              type: 'context',
              elements: [{ type: 'mrkdwn', text: `Submitted: ${feedback.timestamp}` }],
            },
          ],
        }),
      });
    }

    // If you want to email feedback:
    const resendKey = process.env.RESEND_API_KEY;
    const feedbackEmail = process.env.FEEDBACK_EMAIL;
    if (resendKey && feedbackEmail) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Deck Generator Feedback <noreply@resend.dev>',
          to: [feedbackEmail],
          subject: `Feedback: ${feedback.category} - ${feedback.projectName || 'Unknown Project'}`,
          html: `
            <h2>New Feedback</h2>
            <p><strong>Category:</strong> ${feedback.category}</p>
            <p><strong>Project:</strong> ${feedback.projectName || 'Unknown'}</p>
            <p><strong>Feedback:</strong></p>
            <p>${feedback.feedback}</p>
            <hr>
            <p><small>Submitted: ${feedback.timestamp}</small></p>
          `,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit feedback' }, { status: 500 });
  }
}
