import { NextResponse } from 'next/server';
import { after } from 'next/server';

const GAMMA_API_URL = 'https://public-api.gamma.app/v1.0/generations';
const GAMMA_API_KEY = process.env.GAMMA_API_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

interface ProjectData {
  projectName?: string;
  propertyAddress?: string;
  lotSize?: string;
  zoning?: string;
  zoningStatus?: string;
  purchasePrice?: string;
  facilityType?: string;
  bedCount?: string;
  squareFootage?: string;
  constructionTimeline?: string;
  totalProjectCost?: string;
  generalContractor?: string;
  marketLocation?: string;
  population65Plus?: string;
  populationGrowth?: string;
  competitorCount?: string;
  marketOccupancy?: string;
  averageDailyRate?: string;
  demandDrivers?: string;
  totalRaise?: string;
  debtFinancing?: string;
  projectedNOI?: string;
  projectedIRR?: string;
  cashOnCash?: string;
  equityMultiple?: string;
  goingInCapRate?: string;
  exitCapRate?: string;
  holdPeriod?: string;
  sponsorName?: string;
  sponsorExperience?: string;
  priorDeals?: string;
  priorReturns?: string;
  assetsUnderManagement?: string;
  coInvestAmount?: string;
  operator?: string;
  minimumInvestment?: string;
  preferredReturn?: string;
  waterfallStructure?: string;
  managementFee?: string;
  acquisitionFee?: string;
  dispositionFee?: string;
  distributionFrequency?: string;
  exitStrategy?: string;
}

function buildInvestorDeckPrompt(data: ProjectData, companyName: string): string {
  return `Create a professional investor pitch deck for a real estate development project.

# PROJECT OVERVIEW
Project Name: ${data.projectName || companyName || 'Healthcare Development Opportunity'}
Property Address: ${data.propertyAddress || 'Southern California'}
Facility Type: ${data.facilityType || 'Skilled Nursing Facility'}
Total Raise: ${data.totalRaise || '$1.5M'} LP Equity

# SLIDES TO CREATE

## Slide 1: Cover
- Project name: ${data.projectName || companyName}
- Tagline: "${data.totalRaise || '$1.5M'} Equity Investment Opportunity"
- Location: ${data.propertyAddress || data.marketLocation || 'Southern California'}
- Add "CONFIDENTIAL" at bottom

## Slide 2: Executive Summary
Key Investment Highlights (bullet points):
- ${data.facilityType || 'Skilled Nursing'} Development
- ${data.bedCount || '72'} Licensed Beds
- ${data.constructionTimeline || '18 month'} development timeline
- Projected ${data.projectedIRR || '18%'} IRR
- ${data.preferredReturn || '8%'} Preferred Return to LPs

Key Metrics Table:
| Metric | Value |
| Total Raise | ${data.totalRaise || '$1.5M'} |
| Total Project Cost | ${data.totalProjectCost || '$8.5M'} |
| Projected IRR | ${data.projectedIRR || '18%'} |
| Equity Multiple | ${data.equityMultiple || '2.1x'} |
| Cash-on-Cash | ${data.cashOnCash || '10-12%'} |
| Hold Period | ${data.holdPeriod || '5-7 years'} |

## Slide 3: The Opportunity
Property Details:
- Address: ${data.propertyAddress || 'TBD'}
- Lot Size: ${data.lotSize || 'TBD'}
- Zoning: ${data.zoning || 'Healthcare/Commercial'}
- Status: ${data.zoningStatus || 'Entitled'}
- Land Basis: ${data.purchasePrice || 'TBD'}

Development Overview:
- Facility Type: ${data.facilityType || 'Skilled Nursing Facility'}
- Beds: ${data.bedCount || '72'}
- Square Footage: ${data.squareFootage || '45,000 SF'}
- Timeline: ${data.constructionTimeline || '18 months'}
- Total Cost: ${data.totalProjectCost || '$8.5M'}

## Slide 4: Market Analysis
Create compelling data visualization showing:
- Population 65+: ${data.population65Plus || '125,000+'} in 10-mile radius
- Population Growth: ${data.populationGrowth || '+15%'} projected over 10 years
- Competing Facilities: ${data.competitorCount || '6-8'} in market
- Market Occupancy: ${data.marketOccupancy || '92%'}
- Average Daily Rate: ${data.averageDailyRate || '$325'}

Key Demand Drivers: ${data.demandDrivers || 'Aging population, hospital discharge partnerships, limited new supply'}

## Slide 5: Development Plan
Show a timeline with 4 phases:
1. Pre-Development (0-3 months): Permits, financing
2. Construction (3-18 months): Ground-up build
3. Licensing (18-21 months): State certification
4. Stabilization (21-30 months): Lease-up to 90%+ occupancy

Facility Specifications:
- ${data.bedCount || '72'} beds
- ${data.squareFootage || '45,000'} square feet
- General Contractor: ${data.generalContractor || 'TBD'}

Total Development Budget: ${data.totalProjectCost || '$8.5M'}

## Slide 6: Team & Track Record
Sponsor Profile: ${data.sponsorName || 'Principal Sponsor'}
- ${data.sponsorExperience || '15+ years in healthcare real estate'}
- ${data.priorDeals || '10+'} deals completed
- ${data.assetsUnderManagement || '$50M+'} AUM
- ${data.priorReturns || '18%+'} average investor IRR
- ${data.coInvestAmount || '5%'} GP co-investment

Operator: ${data.operator || 'Experienced third-party operator'}

## Slide 7: Financial Projections
Create a bar chart showing NOI growth over 5 years:
Year 1: $200K, Year 2: $450K, Year 3: $650K, Year 4: $750K, Year 5: $800K

Key Returns:
- Projected IRR: ${data.projectedIRR || '18%'}
- Equity Multiple: ${data.equityMultiple || '2.1x'}
- Cash-on-Cash: ${data.cashOnCash || '10-12%'}
- Going-In Cap: ${data.goingInCapRate || '11%'}
- Exit Cap: ${data.exitCapRate || '12%'}

## Slide 8: Deal Structure
Investment Terms:
| Term | Value |
| Total Raise | ${data.totalRaise || '$1.5M'} |
| Minimum Investment | ${data.minimumInvestment || '$50,000'} |
| Preferred Return | ${data.preferredReturn || '8%'} |
| Distributions | ${data.distributionFrequency || 'Quarterly'} |
| Hold Period | ${data.holdPeriod || '5-7 years'} |
| GP Co-Invest | ${data.coInvestAmount || '5%'} |

Waterfall Structure:
- Tier 1: Return of Capital → 100% to LP
- Tier 2: ${data.preferredReturn || '8%'} Preferred Return → 100% to LP
- Tier 3: Up to 12% IRR → 80% LP / 20% GP
- Tier 4: Above 12% IRR → 70% LP / 30% GP

Fees: Acquisition ${data.acquisitionFee || '1%'}, Management ${data.managementFee || '1.5%'}, Disposition ${data.dispositionFee || '1%'}

## Slide 9: Use of Funds
Create a pie chart showing capital stack:
- LP Equity: 60%
- GP Equity: 10%
- Debt: 30%

Use of Proceeds breakdown:
- Land Acquisition: ${data.purchasePrice || '$1.2M'} (14%)
- Hard Construction: $5.5M (65%)
- Soft Costs: $800K (9%)
- Financing: $400K (5%)
- Reserves: $350K (4%)
- Developer Fee: $250K (3%)

## Slide 10: Exit Strategy & Next Steps
Exit Scenarios:
1. Sale to REIT/PE (Year 5-7)
2. Refinance & Hold (Year 4-5)
3. Portfolio Sale (Year 6-8)

Target Hold Period: ${data.holdPeriod || '5-7 years'}
Primary Strategy: ${data.exitStrategy || 'Sale at stabilization'}

Next Steps:
1. Schedule a call to discuss the opportunity
2. Review the Private Placement Memorandum
3. Complete subscription documents

Contact: ${data.sponsorName || companyName}

# STYLE INSTRUCTIONS
- Use a professional, clean design suitable for institutional investors
- Color scheme should be corporate blue/navy with accent colors
- Include relevant stock images of healthcare facilities, seniors, and medical settings
- Charts should be clean and easy to read
- Make it look like a top-tier investment bank pitch deck`;
}

async function generateAndSendDeck(email: string, projectData: ProjectData, companyName: string) {
  console.log(`Starting deck generation for ${email}`);

  if (!GAMMA_API_KEY) {
    console.error('Gamma API key not configured');
    await sendErrorEmail(email, projectData, 'Service configuration error');
    return;
  }

  try {
    const inputText = buildInvestorDeckPrompt(projectData, companyName);

    // Start Gamma generation
    const generateResponse = await fetch(GAMMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': GAMMA_API_KEY,
      },
      body: JSON.stringify({
        inputText,
        textMode: 'generate',
        format: 'presentation',
        numCards: 10,
        exportAs: 'pptx',
        additionalInstructions: `This is a real estate investor pitch deck. Make it look extremely professional, suitable for presenting to institutional investors and high-net-worth individuals. Use a corporate color scheme. Include compelling data visualizations and charts. Add relevant images of healthcare facilities and senior care.`,
        imageOptions: {
          source: 'aiGenerated',
        },
        textOptions: {
          amount: 'medium',
          tone: 'professional, confident, data-driven',
          audience: 'institutional investors and high-net-worth individuals',
        },
        cardOptions: {
          dimensions: '16x9',
        },
      }),
    });

    if (!generateResponse.ok) {
      const errorText = await generateResponse.text();
      console.error('Gamma API error:', generateResponse.status, errorText);
      await sendErrorEmail(email, projectData, 'Failed to generate deck');
      return;
    }

    const { generationId } = await generateResponse.json();
    console.log(`Generation started: ${generationId}`);

    // Poll for completion
    let status = 'pending';
    let result = null;
    let attempts = 0;
    const maxAttempts = 90; // 3 minutes max

    while (status !== 'completed' && status !== 'failed' && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const statusResponse = await fetch(`${GAMMA_API_URL}/${generationId}`, {
        headers: {
          'X-API-KEY': GAMMA_API_KEY,
        },
      });

      if (statusResponse.ok) {
        result = await statusResponse.json();
        status = result.status;
        console.log(`Generation status: ${status} (attempt ${attempts + 1})`);
      }

      attempts++;
    }

    if (status !== 'completed' || !result) {
      console.error('Generation timed out or failed');
      await sendErrorEmail(email, projectData, 'Generation took too long');
      return;
    }

    // Send success email with download link
    await sendSuccessEmail(email, projectData, result.exportUrl);
    console.log(`Deck sent to ${email}`);

  } catch (error) {
    console.error('Generation error:', error);
    await sendErrorEmail(email, projectData, 'An unexpected error occurred');
  }
}

async function sendSuccessEmail(email: string, projectData: ProjectData, exportUrl: string) {
  if (!RESEND_API_KEY) {
    console.error('Resend API key not configured');
    return;
  }

  const projectName = projectData.projectName || 'Your Investment Opportunity';

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
        <p>Great news! Your professional investor deck has been created and is ready for download.</p>

        <div class="download-box">
          <p style="margin: 0 0 5px 0; color: #64748b; font-size: 14px;">Click below to download your deck</p>
          <a href="${exportUrl}" class="download-button">
            Download PowerPoint
          </a>
        </div>

        <div class="details">
          <h3>Project Summary</h3>
          <ul>
            <li><strong>Project:</strong> ${projectData.projectName || projectName}</li>
            <li><strong>Property:</strong> ${projectData.propertyAddress || 'See deck for details'}</li>
            <li><strong>Type:</strong> ${projectData.facilityType || 'Healthcare Development'}</li>
            <li><strong>Total Raise:</strong> ${projectData.totalRaise || 'See deck for details'}</li>
          </ul>
        </div>

        <div class="note">
          <strong>Note:</strong> This download link will expire in 24 hours. Please download your deck promptly.
        </div>
      </div>

      <div class="footer">
        <p>This deck was professionally generated for your investment presentation.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Investor Deck <noreply@resend.dev>',
      to: [email],
      subject: `Your Investor Deck: ${projectName}`,
      html,
    }),
  });
}

async function sendErrorEmail(email: string, projectData: ProjectData, errorMessage: string) {
  if (!RESEND_API_KEY) return;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; }
    .container { max-width: 500px; margin: 40px auto; padding: 30px; background: white; border-radius: 12px; }
    h1 { color: #dc2626; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Deck Generation Issue</h1>
    <p>We encountered an issue generating your investor deck for <strong>${projectData.projectName || 'your project'}</strong>.</p>
    <p><strong>Error:</strong> ${errorMessage}</p>
    <p>Please try again or contact support if the issue persists.</p>
  </div>
</body>
</html>
`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Investor Deck <noreply@resend.dev>',
      to: [email],
      subject: 'Issue with your Investor Deck',
      html,
    }),
  });
}

export async function POST(request: Request) {
  try {
    const { email, projectData, companyName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Queue background processing using Next.js after()
    after(() => {
      generateAndSendDeck(email, projectData || {}, companyName || '');
    });

    // Return immediately
    return NextResponse.json({
      queued: true,
      message: 'Your deck is being generated. Check your email in about 2 minutes.'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
