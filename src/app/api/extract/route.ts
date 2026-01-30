import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    // Build conversation text
    const conversationText = messages
      .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
      .join('\n\n');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `Extract all project data from this conversation into a structured JSON format. Only include fields that have actual values mentioned - don't guess or make up data.

CONVERSATION:
${conversationText}

Return ONLY valid JSON (no markdown, no explanation) with these fields (include only fields that have values):
{
  "projectName": "string - project or company name",
  "propertyAddress": "string - full address",
  "lotSize": "string - size with units",
  "zoning": "string - zoning classification",
  "zoningStatus": "string - entitled/pending/needs variance",
  "purchasePrice": "string - land price with $",
  "landOwnership": "string - owned/under contract",
  "facilityType": "string - SNF/ALF/RCFE",
  "bedCount": "string - number",
  "squareFootage": "string - sq ft",
  "constructionTimeline": "string - months/timeline",
  "totalProjectCost": "string - with $",
  "generalContractor": "string - contractor name",
  "marketLocation": "string - market/area name",
  "population65Plus": "string - population number",
  "population85Plus": "string - population number",
  "populationGrowth": "string - growth %",
  "competitorCount": "string - number",
  "marketOccupancy": "string - occupancy %",
  "averageDailyRate": "string - rate with $",
  "demandDrivers": "string - comma separated list",
  "totalRaise": "string - equity raise with $",
  "debtFinancing": "string - debt amount and terms",
  "projectedNOI": "string - NOI with $",
  "projectedIRR": "string - IRR %",
  "cashOnCash": "string - CoC %",
  "equityMultiple": "string - multiple like 2.1x",
  "goingInCapRate": "string - cap rate %",
  "exitCapRate": "string - exit cap %",
  "holdPeriod": "string - years",
  "sponsorName": "string - sponsor/company name",
  "sponsorExperience": "string - years/description",
  "priorDeals": "string - number of deals",
  "priorReturns": "string - average returns",
  "assetsUnderManagement": "string - AUM with $",
  "coInvestAmount": "string - GP co-invest amount or %",
  "operator": "string - operator name",
  "managementTeam": "string - team description",
  "minimumInvestment": "string - minimum with $",
  "preferredReturn": "string - pref return %",
  "waterfallStructure": "string - waterfall description",
  "managementFee": "string - fee %",
  "acquisitionFee": "string - fee %",
  "dispositionFee": "string - fee %",
  "distributionFrequency": "string - quarterly/monthly/etc",
  "exitStrategy": "string - exit plan"
}`,
        },
      ],
    });

    const textContent = response.content.find((block) => block.type === 'text');
    const text = textContent?.type === 'text' ? textContent.text : '{}';

    // Parse the JSON
    try {
      const data = JSON.parse(text.trim());
      return Response.json({ data });
    } catch {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return Response.json({ data });
      }
      return Response.json({ data: {} });
    }
  } catch (error) {
    console.error('Extract API error:', error);
    return Response.json({ data: {} });
  }
}
