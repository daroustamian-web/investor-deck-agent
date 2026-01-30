import PptxGenJS from 'pptxgenjs';
import { BrandConfig, ProjectData } from './types';

interface DeckGeneratorOptions {
  brand: BrandConfig;
  projectData: Partial<ProjectData>;
  conversationSummary: string;
}

// Helper to convert hex to RGB for charts
function hexToRgb(hex: string): string {
  return hex.replace('#', '');
}

export async function generateInvestorDeck(
  options: DeckGeneratorOptions
): Promise<Blob> {
  const { brand, projectData, conversationSummary } = options;
  const pptx = new PptxGenJS();

  // Presentation setup
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = brand.companyName || 'Investor Deck Generator';
  pptx.title = projectData.projectName || 'Investment Opportunity';
  pptx.subject = 'Real Estate Investment Opportunity';

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

  // Define master slides
  defineMasterSlides(pptx, colors, brand);

  // Generate slides
  createCoverSlide(pptx, colors, brand, projectData);
  createExecutiveSummarySlide(pptx, colors, brand, projectData);
  createOpportunitySlide(pptx, colors, brand, projectData);
  createMarketAnalysisSlide(pptx, colors, brand, projectData);
  createDevelopmentPlanSlide(pptx, colors, brand, projectData);
  createTeamSlide(pptx, colors, brand, projectData);
  createFinancialsSlide(pptx, colors, brand, projectData);
  createDealStructureSlide(pptx, colors, brand, projectData);
  createUseOfFundsSlide(pptx, colors, brand, projectData);
  createExitSlide(pptx, colors, brand, projectData);

  // Generate blob
  const blob = (await pptx.write({ outputType: 'blob' })) as Blob;
  return blob;
}

function defineMasterSlides(
  pptx: PptxGenJS,
  colors: Record<string, string>,
  brand: BrandConfig
) {
  // Title slide master
  pptx.defineSlideMaster({
    title: 'TITLE_MASTER',
    background: { color: colors.primary },
    objects: [
      // Decorative accent bar at bottom
      {
        rect: {
          x: 0,
          y: 6.8,
          w: '100%',
          h: 0.7,
          fill: { color: colors.secondary },
        },
      },
      // Subtle gradient overlay effect (using semi-transparent shape)
      {
        rect: {
          x: 0,
          y: 0,
          w: '100%',
          h: '100%',
          fill: { color: colors.dark, transparency: 85 },
        },
      },
    ],
  });

  // Content slide master
  pptx.defineSlideMaster({
    title: 'CONTENT_MASTER',
    background: { color: colors.light },
    objects: [
      // Header bar
      {
        rect: {
          x: 0,
          y: 0,
          w: '100%',
          h: 1.0,
          fill: { color: colors.primary },
        },
      },
      // Accent line under header
      {
        rect: {
          x: 0,
          y: 1.0,
          w: '100%',
          h: 0.05,
          fill: { color: colors.secondary },
        },
      },
      // Footer bar
      {
        rect: {
          x: 0,
          y: 7.1,
          w: '100%',
          h: 0.4,
          fill: { color: colors.dark },
        },
      },
      // Logo placeholder text (will add actual logo in slide creation)
      {
        text: {
          text: brand.companyName || '',
          options: {
            x: 0.4,
            y: 0.3,
            w: 3,
            h: 0.4,
            fontSize: 14,
            color: colors.white,
            fontFace: 'Arial',
            bold: true,
          },
        },
      },
    ],
    slideNumber: {
      x: 12.5,
      y: 7.2,
      color: colors.white,
      fontSize: 10,
      fontFace: 'Arial',
    },
  });
}

function createCoverSlide(
  pptx: PptxGenJS,
  colors: Record<string, string>,
  brand: BrandConfig,
  data: Partial<ProjectData>
) {
  const slide = pptx.addSlide({ masterName: 'TITLE_MASTER' });

  // Logo (if provided)
  if (brand.logo) {
    slide.addImage({
      data: brand.logo,
      x: 5.5,
      y: 0.8,
      w: 2.5,
      h: 1.0,
    });
  }

  // Main title
  slide.addText(data.projectName || 'Investment Opportunity', {
    x: 0.5,
    y: 2.5,
    w: 12.33,
    h: 1.2,
    fontSize: 44,
    color: colors.white,
    fontFace: 'Arial',
    bold: true,
    align: 'center',
  });

  // Subtitle - raise amount
  slide.addText(
    `${data.totalRaise || '$1.5M'} Equity Investment Opportunity`,
    {
      x: 0.5,
      y: 3.8,
      w: 12.33,
      h: 0.6,
      fontSize: 24,
      color: colors.secondary,
      fontFace: 'Arial',
      align: 'center',
    }
  );

  // Location
  slide.addText(data.propertyAddress || data.marketLocation || 'Southern California', {
    x: 0.5,
    y: 4.6,
    w: 12.33,
    h: 0.5,
    fontSize: 18,
    color: 'B0D4F1',
    fontFace: 'Arial',
    align: 'center',
  });

  // Date
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  slide.addText(today, {
    x: 0.5,
    y: 5.5,
    w: 12.33,
    h: 0.4,
    fontSize: 14,
    color: '80B0D4',
    fontFace: 'Arial',
    align: 'center',
  });

  // Confidential notice
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
  const slide = pptx.addSlide({ masterName: 'CONTENT_MASTER' });

  // Add logo if provided
  if (brand.logo) {
    slide.addImage({
      data: brand.logo,
      x: 11.5,
      y: 0.2,
      w: 1.5,
      h: 0.6,
    });
  }

  // Title
  slide.addText('Executive Summary', {
    x: 0.4,
    y: 0.25,
    w: 8,
    h: 0.5,
    fontSize: 24,
    color: colors.white,
    fontFace: 'Arial',
    bold: true,
  });

  // Investment highlights box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 1.3,
    w: 6,
    h: 4.5,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 8, offset: 2, angle: 45, opacity: 0.15 },
  });

  slide.addText('Investment Highlights', {
    x: 0.7,
    y: 1.5,
    w: 5.6,
    h: 0.4,
    fontSize: 16,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const highlights = [
    `${data.facilityType || 'Convalescent Care'} Development`,
    `${data.bedCount || '—'} Licensed Beds`,
    `${data.propertyAddress || data.marketLocation || 'Prime SoCal Location'}`,
    `${data.constructionTimeline || '18-24 month'} development timeline`,
    `Projected ${data.projectedIRR || '—'} IRR`,
    `${data.preferredReturn || '8%'} Preferred Return to LPs`,
  ];

  highlights.forEach((text, index) => {
    slide.addText(`• ${text}`, {
      x: 0.9,
      y: 2.0 + index * 0.55,
      w: 5.4,
      h: 0.5,
      fontSize: 13,
      color: colors.text,
      fontFace: 'Arial',
    });
  });

  // Key metrics box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8,
    y: 1.3,
    w: 6,
    h: 4.5,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 8, offset: 2, angle: 45, opacity: 0.15 },
  });

  slide.addText('Key Metrics', {
    x: 7.0,
    y: 1.5,
    w: 5.6,
    h: 0.4,
    fontSize: 16,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const metrics = [
    { label: 'Total Raise', value: data.totalRaise || '$1.5M' },
    { label: 'Total Project Cost', value: data.totalProjectCost || '—' },
    { label: 'Projected IRR', value: data.projectedIRR || '—' },
    { label: 'Equity Multiple', value: data.equityMultiple || '—' },
    { label: 'Cash-on-Cash', value: data.cashOnCash || '—' },
    { label: 'Hold Period', value: data.holdPeriod || '5-7 years' },
  ];

  metrics.forEach((metric, index) => {
    slide.addText(metric.label, {
      x: 7.2,
      y: 2.0 + index * 0.55,
      w: 2.5,
      h: 0.4,
      fontSize: 12,
      color: colors.textLight,
      fontFace: 'Arial',
    });
    slide.addText(metric.value, {
      x: 10.0,
      y: 2.0 + index * 0.55,
      w: 2.5,
      h: 0.4,
      fontSize: 12,
      color: colors.primary,
      fontFace: 'Arial',
      bold: true,
      align: 'right',
    });
  });

  // Investment thesis
  slide.addText('Investment Thesis', {
    x: 0.5,
    y: 6.0,
    w: 12.33,
    h: 0.4,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(
    `Strategic development opportunity in ${data.marketLocation || 'Southern California'} addressing the growing demand for ${data.facilityType || 'skilled nursing'} beds in an underserved market. Experienced sponsor with proven track record seeking ${data.totalRaise || '$1.5M'} in LP equity.`,
    {
      x: 0.5,
      y: 6.4,
      w: 12.33,
      h: 0.6,
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
  const slide = pptx.addSlide({ masterName: 'CONTENT_MASTER' });

  if (brand.logo) {
    slide.addImage({ data: brand.logo, x: 11.5, y: 0.2, w: 1.5, h: 0.6 });
  }

  slide.addText('The Opportunity', {
    x: 0.4,
    y: 0.25,
    w: 8,
    h: 0.5,
    fontSize: 24,
    color: colors.white,
    fontFace: 'Arial',
    bold: true,
  });

  // Property details section
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 1.3,
    w: 6,
    h: 3.0,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.12 },
  });

  slide.addText('Property Details', {
    x: 0.7,
    y: 1.45,
    w: 5.6,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const propertyDetails = [
    { label: 'Address', value: data.propertyAddress || '—' },
    { label: 'Lot Size', value: data.lotSize || '—' },
    { label: 'Zoning', value: data.zoning || '—' },
    { label: 'Status', value: data.zoningStatus || '—' },
    { label: 'Land Basis', value: data.purchasePrice || data.landOwnership || '—' },
  ];

  propertyDetails.forEach((item, index) => {
    slide.addText(item.label + ':', {
      x: 0.9,
      y: 1.9 + index * 0.4,
      w: 1.8,
      h: 0.35,
      fontSize: 11,
      color: colors.textLight,
      fontFace: 'Arial',
    });
    slide.addText(item.value, {
      x: 2.8,
      y: 1.9 + index * 0.4,
      w: 3.5,
      h: 0.35,
      fontSize: 11,
      color: colors.text,
      fontFace: 'Arial',
      bold: true,
    });
  });

  // Development overview section
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8,
    y: 1.3,
    w: 6,
    h: 3.0,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.12 },
  });

  slide.addText('Development Overview', {
    x: 7.0,
    y: 1.45,
    w: 5.6,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const developmentDetails = [
    { label: 'Facility Type', value: data.facilityType || 'Convalescent Home' },
    { label: 'Licensed Beds', value: data.bedCount || '—' },
    { label: 'Square Footage', value: data.squareFootage || '—' },
    { label: 'Timeline', value: data.constructionTimeline || '—' },
    { label: 'Total Cost', value: data.totalProjectCost || '—' },
  ];

  developmentDetails.forEach((item, index) => {
    slide.addText(item.label + ':', {
      x: 7.2,
      y: 1.9 + index * 0.4,
      w: 2.0,
      h: 0.35,
      fontSize: 11,
      color: colors.textLight,
      fontFace: 'Arial',
    });
    slide.addText(item.value, {
      x: 9.3,
      y: 1.9 + index * 0.4,
      w: 3.3,
      h: 0.35,
      fontSize: 11,
      color: colors.text,
      fontFace: 'Arial',
      bold: true,
    });
  });

  // Why this opportunity
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 4.5,
    w: 12.33,
    h: 2.3,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.12 },
  });

  slide.addText('Why This Opportunity', {
    x: 0.7,
    y: 4.65,
    w: 12,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const reasons = [
    'Aging population driving unprecedented demand for skilled nursing beds',
    'Limited new supply due to CON requirements and development complexity',
    'Prime location with strong referral network and hospital proximity',
    'Experienced operator with proven track record in healthcare real estate',
  ];

  reasons.forEach((reason, index) => {
    slide.addText(`✓ ${reason}`, {
      x: 0.9,
      y: 5.1 + index * 0.4,
      w: 11.7,
      h: 0.35,
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
  const slide = pptx.addSlide({ masterName: 'CONTENT_MASTER' });

  if (brand.logo) {
    slide.addImage({ data: brand.logo, x: 11.5, y: 0.2, w: 1.5, h: 0.6 });
  }

  slide.addText('Market Analysis', {
    x: 0.4,
    y: 0.25,
    w: 8,
    h: 0.5,
    fontSize: 24,
    color: colors.white,
    fontFace: 'Arial',
    bold: true,
  });

  // Demographics section
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 1.3,
    w: 4,
    h: 3.2,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.12 },
  });

  slide.addText('Demographics', {
    x: 0.7,
    y: 1.45,
    w: 3.6,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  // Population stats
  slide.addText(data.population65Plus || '125,000+', {
    x: 0.7,
    y: 2.0,
    w: 3.6,
    h: 0.6,
    fontSize: 32,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });
  slide.addText('Population 65+ (10-mile radius)', {
    x: 0.7,
    y: 2.55,
    w: 3.6,
    h: 0.3,
    fontSize: 10,
    color: colors.textLight,
    fontFace: 'Arial',
  });

  slide.addText(data.populationGrowth || '+15%', {
    x: 0.7,
    y: 3.1,
    w: 3.6,
    h: 0.6,
    fontSize: 32,
    color: colors.accent,
    fontFace: 'Arial',
    bold: true,
  });
  slide.addText('Projected Growth (10-year)', {
    x: 0.7,
    y: 3.65,
    w: 3.6,
    h: 0.3,
    fontSize: 10,
    color: colors.textLight,
    fontFace: 'Arial',
  });

  // Competitive landscape
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 4.7,
    y: 1.3,
    w: 4,
    h: 3.2,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.12 },
  });

  slide.addText('Competitive Landscape', {
    x: 4.9,
    y: 1.45,
    w: 3.6,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(data.competitorCount || '6', {
    x: 4.9,
    y: 2.0,
    w: 3.6,
    h: 0.6,
    fontSize: 32,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });
  slide.addText('Competing Facilities', {
    x: 4.9,
    y: 2.55,
    w: 3.6,
    h: 0.3,
    fontSize: 10,
    color: colors.textLight,
    fontFace: 'Arial',
  });

  slide.addText(data.marketOccupancy || '92%', {
    x: 4.9,
    y: 3.1,
    w: 3.6,
    h: 0.6,
    fontSize: 32,
    color: colors.secondary,
    fontFace: 'Arial',
    bold: true,
  });
  slide.addText('Market Occupancy Rate', {
    x: 4.9,
    y: 3.65,
    w: 3.6,
    h: 0.3,
    fontSize: 10,
    color: colors.textLight,
    fontFace: 'Arial',
  });

  // Market rates
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.9,
    y: 1.3,
    w: 4,
    h: 3.2,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.12 },
  });

  slide.addText('Market Rates', {
    x: 9.1,
    y: 1.45,
    w: 3.6,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(data.averageDailyRate || '$325', {
    x: 9.1,
    y: 2.0,
    w: 3.6,
    h: 0.6,
    fontSize: 32,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });
  slide.addText('Average Daily Rate', {
    x: 9.1,
    y: 2.55,
    w: 3.6,
    h: 0.3,
    fontSize: 10,
    color: colors.textLight,
    fontFace: 'Arial',
  });

  // Demand drivers
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 4.7,
    w: 12.33,
    h: 2.1,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.12 },
  });

  slide.addText('Key Demand Drivers', {
    x: 0.7,
    y: 4.85,
    w: 12,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const drivers = (
    data.demandDrivers ||
    'Hospital discharge partnerships, aging in place trends, increasing acuity levels, limited new supply'
  ).split(',');

  drivers.forEach((driver, index) => {
    if (index < 4) {
      slide.addText(`• ${driver.trim()}`, {
        x: 0.9 + (index % 2) * 6,
        y: 5.3 + Math.floor(index / 2) * 0.4,
        w: 5.8,
        h: 0.35,
        fontSize: 11,
        color: colors.text,
        fontFace: 'Arial',
      });
    }
  });
}

function createDevelopmentPlanSlide(
  pptx: PptxGenJS,
  colors: Record<string, string>,
  brand: BrandConfig,
  data: Partial<ProjectData>
) {
  const slide = pptx.addSlide({ masterName: 'CONTENT_MASTER' });

  if (brand.logo) {
    slide.addImage({ data: brand.logo, x: 11.5, y: 0.2, w: 1.5, h: 0.6 });
  }

  slide.addText('Development Plan', {
    x: 0.4,
    y: 0.25,
    w: 8,
    h: 0.5,
    fontSize: 24,
    color: colors.white,
    fontFace: 'Arial',
    bold: true,
  });

  // Timeline
  const phases = [
    { name: 'Pre-Development', duration: '0-3 months', activities: 'Entitlements, permits, financing' },
    { name: 'Construction', duration: '3-18 months', activities: 'Ground-up development' },
    { name: 'Licensing', duration: '18-21 months', activities: 'State licensing, CMS certification' },
    { name: 'Lease-Up', duration: '21-30 months', activities: 'Ramp to stabilization' },
  ];

  // Timeline bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 1.8,
    w: 12.33,
    h: 0.15,
    fill: { color: 'E0E0E0' },
  });

  phases.forEach((phase, index) => {
    const xPos = 0.5 + index * 3.08;

    // Phase box
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 2.2,
      w: 2.9,
      h: 1.8,
      fill: { color: colors.white },
      shadow: { type: 'outer', blur: 4, offset: 1, angle: 45, opacity: 0.1 },
    });

    // Phase dot on timeline
    slide.addShape(pptx.ShapeType.ellipse, {
      x: xPos + 1.3,
      y: 1.7,
      w: 0.3,
      h: 0.3,
      fill: { color: colors.primary },
    });

    // Phase number
    slide.addText(`${index + 1}`, {
      x: xPos + 1.35,
      y: 1.72,
      w: 0.2,
      h: 0.25,
      fontSize: 10,
      color: colors.white,
      fontFace: 'Arial',
      bold: true,
    });

    // Phase name
    slide.addText(phase.name, {
      x: xPos + 0.1,
      y: 2.35,
      w: 2.7,
      h: 0.35,
      fontSize: 12,
      color: colors.primary,
      fontFace: 'Arial',
      bold: true,
      align: 'center',
    });

    // Duration
    slide.addText(phase.duration, {
      x: xPos + 0.1,
      y: 2.7,
      w: 2.7,
      h: 0.25,
      fontSize: 10,
      color: colors.secondary,
      fontFace: 'Arial',
      align: 'center',
    });

    // Activities
    slide.addText(phase.activities, {
      x: xPos + 0.1,
      y: 3.0,
      w: 2.7,
      h: 0.8,
      fontSize: 9,
      color: colors.textLight,
      fontFace: 'Arial',
      align: 'center',
    });
  });

  // Development specs
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 4.3,
    w: 6,
    h: 2.5,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.12 },
  });

  slide.addText('Facility Specifications', {
    x: 0.7,
    y: 4.45,
    w: 5.6,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const specs = [
    { label: 'Facility Type', value: data.facilityType || 'Skilled Nursing Facility' },
    { label: 'Licensed Beds', value: data.bedCount || '—' },
    { label: 'Building Size', value: data.squareFootage || '—' },
    { label: 'General Contractor', value: data.generalContractor || 'TBD' },
  ];

  specs.forEach((spec, index) => {
    slide.addText(spec.label + ':', {
      x: 0.9,
      y: 4.9 + index * 0.4,
      w: 2.2,
      h: 0.35,
      fontSize: 11,
      color: colors.textLight,
      fontFace: 'Arial',
    });
    slide.addText(spec.value, {
      x: 3.2,
      y: 4.9 + index * 0.4,
      w: 3,
      h: 0.35,
      fontSize: 11,
      color: colors.text,
      fontFace: 'Arial',
      bold: true,
    });
  });

  // Budget summary
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8,
    y: 4.3,
    w: 6,
    h: 2.5,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.12 },
  });

  slide.addText('Development Budget', {
    x: 7.0,
    y: 4.45,
    w: 5.6,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(data.totalProjectCost || '$8.5M', {
    x: 7.0,
    y: 4.9,
    w: 5.6,
    h: 0.6,
    fontSize: 28,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
    align: 'center',
  });

  slide.addText('Total Project Cost', {
    x: 7.0,
    y: 5.5,
    w: 5.6,
    h: 0.3,
    fontSize: 11,
    color: colors.textLight,
    fontFace: 'Arial',
    align: 'center',
  });

  if (data.constructionCostPerBed) {
    slide.addText(`${data.constructionCostPerBed} per bed`, {
      x: 7.0,
      y: 5.9,
      w: 5.6,
      h: 0.3,
      fontSize: 11,
      color: colors.secondary,
      fontFace: 'Arial',
      align: 'center',
    });
  }
}

function createTeamSlide(
  pptx: PptxGenJS,
  colors: Record<string, string>,
  brand: BrandConfig,
  data: Partial<ProjectData>
) {
  const slide = pptx.addSlide({ masterName: 'CONTENT_MASTER' });

  if (brand.logo) {
    slide.addImage({ data: brand.logo, x: 11.5, y: 0.2, w: 1.5, h: 0.6 });
  }

  slide.addText('Team & Track Record', {
    x: 0.4,
    y: 0.25,
    w: 8,
    h: 0.5,
    fontSize: 24,
    color: colors.white,
    fontFace: 'Arial',
    bold: true,
  });

  // Sponsor profile
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 1.3,
    w: 6,
    h: 4,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.12 },
  });

  slide.addText('Sponsor Profile', {
    x: 0.7,
    y: 1.45,
    w: 5.6,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(data.sponsorName || 'Principal Sponsor', {
    x: 0.7,
    y: 1.9,
    w: 5.6,
    h: 0.4,
    fontSize: 18,
    color: colors.text,
    fontFace: 'Arial',
    bold: true,
  });

  const sponsorDetails = [
    data.sponsorExperience || '15+ years in healthcare real estate',
    `${data.priorDeals || '10+'} deals completed`,
    `${data.assetsUnderManagement || '$50M+'} assets under management`,
    `${data.priorReturns || '18%+'} average investor IRR`,
    `${data.coInvestAmount || '5%'} co-investment in this deal`,
  ];

  sponsorDetails.forEach((detail, index) => {
    slide.addText(`• ${detail}`, {
      x: 0.9,
      y: 2.4 + index * 0.45,
      w: 5.4,
      h: 0.4,
      fontSize: 12,
      color: colors.text,
      fontFace: 'Arial',
    });
  });

  // Track record metrics
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8,
    y: 1.3,
    w: 6,
    h: 2.3,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.12 },
  });

  slide.addText('Track Record', {
    x: 7.0,
    y: 1.45,
    w: 5.6,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  // Metrics in a row
  const trackMetrics = [
    { value: data.priorDeals || '10+', label: 'Deals' },
    { value: data.assetsUnderManagement || '$50M', label: 'AUM' },
    { value: data.priorReturns || '18%', label: 'Avg IRR' },
  ];

  trackMetrics.forEach((metric, index) => {
    slide.addText(metric.value, {
      x: 7.2 + index * 1.9,
      y: 2.0,
      w: 1.7,
      h: 0.5,
      fontSize: 22,
      color: colors.primary,
      fontFace: 'Arial',
      bold: true,
      align: 'center',
    });
    slide.addText(metric.label, {
      x: 7.2 + index * 1.9,
      y: 2.5,
      w: 1.7,
      h: 0.3,
      fontSize: 10,
      color: colors.textLight,
      fontFace: 'Arial',
      align: 'center',
    });
  });

  // Operator/management
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8,
    y: 3.8,
    w: 6,
    h: 1.5,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.12 },
  });

  slide.addText('Operations', {
    x: 7.0,
    y: 3.95,
    w: 5.6,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(`Operator: ${data.operator || 'Experienced third-party operator'}`, {
    x: 7.2,
    y: 4.4,
    w: 5.4,
    h: 0.35,
    fontSize: 11,
    color: colors.text,
    fontFace: 'Arial',
  });

  if (data.managementTeam) {
    slide.addText(`Management: ${data.managementTeam}`, {
      x: 7.2,
      y: 4.8,
      w: 5.4,
      h: 0.35,
      fontSize: 11,
      color: colors.text,
      fontFace: 'Arial',
    });
  }

  // Investor alignment
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 5.5,
    w: 12.33,
    h: 1.3,
    fill: { color: colors.primary },
  });

  slide.addText('Investor Alignment', {
    x: 0.7,
    y: 5.65,
    w: 12,
    h: 0.35,
    fontSize: 14,
    color: colors.white,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(
    `GP is co-investing ${data.coInvestAmount || '5%'} of equity alongside LPs, ensuring aligned interests throughout the project lifecycle.`,
    {
      x: 0.7,
      y: 6.1,
      w: 12,
      h: 0.5,
      fontSize: 12,
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
  const slide = pptx.addSlide({ masterName: 'CONTENT_MASTER' });

  if (brand.logo) {
    slide.addImage({ data: brand.logo, x: 11.5, y: 0.2, w: 1.5, h: 0.6 });
  }

  slide.addText('Financial Projections', {
    x: 0.4,
    y: 0.25,
    w: 8,
    h: 0.5,
    fontSize: 24,
    color: colors.white,
    fontFace: 'Arial',
    bold: true,
  });

  // Return metrics
  const returnMetrics = [
    { value: data.projectedIRR || '18%', label: 'Projected IRR' },
    { value: data.equityMultiple || '2.1x', label: 'Equity Multiple' },
    { value: data.cashOnCash || '8-12%', label: 'Cash-on-Cash' },
    { value: data.holdPeriod || '5-7 yrs', label: 'Hold Period' },
  ];

  returnMetrics.forEach((metric, index) => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5 + index * 3.15,
      y: 1.3,
      w: 2.95,
      h: 1.5,
      fill: { color: colors.white },
      shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.12 },
    });

    slide.addText(metric.value, {
      x: 0.5 + index * 3.15,
      y: 1.5,
      w: 2.95,
      h: 0.7,
      fontSize: 28,
      color: colors.primary,
      fontFace: 'Arial',
      bold: true,
      align: 'center',
    });

    slide.addText(metric.label, {
      x: 0.5 + index * 3.15,
      y: 2.2,
      w: 2.95,
      h: 0.4,
      fontSize: 11,
      color: colors.textLight,
      fontFace: 'Arial',
      align: 'center',
    });
  });

  // Pro forma chart (bar chart)
  const chartData = [
    {
      name: 'NOI ($K)',
      labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
      values: [200, 450, 650, 750, 800],
    },
  ];

  slide.addChart(pptx.ChartType.bar, chartData, {
    x: 0.5,
    y: 3.0,
    w: 6,
    h: 3.5,
    barDir: 'col',
    chartColors: [colors.primary],
    showTitle: true,
    title: 'Projected NOI Growth',
    titleColor: colors.text,
    titleFontSize: 12,
    titleFontFace: 'Arial',
    titleBold: true,
    showLegend: false,
    showValue: true,
    dataLabelColor: colors.text,
    dataLabelFontSize: 9,
    dataLabelPosition: 'outEnd',
    valAxisLabelColor: colors.textLight,
    catAxisLabelColor: colors.textLight,
    valGridLine: { style: 'dash', color: 'E0E0E0' },
    catGridLine: { style: 'none' },
  });

  // Cap rate analysis
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8,
    y: 3.0,
    w: 6,
    h: 3.5,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.12 },
  });

  slide.addText('Valuation Analysis', {
    x: 7.0,
    y: 3.15,
    w: 5.6,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const valuationItems = [
    { label: 'Going-In Cap Rate', value: data.goingInCapRate || '—' },
    { label: 'Exit Cap Rate', value: data.exitCapRate || '—' },
    { label: 'Stabilized NOI', value: data.projectedNOI || '—' },
  ];

  valuationItems.forEach((item, index) => {
    slide.addText(item.label, {
      x: 7.2,
      y: 3.7 + index * 0.5,
      w: 2.8,
      h: 0.4,
      fontSize: 11,
      color: colors.textLight,
      fontFace: 'Arial',
    });
    slide.addText(item.value, {
      x: 10.2,
      y: 3.7 + index * 0.5,
      w: 2.4,
      h: 0.4,
      fontSize: 11,
      color: colors.text,
      fontFace: 'Arial',
      bold: true,
      align: 'right',
    });
  });

  // Assumptions note
  slide.addText('Key Assumptions:', {
    x: 7.2,
    y: 5.3,
    w: 5.4,
    h: 0.35,
    fontSize: 10,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(
    '• 24-month stabilization period\n• 3% annual rent growth\n• 25 bps exit cap expansion',
    {
      x: 7.2,
      y: 5.6,
      w: 5.4,
      h: 0.8,
      fontSize: 9,
      color: colors.textLight,
      fontFace: 'Arial',
    }
  );
}

function createDealStructureSlide(
  pptx: PptxGenJS,
  colors: Record<string, string>,
  brand: BrandConfig,
  data: Partial<ProjectData>
) {
  const slide = pptx.addSlide({ masterName: 'CONTENT_MASTER' });

  if (brand.logo) {
    slide.addImage({ data: brand.logo, x: 11.5, y: 0.2, w: 1.5, h: 0.6 });
  }

  slide.addText('Deal Structure', {
    x: 0.4,
    y: 0.25,
    w: 8,
    h: 0.5,
    fontSize: 24,
    color: colors.white,
    fontFace: 'Arial',
    bold: true,
  });

  // Investment terms
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 1.3,
    w: 6,
    h: 4.5,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.12 },
  });

  slide.addText('Investment Terms', {
    x: 0.7,
    y: 1.45,
    w: 5.6,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const terms = [
    { label: 'Total Raise', value: data.totalRaise || '$1.5M' },
    { label: 'Minimum Investment', value: data.minimumInvestment || '$50,000' },
    { label: 'Preferred Return', value: data.preferredReturn || '8%' },
    { label: 'Distribution Frequency', value: data.distributionFrequency || 'Quarterly' },
    { label: 'Hold Period', value: data.holdPeriod || '5-7 years' },
    { label: 'GP Co-Invest', value: data.coInvestAmount || '5%' },
  ];

  terms.forEach((term, index) => {
    slide.addText(term.label, {
      x: 0.9,
      y: 1.9 + index * 0.55,
      w: 2.8,
      h: 0.4,
      fontSize: 12,
      color: colors.textLight,
      fontFace: 'Arial',
    });
    slide.addText(term.value, {
      x: 3.8,
      y: 1.9 + index * 0.55,
      w: 2.5,
      h: 0.4,
      fontSize: 12,
      color: colors.text,
      fontFace: 'Arial',
      bold: true,
      align: 'right',
    });
  });

  // Fee structure
  slide.addText('Fee Structure', {
    x: 0.7,
    y: 5.1,
    w: 5.6,
    h: 0.35,
    fontSize: 12,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const fees = [
    { label: 'Acquisition Fee', value: data.acquisitionFee || '1.0%' },
    { label: 'Asset Management', value: data.managementFee || '1.5%' },
    { label: 'Disposition Fee', value: data.dispositionFee || '1.0%' },
  ];

  fees.forEach((fee, index) => {
    slide.addText(`${fee.label}: ${fee.value}`, {
      x: 0.9 + (index % 2) * 2.8,
      y: 5.45 + Math.floor(index / 2) * 0.35,
      w: 2.6,
      h: 0.3,
      fontSize: 10,
      color: colors.textLight,
      fontFace: 'Arial',
    });
  });

  // Waterfall structure
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8,
    y: 1.3,
    w: 6,
    h: 4.5,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.12 },
  });

  slide.addText('Waterfall Structure', {
    x: 7.0,
    y: 1.45,
    w: 5.6,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  // Waterfall tiers
  const waterfallTiers = [
    { tier: '1', threshold: 'Return of Capital', lp: '100%', gp: '0%' },
    { tier: '2', threshold: `Pref Return (${data.preferredReturn || '8%'})`, lp: '100%', gp: '0%' },
    { tier: '3', threshold: 'Up to 12% IRR', lp: '80%', gp: '20%' },
    { tier: '4', threshold: 'Above 12% IRR', lp: '70%', gp: '30%' },
  ];

  // Table header
  slide.addText('Tier', { x: 7.2, y: 2.0, w: 0.6, h: 0.35, fontSize: 10, color: colors.textLight, fontFace: 'Arial', bold: true });
  slide.addText('Threshold', { x: 7.9, y: 2.0, w: 2.5, h: 0.35, fontSize: 10, color: colors.textLight, fontFace: 'Arial', bold: true });
  slide.addText('LP', { x: 10.5, y: 2.0, w: 0.8, h: 0.35, fontSize: 10, color: colors.textLight, fontFace: 'Arial', bold: true, align: 'center' });
  slide.addText('GP', { x: 11.4, y: 2.0, w: 0.8, h: 0.35, fontSize: 10, color: colors.textLight, fontFace: 'Arial', bold: true, align: 'center' });

  waterfallTiers.forEach((tier, index) => {
    const y = 2.4 + index * 0.55;
    slide.addText(tier.tier, { x: 7.2, y, w: 0.6, h: 0.45, fontSize: 11, color: colors.primary, fontFace: 'Arial', bold: true, align: 'center' });
    slide.addText(tier.threshold, { x: 7.9, y, w: 2.5, h: 0.45, fontSize: 10, color: colors.text, fontFace: 'Arial' });
    slide.addText(tier.lp, { x: 10.5, y, w: 0.8, h: 0.45, fontSize: 11, color: colors.secondary, fontFace: 'Arial', bold: true, align: 'center' });
    slide.addText(tier.gp, { x: 11.4, y, w: 0.8, h: 0.45, fontSize: 11, color: colors.text, fontFace: 'Arial', align: 'center' });
  });

  // Visual waterfall note
  slide.addText(
    data.waterfallStructure ||
      'Standard waterfall with LP-favorable structure. GP promotes earned only after investor capital returned with preferred return.',
    {
      x: 7.0,
      y: 4.9,
      w: 5.6,
      h: 0.7,
      fontSize: 9,
      color: colors.textLight,
      fontFace: 'Arial',
      italic: true,
    }
  );
}

function createUseOfFundsSlide(
  pptx: PptxGenJS,
  colors: Record<string, string>,
  brand: BrandConfig,
  data: Partial<ProjectData>
) {
  const slide = pptx.addSlide({ masterName: 'CONTENT_MASTER' });

  if (brand.logo) {
    slide.addImage({ data: brand.logo, x: 11.5, y: 0.2, w: 1.5, h: 0.6 });
  }

  slide.addText('Use of Funds', {
    x: 0.4,
    y: 0.25,
    w: 8,
    h: 0.5,
    fontSize: 24,
    color: colors.white,
    fontFace: 'Arial',
    bold: true,
  });

  // Capital stack pie chart
  const capitalData = [
    { name: 'Capital Stack', labels: ['LP Equity', 'GP Equity', 'Debt'], values: [60, 10, 30] },
  ];

  slide.addChart(pptx.ChartType.doughnut, capitalData, {
    x: 0.5,
    y: 1.3,
    w: 5.5,
    h: 4,
    chartColors: [colors.primary, colors.secondary, colors.accent],
    showTitle: true,
    title: 'Capital Stack',
    titleColor: colors.text,
    titleFontSize: 14,
    titleFontFace: 'Arial',
    titleBold: true,
    showLegend: true,
    legendPos: 'b',
    legendColor: colors.textLight,
    showPercent: true,
    showValue: false,
    holeSize: 50,
  });

  // Use of proceeds breakdown
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.5,
    y: 1.3,
    w: 6.33,
    h: 5.5,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.12 },
  });

  slide.addText('Use of Proceeds', {
    x: 6.7,
    y: 1.45,
    w: 5.9,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  // Total at top
  slide.addText(`Total Project Cost: ${data.totalProjectCost || '$8.5M'}`, {
    x: 6.7,
    y: 1.9,
    w: 5.9,
    h: 0.4,
    fontSize: 16,
    color: colors.text,
    fontFace: 'Arial',
    bold: true,
  });

  const uses = [
    { category: 'Land Acquisition', amount: data.purchasePrice || '$1.2M', percent: '14%' },
    { category: 'Hard Construction Costs', amount: '$5.5M', percent: '65%' },
    { category: 'Soft Costs & Permits', amount: '$800K', percent: '9%' },
    { category: 'Financing Costs', amount: '$400K', percent: '5%' },
    { category: 'Operating Reserve', amount: '$350K', percent: '4%' },
    { category: 'Developer Fee', amount: '$250K', percent: '3%' },
  ];

  uses.forEach((use, index) => {
    const y = 2.5 + index * 0.6;

    // Category bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 6.9,
      y: y + 0.25,
      w: 4.5 * (parseInt(use.percent) / 100),
      h: 0.25,
      fill: { color: colors.primary },
    });

    slide.addText(use.category, {
      x: 6.9,
      y,
      w: 3,
      h: 0.25,
      fontSize: 10,
      color: colors.text,
      fontFace: 'Arial',
    });
    slide.addText(use.amount, {
      x: 10.2,
      y,
      w: 1.3,
      h: 0.25,
      fontSize: 10,
      color: colors.text,
      fontFace: 'Arial',
      bold: true,
      align: 'right',
    });
    slide.addText(use.percent, {
      x: 11.6,
      y,
      w: 0.8,
      h: 0.25,
      fontSize: 10,
      color: colors.textLight,
      fontFace: 'Arial',
      align: 'right',
    });
  });

  // Equity breakdown
  slide.addText('Equity Breakdown', {
    x: 6.7,
    y: 6.2,
    w: 5.9,
    h: 0.35,
    fontSize: 12,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(
    `LP Equity: ${data.totalRaise || '$1.5M'} | GP Co-Invest: ${data.coInvestAmount || '5%'}`,
    {
      x: 6.7,
      y: 6.5,
      w: 5.9,
      h: 0.3,
      fontSize: 10,
      color: colors.textLight,
      fontFace: 'Arial',
    }
  );
}

function createExitSlide(
  pptx: PptxGenJS,
  colors: Record<string, string>,
  brand: BrandConfig,
  data: Partial<ProjectData>
) {
  const slide = pptx.addSlide({ masterName: 'CONTENT_MASTER' });

  if (brand.logo) {
    slide.addImage({ data: brand.logo, x: 11.5, y: 0.2, w: 1.5, h: 0.6 });
  }

  slide.addText('Exit Strategy & Next Steps', {
    x: 0.4,
    y: 0.25,
    w: 8,
    h: 0.5,
    fontSize: 24,
    color: colors.white,
    fontFace: 'Arial',
    bold: true,
  });

  // Exit scenarios
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 1.3,
    w: 8,
    h: 3.2,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.12 },
  });

  slide.addText('Exit Scenarios', {
    x: 0.7,
    y: 1.45,
    w: 7.6,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  const scenarios = [
    {
      name: 'Sale to Institutional Buyer',
      description: 'REIT, private equity, or regional operator acquisition at stabilization',
      timeline: 'Year 5-7',
    },
    {
      name: 'Refinance & Hold',
      description: 'Cash-out refinance with continued operation and LP distributions',
      timeline: 'Year 4-5',
    },
    {
      name: 'Portfolio Sale',
      description: 'Sale as part of larger multi-facility portfolio transaction',
      timeline: 'Year 6-8',
    },
  ];

  scenarios.forEach((scenario, index) => {
    const y = 1.95 + index * 0.85;
    slide.addText(scenario.name, {
      x: 0.9,
      y,
      w: 4,
      h: 0.35,
      fontSize: 12,
      color: colors.text,
      fontFace: 'Arial',
      bold: true,
    });
    slide.addText(scenario.timeline, {
      x: 5,
      y,
      w: 1.5,
      h: 0.35,
      fontSize: 11,
      color: colors.secondary,
      fontFace: 'Arial',
      bold: true,
    });
    slide.addText(scenario.description, {
      x: 0.9,
      y: y + 0.35,
      w: 7.4,
      h: 0.35,
      fontSize: 10,
      color: colors.textLight,
      fontFace: 'Arial',
    });
  });

  // Timeline
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.8,
    y: 1.3,
    w: 4,
    h: 3.2,
    fill: { color: colors.white },
    shadow: { type: 'outer', blur: 6, offset: 2, angle: 45, opacity: 0.12 },
  });

  slide.addText('Timeline', {
    x: 9.0,
    y: 1.45,
    w: 3.6,
    h: 0.35,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
  });

  slide.addText(data.holdPeriod || '5-7 Years', {
    x: 9.0,
    y: 1.9,
    w: 3.6,
    h: 0.6,
    fontSize: 24,
    color: colors.primary,
    fontFace: 'Arial',
    bold: true,
    align: 'center',
  });

  slide.addText('Target Hold Period', {
    x: 9.0,
    y: 2.5,
    w: 3.6,
    h: 0.3,
    fontSize: 10,
    color: colors.textLight,
    fontFace: 'Arial',
    align: 'center',
  });

  slide.addText(data.exitStrategy || 'Primary: Sale at stabilization\nSecondary: Refinance & continue', {
    x: 9.0,
    y: 3.0,
    w: 3.6,
    h: 0.8,
    fontSize: 10,
    color: colors.text,
    fontFace: 'Arial',
    align: 'center',
  });

  // Call to action
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 4.7,
    w: 12.33,
    h: 2.1,
    fill: { color: colors.primary },
  });

  slide.addText('Next Steps', {
    x: 0.7,
    y: 4.9,
    w: 12,
    h: 0.4,
    fontSize: 18,
    color: colors.white,
    fontFace: 'Arial',
    bold: true,
  });

  const nextSteps = [
    '1. Schedule a call to discuss the opportunity in detail',
    '2. Review the Private Placement Memorandum (PPM)',
    '3. Complete subscription documents and fund your investment',
  ];

  nextSteps.forEach((step, index) => {
    slide.addText(step, {
      x: 0.9,
      y: 5.4 + index * 0.4,
      w: 11.7,
      h: 0.35,
      fontSize: 12,
      color: 'B0D4F1',
      fontFace: 'Arial',
    });
  });

  // Contact info
  slide.addText(`Contact: ${data.sponsorName || brand.companyName || 'Sponsor'} | ${brand.companyName || ''}`, {
    x: 0.7,
    y: 6.5,
    w: 12,
    h: 0.25,
    fontSize: 11,
    color: colors.white,
    fontFace: 'Arial',
  });
}
