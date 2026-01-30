import { NextResponse } from 'next/server';

interface ProjectData {
  projectName?: string;
  propertyAddress?: string;
  facilityType?: string;
  totalRaise?: string;
  projectedIRR?: string;
}

export async function POST(request: Request) {
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    return NextResponse.json(
      { error: 'Email service not configured' },
      { status: 500 }
    );
  }

  try {
    const { email, exportUrl, projectData, companyName } = await request.json();

    if (!email || !exportUrl) {
      return NextResponse.json(
        { error: 'Email and download URL are required' },
        { status: 400 }
      );
    }

    const projectName = projectData?.projectName || companyName || 'Your Investment Opportunity';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .wrapper {
      background: #f8fafc;
      padding: 40px 20px;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .header p {
      color: rgba(255,255,255,0.9);
      margin: 10px 0 0 0;
      font-size: 15px;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
    }
    .download-box {
      background: linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%);
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      margin: 25px 0;
    }
    .download-button {
      display: inline-block;
      background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
      color: white !important;
      padding: 16px 40px;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 16px;
      margin-top: 15px;
    }
    .details {
      background: #f8fafc;
      border-radius: 10px;
      padding: 20px;
      margin: 25px 0;
    }
    .details h3 {
      margin: 0 0 15px 0;
      color: #475569;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .details ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .details li {
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }
    .details li:last-child {
      border-bottom: none;
    }
    .details strong {
      color: #64748b;
    }
    .note {
      background: #FEF3C7;
      border-radius: 8px;
      padding: 15px;
      font-size: 13px;
      color: #92400E;
      margin-top: 25px;
    }
    .footer {
      padding: 25px 30px;
      background: #f8fafc;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Your Investor Deck is Ready</h1>
        <p>${projectName}</p>
      </div>

      <div class="content">
        <p class="greeting">
          Great news! Your professional investor deck has been created and is ready for download.
        </p>

        <div class="download-box">
          <p style="margin: 0 0 5px 0; color: #64748b; font-size: 14px;">Click below to download your deck</p>
          <a href="${exportUrl}" class="download-button">
            Download PowerPoint
          </a>
        </div>

        <div class="details">
          <h3>Project Summary</h3>
          <ul>
            <li><strong>Project:</strong> ${projectData?.projectName || projectName}</li>
            <li><strong>Property:</strong> ${projectData?.propertyAddress || 'See deck for details'}</li>
            <li><strong>Type:</strong> ${projectData?.facilityType || 'Healthcare Development'}</li>
            <li><strong>Total Raise:</strong> ${projectData?.totalRaise || 'See deck for details'}</li>
          </ul>
        </div>

        <div class="note">
          <strong>Note:</strong> This download link will expire in 24 hours. Please download your deck promptly.
        </div>
      </div>

      <div class="footer">
        <p>This deck was professionally generated for your investment presentation.</p>
        <p style="margin-top: 10px;">Questions? Reply to this email.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Investor Deck <noreply@resend.dev>',
        to: [email],
        subject: `Your Investor Deck: ${projectName}`,
        html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send deck email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
