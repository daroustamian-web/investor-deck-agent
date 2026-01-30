import { QuestionCategory, CategoryProgress } from './types';

export const CATEGORY_PROGRESS: CategoryProgress[] = [
  {
    category: 'site',
    label: 'Site & Property',
    description: 'Location, zoning, and property details',
    completed: false,
    current: true,
  },
  {
    category: 'development',
    label: 'Development Plan',
    description: 'Facility type, beds, construction',
    completed: false,
    current: false,
  },
  {
    category: 'market',
    label: 'Market Analysis',
    description: 'Demographics, competition, demand',
    completed: false,
    current: false,
  },
  {
    category: 'financials',
    label: 'Financials',
    description: 'Projections, returns, capital structure',
    completed: false,
    current: false,
  },
  {
    category: 'team',
    label: 'Team & Track Record',
    description: 'Sponsor experience and credentials',
    completed: false,
    current: false,
  },
  {
    category: 'terms',
    label: 'Deal Terms',
    description: 'Investment structure and returns',
    completed: false,
    current: false,
  },
];

export const SYSTEM_PROMPT = `You are an expert real estate investment analyst helping create investor pitch decks for healthcare real estate projects (SNF, ALF, RCFE).

## CRITICAL: You MUST output these markers

After EACH category is complete (user has answered all key questions for that section), you MUST include this marker on its own line:

[CATEGORY_COMPLETE: site]
[CATEGORY_COMPLETE: development]
[CATEGORY_COMPLETE: market]
[CATEGORY_COMPLETE: financials]
[CATEGORY_COMPLETE: team]
[CATEGORY_COMPLETE: terms]

When ALL 6 categories are done:
[ALL_COMPLETE]

These markers are REQUIRED for the app to track progress. Include them even if some details are missing - we can work with partial data.

## CRITICAL: Extract and confirm data

After the user answers, ALWAYS confirm what you captured in a structured format like:

"Got it! Here's what I captured:
- Property: [address]
- Lot Size: [size]
- Zoning: [classification]

[CATEGORY_COMPLETE: site]

Now let's move to the development plan..."

## Question Flow (ask 2-3 questions at a time)

### 1. SITE & PROPERTY
- Property address/location
- Lot size (acres or sq ft)
- Zoning and entitlement status
- Land ownership (owned/under contract) and price

### 2. DEVELOPMENT PLAN
- Facility type (SNF/ALF/RCFE)
- Number of beds
- Building square footage
- Construction timeline
- Total project cost
- General contractor

### 3. MARKET ANALYSIS
- Target market location/area
- 65+ population in area
- Number of competing facilities
- Market occupancy rate
- Average daily rate

### 4. FINANCIALS
- Total equity raise amount
- Projected stabilized NOI
- Projected IRR
- Equity multiple
- Cash-on-cash return
- Cap rates (going-in and exit)
- Hold period

### 5. TEAM & TRACK RECORD
- Sponsor/company name
- Years of experience
- Number of prior deals
- Prior deal returns
- Assets under management
- GP co-investment amount
- Operator name

### 6. DEAL TERMS
- Minimum investment
- Preferred return %
- Waterfall structure (LP/GP splits)
- Fees (acquisition, management, disposition)
- Distribution frequency
- Exit strategy

## Tone
Professional, efficient, encouraging. Move through questions quickly but thoroughly.`;

export const INITIAL_MESSAGE = `Welcome! I'll help you create a professional investor deck for your real estate project.

**Quick tip:** Upload your logo and set brand colors in the right panel before we start.

Let's begin with your property details:

• What is the **property address** or location?
• What is the **lot size** (acres or square feet)?
• What's the **zoning**, and is it entitled for healthcare use?
• Is the land **owned or under contract**, and at what price?`;

export function getCategoryFromMarker(content: string): QuestionCategory | null {
  const match = content.match(/\[CATEGORY_COMPLETE:\s*(\w+)\]/i);
  if (match) {
    const category = match[1].toLowerCase();
    if (['site', 'development', 'market', 'financials', 'team', 'terms'].includes(category)) {
      return category as QuestionCategory;
    }
  }
  return null;
}

export function isAllComplete(content: string): boolean {
  return content.includes('[ALL_COMPLETE]');
}

// Keywords to detect which category we're likely in based on content
export function detectCategoryFromContent(content: string): QuestionCategory | null {
  const lower = content.toLowerCase();

  if (lower.includes('deal terms') || lower.includes('minimum investment') || lower.includes('waterfall') || lower.includes('preferred return')) {
    return 'terms';
  }
  if (lower.includes('team') || lower.includes('track record') || lower.includes('sponsor') || lower.includes('experience')) {
    return 'team';
  }
  if (lower.includes('irr') || lower.includes('equity multiple') || lower.includes('cap rate') || lower.includes('noi') || lower.includes('raise')) {
    return 'financials';
  }
  if (lower.includes('market') || lower.includes('population') || lower.includes('competitor') || lower.includes('occupancy') || lower.includes('demographic')) {
    return 'market';
  }
  if (lower.includes('development') || lower.includes('construction') || lower.includes('beds') || lower.includes('facility type') || lower.includes('square feet') || lower.includes('snf') || lower.includes('alf')) {
    return 'development';
  }
  if (lower.includes('property') || lower.includes('address') || lower.includes('zoning') || lower.includes('lot size') || lower.includes('land')) {
    return 'site';
  }

  return null;
}
