import { NextResponse } from 'next/server';

const GAMMA_API_URL = 'https://public-api.gamma.app/v1.0/generations';
const GAMMA_API_KEY = process.env.GAMMA_API_KEY;

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

export async function POST(request: Request) {
  if (!GAMMA_API_KEY) {
    return NextResponse.json(
      { error: 'Gamma API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { projectData, companyName, email } = await request.json();

    // Build the prompt for Gamma
    const inputText = buildInvestorDeckPrompt(projectData, companyName);

    // Call Gamma Generate API
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
      const errorData = await generateResponse.text();
      console.error('Gamma API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to start generation', details: errorData },
        { status: generateResponse.status }
      );
    }

    const { generationId } = await generateResponse.json();

    // Poll for completion
    let status = 'pending';
    let result = null;
    let attempts = 0;
    const maxAttempts = 60; // 2 minutes max

    while (status !== 'completed' && status !== 'failed' && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds

      const statusResponse = await fetch(`${GAMMA_API_URL}/${generationId}`, {
        headers: {
          'X-API-KEY': GAMMA_API_KEY,
        },
      });

      if (statusResponse.ok) {
        result = await statusResponse.json();
        status = result.status;
      }

      attempts++;
    }

    if (status !== 'completed' || !result) {
      return NextResponse.json(
        { error: 'Generation timed out or failed', status },
        { status: 500 }
      );
    }

    // Send email if provided
    if (email && result.gammaUrl) {
      await sendEmailNotification(email, projectData, result.gammaUrl, result.exportUrl);
    }

    return NextResponse.json({
      success: true,
      gammaUrl: result.gammaUrl,
      exportUrl: result.exportUrl, // PPTX download URL if available
      credits: result.credits,
    });
  } catch (error) {
    console.error('Generate Gamma error:', error);
    return NextResponse.json(
      { error: 'Failed to generate deck' },
      { status: 500 }
    );
  }
}

async function sendEmailNotification(
  email: string,
  projectData: ProjectData,
  gammaUrl: string,
  exportUrl?: string
) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const downloadSection = exportUrl
    ? `<p><a href="${exportUrl}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Download PowerPoint</a></p>`
    : '';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #4F46E5; }
    .card { background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .button { background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 10px 5px 10px 0; }
    .button-secondary { background: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Your Investor Deck is Ready!</h1>

    <p>Great news! Your professional investor deck for <strong>${projectData.projectName || 'your project'}</strong> has been generated.</p>

    <div class="card">
      <h3>Quick Links</h3>
      <p>
        <a href="${gammaUrl}" class="button">View & Edit in Gamma</a>
        ${downloadSection}
      </p>
    </div>

    <div class="card">
      <h3>Project Summary</h3>
      <ul>
        <li><strong>Property:</strong> ${projectData.propertyAddress || 'TBD'}</li>
        <li><strong>Facility Type:</strong> ${projectData.facilityType || 'Healthcare'}</li>
        <li><strong>Total Raise:</strong> ${projectData.totalRaise || '$1.5M'}</li>
        <li><strong>Projected IRR:</strong> ${projectData.projectedIRR || '18%'}</li>
      </ul>
    </div>

    <p style="color: #64748b; font-size: 14px;">
      Note: The PowerPoint download link expires after a short time. Please download it promptly.
    </p>

    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

    <p style="color: #64748b; font-size: 12px;">
      Generated by Investor Deck Generator<br>
      This is an automated message.
    </p>
  </div>
</body>
</html>
`;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Investor Deck Generator <noreply@resend.dev>',
        to: [email],
        subject: `Your Investor Deck is Ready: ${projectData.projectName || 'Investment Opportunity'}`,
        html,
      }),
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
