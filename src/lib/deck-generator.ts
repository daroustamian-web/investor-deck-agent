import PptxGenJS from 'pptxgenjs';
import { BrandConfig, ProjectData } from './types';

interface DeckGeneratorOptions {
  brand: BrandConfig;
  projectData: Partial<ProjectData>;
}

function hexToRgb(hex: string): string {
  return hex.replace('#', '');
}

export async function generateInvestorDeck(options: DeckGeneratorOptions): Promise<Blob> {
  const { brand, projectData: data } = options;
  const pptx = new PptxGenJS();

  // Presentation setup
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = brand.companyName || 'Investor Deck Generator';
  pptx.title = data.projectName || 'Investment Opportunity';

  const colors = {
    primary: hexToRgb(brand.primaryColor),
    secondary: hexToRgb(brand.secondaryColor),
    accent: hexToRgb(brand.accentColor),
    dark: hexToRgb(brand.darkColor),
    light: hexToRgb(brand.lightColor),
    white: 'FFFFFF',
    text: '333333',
    textLight: '666666',
  };

  // Generate all slides
  createCoverSlide(pptx, colors, brand, data);
  createExecutiveSummarySlide(pptx, colors, brand, data);
  createOpportunitySlide(pptx, colors, brand, data);
  createMarketAnalysisSlide(pptx, colors, brand, data);
  createDevelopmentPlanSlide(pptx, colors, brand, data);
  createTeamSlide(pptx, colors, brand, data);
  createFinancialsSlide(pptx, colors, brand, data);
  createDealStructureSlide(pptx, colors, brand, data);
  createUseOfFundsSlide(pptx, colors, brand, data);
  createExitSlide(pptx, colors, brand, data);

  return (await pptx.write({ outputType: 'blob' })) as Blob;
}

// Helper to add logo with proper aspect ratio
function addLogo(slide: PptxGenJS.Slide, logo: string | null, x: number, y: number, maxW: number, maxH: number) {
  if (!logo) return;

  // Add logo maintaining aspect ratio by setting only width or height
  slide.addImage({
    data: logo,
    x,
    y,
    w: maxW,
    h: maxH,
    sizing: { type: 'contain', w: maxW, h: maxH },
  });
}

// Helper to add slide header
function addSlideHeader(
  slide: PptxGenJS.Slide,
  title: string,
  colors: Record<string, string>,
  brand: BrandConfig
) {
  // Header background
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.9,
    fill: { color: colors.primary },
  });

  // Accent line
  slide.addShape('rect', {
    x: 0,
    y: 0.9,
    w: '100%',
    h: 0.04,
    fill: { color: colors.secondary },
  });

  // Title text (positioned to not overlap with logo)
  slide.addText(title, {
    x: 0.5,
    y: 0.25,
    w: 9,
    h: 0.5,
    fontSize: 22,
    color: colors.white,
    fontFace: 'Arial',
    bold: true,
  });

  // Logo in header (right side)
  if (brand.logo) {
    addLogo(slide, brand.logo, 11.3, 0.15, 1.5, 0.6);
  }

  // Footer
  slide.addShape('rect', {
    x: 0,
    y: 7.1,
    w: '100%',
    h: 0.4,
    fill: { color: colors.dark },
  });

  // Slide number placeholder text
  slide.addText(brand.companyName || '', {
    x: 0.5,
    y: 7.18,
    w: 4,
    h: 0.25,
    fontSize: 9,
    color: 'AAAAAA',
    fontFace: 'Arial',
  });
}

function createCoverSlide(
  pptx: PptxGenJS,
  colors: Record<string, string>,
  brand: BrandConfig,
  data: Partial<ProjectData>
) {
  const slide = pptx.addSlide();

  // Background
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: '100%',
    h: '100%',
    fill: { color: colors.primary },
  });

  // Accent bar at bottom
  slide.addShape('rect', {
    x: 0,
    y: 6.8,
    w: '100%',
    h: 0.7,
    fill: { color: colors.secondary },
  });

  // Logo (centered, top)
  if (brand.logo) {
    addLogo(slide, brand.logo, 5.2, 0.8, 3, 1.2);
  }

  // Main title
  slide.addText(data.projectName || brand.companyName || 'Investment Opportunity', {
    x: 0.5,
    y: 2.5,
    w: 12.33,
    h: 1.2,
    fontSize: 42,
    color: colors.white,
    fontFace: 'Arial',
    bold: true,
    align: 'center',
  });

  // Subtitle
  slide.addText(`${data.totalRaise || '$1.5M'} Equity Investment Opportunity`, {
    x: 0.5,
    y: 3.8,
    w: 12.33,
    h: 0.6,
    fontSize: 22,
    color: colors.secondary,
    fontFace: 'Arial',
    align: 'center',
  });

  // Location
  slide.addText(data.propertyAddress || data.marketLocation || 'Southern California', {
    x: 0.5,
    y: 4.6,
    w: 12.33,
    h: 0.5,
    fontSize: 16,
    color: 'B0D4F1',
    fontFace: 'Arial',
    align: 'center',
  });

  // Facility type badge
  if (data.facilityType || data.bedCount) {
    slide.addText(`${data.facilityType || 'Healthcare'} | ${data.bedCount || '—'} Beds`, {
      x: 4.5,
      y: 5.3,
      w: 4.33,
      h: 0.4,
      fontSize: 12,
      color: colors.white,
      fontFace: 'Arial',
      align: 'center',
      fill: { color: colors.secondary },
    });
  }

  // Date
  const today = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  slide.addText(today, {
    x: 0.5,
    y: 5.9,
    w: 12.33,
    h: 0.4,
    fontSize: 12,
    color: '80B0D4',
    fontFace: 'Arial',
    align: 'center',
  });

  // Confidential
  slide.addText('CONFIDENTIAL', {
    x: 0.5,
    y: 6.9,
    w: 12.33,
    h: 0.3,
    fontSize: 10,
    color: colors.white,
    fontFace: 'Arial',
    align: 'center',
  });
}

function createExecutiveSummarySlide(
  pptx: PptxGenJS,
  colors: Record<string, string>,
  brand: BrandConfig,
  data: Partial<ProjectData>
) {
  const slide = pptx.addSlide();
  slide.background = { color: colors.light };

  addSlideHeader(slide, 'Executive Summary', colors, brand);

  // Investment highlights box
  slide.addShape('roundRect', {
    x: 0.5,
    y: 1.2,
    w: 6,
    h: 4.2,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.1 },
  });

  slide.addText('Investment Highlights', {
    x: 0.7,
    y: 1.35,
    w: 5.6,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const highlights = [
    `${data.facilityType || 'Healthcare'} Development`,
    `${data.bedCount || '—'} Licensed Beds`,
    `${data.propertyAddress || data.marketLocation || 'Prime Location'}`,
    `${data.constructionTimeline || '18-24 month'} development timeline`,
    `Projected ${data.projectedIRR || '—'} IRR`,
    `${data.preferredReturn || '8%'} Preferred Return`,
  ];

  highlights.forEach((text, i) => {
    slide.addText(`• ${text}`, {
      x: 0.9,
      y: 1.85 + i * 0.5,
      w: 5.4,
      h: 0.45,
      fontSize: 12,
      color: colors.text,
      fontFace: 'Arial',
    });
  });

  // Key metrics box
  slide.addShape('roundRect', {
    x: 6.8,
    y: 1.2,
    w: 6,
    h: 4.2,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.1 },
  });

  slide.addText('Key Metrics', {
    x: 7.0,
    y: 1.35,
    w: 5.6,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const metrics = [
    { label: 'Total Raise', value: data.totalRaise || '—' },
    { label: 'Total Project Cost', value: data.totalProjectCost || '—' },
    { label: 'Projected IRR', value: data.projectedIRR || '—' },
    { label: 'Equity Multiple', value: data.equityMultiple || '—' },
    { label: 'Cash-on-Cash', value: data.cashOnCash || '—' },
    { label: 'Hold Period', value: data.holdPeriod || '5-7 years' },
  ];

  metrics.forEach((m, i) => {
    slide.addText(m.label, {
      x: 7.2,
      y: 1.85 + i * 0.5,
      w: 2.5,
      h: 0.4,
      fontSize: 11,
      color: colors.textLight,
      fontFace: 'Arial',
    });
    slide.addText(m.value, {
      x: 10.0,
      y: 1.85 + i * 0.5,
      w: 2.5,
      h: 0.4,
      fontSize: 11,
      color: colors.primary,
      fontFace: 'Arial',
      bold: true,
      align: 'right',
    });
  });

  // Investment thesis
  slide.addText('Investment Thesis', {
    x: 0.5,
    y: 5.6,
    w: 12.33,
    h: 0.35,
    fontSize: 13,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(
    `Strategic ${data.facilityType || 'healthcare'} development in ${data.marketLocation || data.propertyAddress || 'Southern California'} addressing growing demand for skilled nursing beds. Experienced sponsor with ${data.sponsorExperience || 'proven track record'} seeking ${data.totalRaise || '$1.5M'} in LP equity.`,
    {
      x: 0.5,
      y: 5.95,
      w: 12.33,
      h: 0.8,
      fontSize: 11,
      color: colors.text,
      fontFace: 'Arial',
    }
  );
}

function createOpportunitySlide(
  pptx: PptxGenJS,
  colors: Record<string, string>,
  brand: BrandConfig,
  data: Partial<ProjectData>
) {
  const slide = pptx.addSlide();
  slide.background = { color: colors.light };

  addSlideHeader(slide, 'The Opportunity', colors, brand);

  // Property details
  slide.addShape('roundRect', {
    x: 0.5,
    y: 1.2,
    w: 6,
    h: 2.8,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.08 },
  });

  slide.addText('Property Details', {
    x: 0.7,
    y: 1.35,
    w: 5.6,
    h: 0.3,
    fontSize: 13,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const propDetails = [
    ['Address', data.propertyAddress || '—'],
    ['Lot Size', data.lotSize || '—'],
    ['Zoning', data.zoning || '—'],
    ['Status', data.zoningStatus || '—'],
    ['Land Basis', data.purchasePrice || data.landOwnership || '—'],
  ];

  propDetails.forEach(([label, value], i) => {
    slide.addText(`${label}:`, {
      x: 0.9,
      y: 1.75 + i * 0.38,
      w: 1.6,
      h: 0.35,
      fontSize: 10,
      color: colors.textLight,
      fontFace: 'Arial',
    });
    slide.addText(value, {
      x: 2.6,
      y: 1.75 + i * 0.38,
      w: 3.7,
      h: 0.35,
      fontSize: 10,
      color: colors.text,
      fontFace: 'Arial',
      bold: true,
    });
  });

  // Development overview
  slide.addShape('roundRect', {
    x: 6.8,
    y: 1.2,
    w: 6,
    h: 2.8,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.08 },
  });

  slide.addText('Development Overview', {
    x: 7.0,
    y: 1.35,
    w: 5.6,
    h: 0.3,
    fontSize: 13,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const devDetails = [
    ['Facility Type', data.facilityType || 'Skilled Nursing'],
    ['Licensed Beds', data.bedCount || '—'],
    ['Square Footage', data.squareFootage || '—'],
    ['Timeline', data.constructionTimeline || '—'],
    ['Total Cost', data.totalProjectCost || '—'],
  ];

  devDetails.forEach(([label, value], i) => {
    slide.addText(`${label}:`, {
      x: 7.2,
      y: 1.75 + i * 0.38,
      w: 1.8,
      h: 0.35,
      fontSize: 10,
      color: colors.textLight,
      fontFace: 'Arial',
    });
    slide.addText(value, {
      x: 9.1,
      y: 1.75 + i * 0.38,
      w: 3.5,
      h: 0.35,
      fontSize: 10,
      color: colors.text,
      fontFace: 'Arial',
      bold: true,
    });
  });

  // Why this opportunity
  slide.addShape('roundRect', {
    x: 0.5,
    y: 4.2,
    w: 12.33,
    h: 2.6,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.08 },
  });

  slide.addText('Why This Opportunity', {
    x: 0.7,
    y: 4.35,
    w: 12,
    h: 0.3,
    fontSize: 13,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const reasons = [
    'Aging population driving unprecedented demand for skilled nursing beds',
    'Limited new supply due to regulatory requirements and development complexity',
    `Prime location in ${data.marketLocation || 'high-demand market'} with strong referral network`,
    `Experienced sponsor with ${data.priorDeals || 'multiple'} completed healthcare deals`,
  ];

  reasons.forEach((r, i) => {
    slide.addText(`✓ ${r}`, {
      x: 0.9,
      y: 4.75 + i * 0.42,
      w: 11.7,
      h: 0.4,
      fontSize: 11,
      color: colors.text,
      fontFace: 'Arial',
    });
  });
}

function createMarketAnalysisSlide(
  pptx: PptxGenJS,
  colors: Record<string, string>,
  brand: BrandConfig,
  data: Partial<ProjectData>
) {
  const slide = pptx.addSlide();
  slide.background = { color: colors.light };

  addSlideHeader(slide, 'Market Analysis', colors, brand);

  // Demographics box
  slide.addShape('roundRect', {
    x: 0.5,
    y: 1.2,
    w: 4,
    h: 2.8,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.08 },
  });

  slide.addText('Demographics', {
    x: 0.7,
    y: 1.35,
    w: 3.6,
    h: 0.3,
    fontSize: 13,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(data.population65Plus || '125,000+', {
    x: 0.7,
    y: 1.8,
    w: 3.6,
    h: 0.5,
    fontSize: 28,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });
  slide.addText('Population 65+ (10-mi radius)', {
    x: 0.7,
    y: 2.3,
    w: 3.6,
    h: 0.25,
    fontSize: 9,
    color: colors.textLight,
    fontFace: 'Arial',
  });

  slide.addText(data.populationGrowth || '+15%', {
    x: 0.7,
    y: 2.8,
    w: 3.6,
    h: 0.5,
    fontSize: 28,
    color: colors.accent,
    fontFace: 'Arial',
    bold: true,
  });
  slide.addText('Projected 10-Year Growth', {
    x: 0.7,
    y: 3.3,
    w: 3.6,
    h: 0.25,
    fontSize: 9,
    color: colors.textLight,
    fontFace: 'Arial',
  });

  // Competition box
  slide.addShape('roundRect', {
    x: 4.7,
    y: 1.2,
    w: 4,
    h: 2.8,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.08 },
  });

  slide.addText('Competitive Landscape', {
    x: 4.9,
    y: 1.35,
    w: 3.6,
    h: 0.3,
    fontSize: 13,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(data.competitorCount || '6', {
    x: 4.9,
    y: 1.8,
    w: 3.6,
    h: 0.5,
    fontSize: 28,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });
  slide.addText('Competing Facilities', {
    x: 4.9,
    y: 2.3,
    w: 3.6,
    h: 0.25,
    fontSize: 9,
    color: colors.textLight,
    fontFace: 'Arial',
  });

  slide.addText(data.marketOccupancy || '92%', {
    x: 4.9,
    y: 2.8,
    w: 3.6,
    h: 0.5,
    fontSize: 28,
    color: colors.secondary,
    fontFace: 'Arial',
    bold: true,
  });
  slide.addText('Market Occupancy Rate', {
    x: 4.9,
    y: 3.3,
    w: 3.6,
    h: 0.25,
    fontSize: 9,
    color: colors.textLight,
    fontFace: 'Arial',
  });

  // Rates box
  slide.addShape('roundRect', {
    x: 8.9,
    y: 1.2,
    w: 4,
    h: 2.8,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.08 },
  });

  slide.addText('Market Rates', {
    x: 9.1,
    y: 1.35,
    w: 3.6,
    h: 0.3,
    fontSize: 13,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(data.averageDailyRate || '$325', {
    x: 9.1,
    y: 1.8,
    w: 3.6,
    h: 0.5,
    fontSize: 28,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });
  slide.addText('Average Daily Rate', {
    x: 9.1,
    y: 2.3,
    w: 3.6,
    h: 0.25,
    fontSize: 9,
    color: colors.textLight,
    fontFace: 'Arial',
  });

  // Demand drivers
  slide.addShape('roundRect', {
    x: 0.5,
    y: 4.2,
    w: 12.33,
    h: 2.6,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.08 },
  });

  slide.addText('Key Demand Drivers', {
    x: 0.7,
    y: 4.35,
    w: 12,
    h: 0.3,
    fontSize: 13,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const drivers = (data.demandDrivers || 'Hospital discharge partnerships, Aging population trends, Limited new supply, Increasing acuity levels').split(',');
  drivers.slice(0, 4).forEach((d, i) => {
    slide.addText(`• ${d.trim()}`, {
      x: 0.9 + (i % 2) * 6.1,
      y: 4.8 + Math.floor(i / 2) * 0.5,
      w: 5.9,
      h: 0.45,
      fontSize: 11,
      color: colors.text,
      fontFace: 'Arial',
    });
  });
}

function createDevelopmentPlanSlide(
  pptx: PptxGenJS,
  colors: Record<string, string>,
  brand: BrandConfig,
  data: Partial<ProjectData>
) {
  const slide = pptx.addSlide();
  slide.background = { color: colors.light };

  addSlideHeader(slide, 'Development Plan', colors, brand);

  // Timeline
  const phases = [
    { name: 'Pre-Development', dur: '0-3 mo', desc: 'Permits & Financing' },
    { name: 'Construction', dur: '3-18 mo', desc: 'Ground-up Build' },
    { name: 'Licensing', dur: '18-21 mo', desc: 'State Certification' },
    { name: 'Stabilization', dur: '21-30 mo', desc: 'Lease-up Period' },
  ];

  // Timeline bar
  slide.addShape('rect', {
    x: 0.5,
    y: 1.6,
    w: 12.33,
    h: 0.08,
    fill: { color: 'DDDDDD' },
  });

  phases.forEach((p, i) => {
    const x = 0.5 + i * 3.08;

    // Dot
    slide.addShape('ellipse', {
      x: x + 1.35,
      y: 1.5,
      w: 0.25,
      h: 0.25,
      fill: { color: colors.primary },
    });

    // Phase card
    slide.addShape('roundRect', {
      x,
      y: 1.95,
      w: 2.9,
      h: 1.4,
      fill: { color: colors.white },
      shadow: { type: 'outer', blur: 3, offset: 1, angle: 45, opacity: 0.06 },
    });

    slide.addText(p.name, {
      x,
      y: 2.05,
      w: 2.9,
      h: 0.3,
      fontSize: 11,
      color: colors.primary,
      fontFace: 'Arial',
      bold: true,
      align: 'center',
    });
    slide.addText(p.dur, {
      x,
      y: 2.35,
      w: 2.9,
      h: 0.25,
      fontSize: 9,
      color: colors.secondary,
      fontFace: 'Arial',
      align: 'center',
    });
    slide.addText(p.desc, {
      x,
      y: 2.65,
      w: 2.9,
      h: 0.5,
      fontSize: 9,
      color: colors.textLight,
      fontFace: 'Arial',
      align: 'center',
    });
  });

  // Specs box
  slide.addShape('roundRect', {
    x: 0.5,
    y: 3.6,
    w: 6,
    h: 3.2,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.08 },
  });

  slide.addText('Facility Specifications', {
    x: 0.7,
    y: 3.75,
    w: 5.6,
    h: 0.3,
    fontSize: 13,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const specs = [
    ['Facility Type', data.facilityType || 'Skilled Nursing'],
    ['Licensed Beds', data.bedCount || '—'],
    ['Building Size', data.squareFootage || '—'],
    ['Contractor', data.generalContractor || 'TBD'],
    ['Timeline', data.constructionTimeline || '18 months'],
  ];

  specs.forEach(([label, value], i) => {
    slide.addText(`${label}:`, {
      x: 0.9,
      y: 4.2 + i * 0.45,
      w: 2,
      h: 0.4,
      fontSize: 11,
      color: colors.textLight,
      fontFace: 'Arial',
    });
    slide.addText(value, {
      x: 3,
      y: 4.2 + i * 0.45,
      w: 3.3,
      h: 0.4,
      fontSize: 11,
      color: colors.text,
      fontFace: 'Arial',
      bold: true,
    });
  });

  // Budget box
  slide.addShape('roundRect', {
    x: 6.8,
    y: 3.6,
    w: 6,
    h: 3.2,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.08 },
  });

  slide.addText('Development Budget', {
    x: 7.0,
    y: 3.75,
    w: 5.6,
    h: 0.3,
    fontSize: 13,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(data.totalProjectCost || '$8.5M', {
    x: 7.0,
    y: 4.3,
    w: 5.6,
    h: 0.6,
    fontSize: 32,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
    align: 'center',
  });

  slide.addText('Total Project Cost', {
    x: 7.0,
    y: 4.9,
    w: 5.6,
    h: 0.3,
    fontSize: 11,
    color: colors.textLight,
    fontFace: 'Arial',
    align: 'center',
  });
}

function createTeamSlide(
  pptx: PptxGenJS,
  colors: Record<string, string>,
  brand: BrandConfig,
  data: Partial<ProjectData>
) {
  const slide = pptx.addSlide();
  slide.background = { color: colors.light };

  addSlideHeader(slide, 'Team & Track Record', colors, brand);

  // Sponsor box
  slide.addShape('roundRect', {
    x: 0.5,
    y: 1.2,
    w: 6,
    h: 3.8,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.08 },
  });

  slide.addText('Sponsor Profile', {
    x: 0.7,
    y: 1.35,
    w: 5.6,
    h: 0.3,
    fontSize: 13,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(data.sponsorName || 'Principal Sponsor', {
    x: 0.7,
    y: 1.75,
    w: 5.6,
    h: 0.4,
    fontSize: 16,
    color: colors.text,
    fontFace: 'Arial',
    bold: true,
  });

  const sponsorDetails = [
    data.sponsorExperience || '15+ years in healthcare RE',
    `${data.priorDeals || '10+'} deals completed`,
    `${data.assetsUnderManagement || '$50M+'} AUM`,
    `${data.priorReturns || '18%+'} average investor IRR`,
    `${data.coInvestAmount || '5%'} GP co-invest`,
  ];

  sponsorDetails.forEach((d, i) => {
    slide.addText(`• ${d}`, {
      x: 0.9,
      y: 2.25 + i * 0.42,
      w: 5.4,
      h: 0.4,
      fontSize: 11,
      color: colors.text,
      fontFace: 'Arial',
    });
  });

  // Track record box
  slide.addShape('roundRect', {
    x: 6.8,
    y: 1.2,
    w: 6,
    h: 2.0,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.08 },
  });

  slide.addText('Track Record', {
    x: 7.0,
    y: 1.35,
    w: 5.6,
    h: 0.3,
    fontSize: 13,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const trackMetrics = [
    { val: data.priorDeals || '10+', label: 'Deals' },
    { val: data.assetsUnderManagement || '$50M', label: 'AUM' },
    { val: data.priorReturns || '18%', label: 'Avg IRR' },
  ];

  trackMetrics.forEach((m, i) => {
    slide.addText(m.val, {
      x: 7.2 + i * 1.9,
      y: 1.8,
      w: 1.7,
      h: 0.45,
      fontSize: 20,
      color: colors.primary,
      fontFace: 'Arial',
      bold: true,
      align: 'center',
    });
    slide.addText(m.label, {
      x: 7.2 + i * 1.9,
      y: 2.25,
      w: 1.7,
      h: 0.3,
      fontSize: 9,
      color: colors.textLight,
      fontFace: 'Arial',
      align: 'center',
    });
  });

  // Operator box
  slide.addShape('roundRect', {
    x: 6.8,
    y: 3.4,
    w: 6,
    h: 1.6,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.08 },
  });

  slide.addText('Operations', {
    x: 7.0,
    y: 3.55,
    w: 5.6,
    h: 0.3,
    fontSize: 13,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(`Operator: ${data.operator || 'Experienced third-party operator'}`, {
    x: 7.2,
    y: 4.0,
    w: 5.4,
    h: 0.35,
    fontSize: 11,
    color: colors.text,
    fontFace: 'Arial',
  });

  // Alignment banner
  slide.addShape('roundRect', {
    x: 0.5,
    y: 5.2,
    w: 12.33,
    h: 1.5,
    fill: { color: colors.primary },
  });

  slide.addText('Investor Alignment', {
    x: 0.7,
    y: 5.35,
    w: 12,
    h: 0.3,
    fontSize: 13,
    color: colors.white,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(
    `GP is co-investing ${data.coInvestAmount || '5%'} of equity alongside LPs, ensuring aligned interests throughout the project.`,
    {
      x: 0.7,
      y: 5.75,
      w: 12,
      h: 0.6,
      fontSize: 11,
      color: 'B0D4F1',
      fontFace: 'Arial',
    }
  );
}

function createFinancialsSlide(
  pptx: PptxGenJS,
  colors: Record<string, string>,
  brand: BrandConfig,
  data: Partial<ProjectData>
) {
  const slide = pptx.addSlide();
  slide.background = { color: colors.light };

  addSlideHeader(slide, 'Financial Projections', colors, brand);

  // Return metrics
  const returnMetrics = [
    { val: data.projectedIRR || '18%', label: 'Projected IRR' },
    { val: data.equityMultiple || '2.1x', label: 'Equity Multiple' },
    { val: data.cashOnCash || '10-12%', label: 'Cash-on-Cash' },
    { val: data.holdPeriod || '5-7 yrs', label: 'Hold Period' },
  ];

  returnMetrics.forEach((m, i) => {
    slide.addShape('roundRect', {
      x: 0.5 + i * 3.15,
      y: 1.2,
      w: 2.95,
      h: 1.3,
      fill: { color: colors.white },
      shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.08 },
    });

    slide.addText(m.val, {
      x: 0.5 + i * 3.15,
      y: 1.35,
      w: 2.95,
      h: 0.55,
      fontSize: 24,
      color: colors.primary,
      fontFace: 'Arial',
      bold: true,
      align: 'center',
    });

    slide.addText(m.label, {
      x: 0.5 + i * 3.15,
      y: 1.95,
      w: 2.95,
      h: 0.35,
      fontSize: 10,
      color: colors.textLight,
      fontFace: 'Arial',
      align: 'center',
    });
  });

  // Chart
  const chartData = [
    {
      name: 'NOI ($K)',
      labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
      values: [200, 450, 650, 750, 800],
    },
  ];

  slide.addChart('bar', chartData, {
    x: 0.5,
    y: 2.7,
    w: 6,
    h: 3.8,
    barDir: 'col',
    chartColors: [colors.primary],
    showTitle: true,
    title: 'Projected NOI Growth',
    titleColor: colors.text,
    titleFontSize: 11,
    titleBold: true,
    showLegend: false,
    showValue: true,
    dataLabelColor: colors.text,
    dataLabelFontSize: 9,
    dataLabelPosition: 'outEnd',
    valAxisLabelColor: colors.textLight,
    catAxisLabelColor: colors.textLight,
    valGridLine: { style: 'dash', color: 'E0E0E0' },
  });

  // Valuation box
  slide.addShape('roundRect', {
    x: 6.8,
    y: 2.7,
    w: 6,
    h: 3.8,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.08 },
  });

  slide.addText('Valuation Analysis', {
    x: 7.0,
    y: 2.85,
    w: 5.6,
    h: 0.3,
    fontSize: 13,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const valItems = [
    ['Going-In Cap', data.goingInCapRate || '—'],
    ['Exit Cap', data.exitCapRate || '—'],
    ['Stabilized NOI', data.projectedNOI || '—'],
    ['Total Raise', data.totalRaise || '—'],
    ['Debt', data.debtFinancing || '—'],
  ];

  valItems.forEach(([label, value], i) => {
    slide.addText(label, {
      x: 7.2,
      y: 3.3 + i * 0.5,
      w: 2.5,
      h: 0.4,
      fontSize: 11,
      color: colors.textLight,
      fontFace: 'Arial',
    });
    slide.addText(value, {
      x: 10.0,
      y: 3.3 + i * 0.5,
      w: 2.5,
      h: 0.4,
      fontSize: 11,
      color: colors.text,
      fontFace: 'Arial',
      bold: true,
      align: 'right',
    });
  });
}

function createDealStructureSlide(
  pptx: PptxGenJS,
  colors: Record<string, string>,
  brand: BrandConfig,
  data: Partial<ProjectData>
) {
  const slide = pptx.addSlide();
  slide.background = { color: colors.light };

  addSlideHeader(slide, 'Deal Structure', colors, brand);

  // Investment terms
  slide.addShape('roundRect', {
    x: 0.5,
    y: 1.2,
    w: 6,
    h: 5.5,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.08 },
  });

  slide.addText('Investment Terms', {
    x: 0.7,
    y: 1.35,
    w: 5.6,
    h: 0.3,
    fontSize: 13,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const terms = [
    ['Total Raise', data.totalRaise || '$1.5M'],
    ['Minimum Investment', data.minimumInvestment || '$50,000'],
    ['Preferred Return', data.preferredReturn || '8%'],
    ['Distributions', data.distributionFrequency || 'Quarterly'],
    ['Hold Period', data.holdPeriod || '5-7 years'],
    ['GP Co-Invest', data.coInvestAmount || '5%'],
  ];

  terms.forEach(([label, value], i) => {
    slide.addText(label, {
      x: 0.9,
      y: 1.8 + i * 0.5,
      w: 2.8,
      h: 0.4,
      fontSize: 11,
      color: colors.textLight,
      fontFace: 'Arial',
    });
    slide.addText(value, {
      x: 3.8,
      y: 1.8 + i * 0.5,
      w: 2.5,
      h: 0.4,
      fontSize: 11,
      color: colors.text,
      fontFace: 'Arial',
      bold: true,
      align: 'right',
    });
  });

  // Fees
  slide.addText('Fee Structure', {
    x: 0.7,
    y: 4.9,
    w: 5.6,
    h: 0.3,
    fontSize: 12,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const fees = [
    ['Acquisition Fee', data.acquisitionFee || '1.0%'],
    ['Asset Mgmt', data.managementFee || '1.5%'],
    ['Disposition', data.dispositionFee || '1.0%'],
  ];

  fees.forEach(([label, value], i) => {
    slide.addText(`${label}: ${value}`, {
      x: 0.9 + i * 2,
      y: 5.3,
      w: 1.9,
      h: 0.3,
      fontSize: 9,
      color: colors.textLight,
      fontFace: 'Arial',
    });
  });

  // Waterfall box
  slide.addShape('roundRect', {
    x: 6.8,
    y: 1.2,
    w: 6,
    h: 5.5,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.08 },
  });

  slide.addText('Waterfall Structure', {
    x: 7.0,
    y: 1.35,
    w: 5.6,
    h: 0.3,
    fontSize: 13,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  // Waterfall table - FIXED positioning
  const waterfallData = [
    ['Tier', 'Threshold', 'LP', 'GP'],
    ['1', 'Return of Capital', '100%', '0%'],
    ['2', `Pref (${data.preferredReturn || '8%'})`, '100%', '0%'],
    ['3', 'Up to 12% IRR', '80%', '20%'],
    ['4', 'Above 12% IRR', '70%', '30%'],
  ];

  waterfallData.forEach((row, rowIdx) => {
    const isHeader = rowIdx === 0;
    row.forEach((cell, colIdx) => {
      const colWidths = [0.6, 2.2, 0.8, 0.8];
      const colX = [7.1, 7.7, 10.0, 10.9];

      slide.addText(cell, {
        x: colX[colIdx],
        y: 1.8 + rowIdx * 0.55,
        w: colWidths[colIdx],
        h: 0.45,
        fontSize: isHeader ? 9 : 10,
        color: isHeader ? colors.textLight : (colIdx === 2 ? colors.secondary : colors.text),
        fontFace: 'Arial',
        bold: isHeader || colIdx === 0 || colIdx === 2,
        align: colIdx > 1 ? 'center' : 'left',
      });
    });
  });

  // Waterfall description
  if (data.waterfallStructure) {
    slide.addText(data.waterfallStructure, {
      x: 7.0,
      y: 5.0,
      w: 5.6,
      h: 1.2,
      fontSize: 9,
      color: colors.textLight,
      fontFace: 'Arial',
      italic: true,
    });
  }
}

function createUseOfFundsSlide(
  pptx: PptxGenJS,
  colors: Record<string, string>,
  brand: BrandConfig,
  data: Partial<ProjectData>
) {
  const slide = pptx.addSlide();
  slide.background = { color: colors.light };

  addSlideHeader(slide, 'Use of Funds', colors, brand);

  // Capital stack chart
  const capitalData = [
    { name: 'Capital Stack', labels: ['LP Equity', 'GP Equity', 'Debt'], values: [60, 10, 30] },
  ];

  slide.addChart('doughnut', capitalData, {
    x: 0.5,
    y: 1.2,
    w: 5.5,
    h: 4,
    chartColors: [colors.primary, colors.secondary, colors.accent],
    showTitle: true,
    title: 'Capital Stack',
    titleColor: colors.text,
    titleFontSize: 12,
    titleBold: true,
    showLegend: true,
    legendPos: 'b',
    legendColor: colors.textLight,
    showPercent: true,
    holeSize: 50,
  });

  // Use of proceeds
  slide.addShape('roundRect', {
    x: 6.3,
    y: 1.2,
    w: 6.5,
    h: 5.5,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.08 },
  });

  slide.addText('Use of Proceeds', {
    x: 6.5,
    y: 1.35,
    w: 6.1,
    h: 0.3,
    fontSize: 13,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(`Total: ${data.totalProjectCost || '$8.5M'}`, {
    x: 6.5,
    y: 1.7,
    w: 6.1,
    h: 0.35,
    fontSize: 14,
    color: colors.text,
    fontFace: 'Arial',
    bold: true,
  });

  const uses = [
    { cat: 'Land Acquisition', amt: data.purchasePrice || '$1.2M', pct: '14%' },
    { cat: 'Hard Costs', amt: '$5.5M', pct: '65%' },
    { cat: 'Soft Costs', amt: '$800K', pct: '9%' },
    { cat: 'Financing Costs', amt: '$400K', pct: '5%' },
    { cat: 'Operating Reserve', amt: '$350K', pct: '4%' },
    { cat: 'Developer Fee', amt: '$250K', pct: '3%' },
  ];

  uses.forEach((u, i) => {
    const y = 2.2 + i * 0.6;
    const barWidth = parseFloat(u.pct) / 100 * 4;

    slide.addShape('rect', {
      x: 6.7,
      y: y + 0.25,
      w: barWidth,
      h: 0.2,
      fill: { color: colors.primary },
    });

    slide.addText(u.cat, {
      x: 6.7,
      y,
      w: 2.5,
      h: 0.25,
      fontSize: 9,
      color: colors.text,
      fontFace: 'Arial',
    });
    slide.addText(u.amt, {
      x: 10.2,
      y,
      w: 1.2,
      h: 0.25,
      fontSize: 9,
      color: colors.text,
      fontFace: 'Arial',
      bold: true,
      align: 'right',
    });
    slide.addText(u.pct, {
      x: 11.5,
      y,
      w: 0.8,
      h: 0.25,
      fontSize: 9,
      color: colors.textLight,
      fontFace: 'Arial',
      align: 'right',
    });
  });

  // Equity breakdown
  slide.addText('Equity Breakdown', {
    x: 6.5,
    y: 5.9,
    w: 6.1,
    h: 0.3,
    fontSize: 11,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(`LP: ${data.totalRaise || '$1.5M'} | GP Co-Invest: ${data.coInvestAmount || '5%'}`, {
    x: 6.5,
    y: 6.2,
    w: 6.1,
    h: 0.3,
    fontSize: 10,
    color: colors.textLight,
    fontFace: 'Arial',
  });
}

function createExitSlide(
  pptx: PptxGenJS,
  colors: Record<string, string>,
  brand: BrandConfig,
  data: Partial<ProjectData>
) {
  const slide = pptx.addSlide();
  slide.background = { color: colors.light };

  addSlideHeader(slide, 'Exit Strategy & Next Steps', colors, brand);

  // Exit scenarios
  slide.addShape('roundRect', {
    x: 0.5,
    y: 1.2,
    w: 8,
    h: 3,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.08 },
  });

  slide.addText('Exit Scenarios', {
    x: 0.7,
    y: 1.35,
    w: 7.6,
    h: 0.3,
    fontSize: 13,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const scenarios = [
    { name: 'Sale to Institution', desc: 'REIT or PE acquisition', time: 'Yr 5-7' },
    { name: 'Refinance & Hold', desc: 'Cash-out refi, continue ops', time: 'Yr 4-5' },
    { name: 'Portfolio Sale', desc: 'Part of larger transaction', time: 'Yr 6-8' },
  ];

  scenarios.forEach((s, i) => {
    const y = 1.8 + i * 0.7;
    slide.addText(s.name, {
      x: 0.9,
      y,
      w: 3,
      h: 0.3,
      fontSize: 11,
      color: colors.text,
      fontFace: 'Arial',
      bold: true,
    });
    slide.addText(s.time, {
      x: 4,
      y,
      w: 1,
      h: 0.3,
      fontSize: 10,
      color: colors.secondary,
      fontFace: 'Arial',
      bold: true,
    });
    slide.addText(s.desc, {
      x: 0.9,
      y: y + 0.3,
      w: 7,
      h: 0.3,
      fontSize: 9,
      color: colors.textLight,
      fontFace: 'Arial',
    });
  });

  // Timeline box
  slide.addShape('roundRect', {
    x: 8.8,
    y: 1.2,
    w: 4,
    h: 3,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.08 },
  });

  slide.addText('Target Timeline', {
    x: 9.0,
    y: 1.35,
    w: 3.6,
    h: 0.3,
    fontSize: 13,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(data.holdPeriod || '5-7 Years', {
    x: 9.0,
    y: 1.8,
    w: 3.6,
    h: 0.5,
    fontSize: 22,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
    align: 'center',
  });

  slide.addText('Hold Period', {
    x: 9.0,
    y: 2.3,
    w: 3.6,
    h: 0.25,
    fontSize: 10,
    color: colors.textLight,
    fontFace: 'Arial',
    align: 'center',
  });

  slide.addText(data.exitStrategy || 'Sale at stabilization', {
    x: 9.0,
    y: 2.7,
    w: 3.6,
    h: 0.8,
    fontSize: 10,
    color: colors.text,
    fontFace: 'Arial',
    align: 'center',
  });

  // CTA banner
  slide.addShape('roundRect', {
    x: 0.5,
    y: 4.4,
    w: 12.33,
    h: 2.3,
    fill: { color: colors.primary },
  });

  slide.addText('Next Steps', {
    x: 0.7,
    y: 4.6,
    w: 12,
    h: 0.35,
    fontSize: 16,
    color: colors.white,
    fontFace: 'Arial',
    bold: true,
  });

  const steps = [
    '1. Schedule a call to discuss the opportunity',
    '2. Review the Private Placement Memorandum',
    '3. Complete subscription documents',
  ];

  steps.forEach((s, i) => {
    slide.addText(s, {
      x: 0.9,
      y: 5.1 + i * 0.38,
      w: 11.7,
      h: 0.35,
      fontSize: 11,
      color: 'B0D4F1',
      fontFace: 'Arial',
    });
  });

  slide.addText(`Contact: ${data.sponsorName || brand.companyName || 'Sponsor'}`, {
    x: 0.7,
    y: 6.3,
    w: 12,
    h: 0.25,
    fontSize: 10,
    color: colors.white,
    fontFace: 'Arial',
  });
}
