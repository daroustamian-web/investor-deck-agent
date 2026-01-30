// Brand configuration
export interface BrandConfig {
  logo: string | null; // base64 encoded image
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  darkColor: string;
  lightColor: string;
}

// Project data collected from user
export interface ProjectData {
  // Site/Property
  projectName: string;
  propertyAddress: string;
  lotSize: string;
  zoning: string;
  zoningStatus: string; // entitled, needs variance, pending
  purchasePrice: string;
  landOwnership: string; // owned, under contract, etc.

  // Development Plan
  facilityType: string; // SNF, RCFE, ALF
  bedCount: string;
  squareFootage: string;
  constructionTimeline: string;
  totalProjectCost: string;
  constructionCostPerBed: string;
  licenseType: string;
  generalContractor: string;

  // Market Analysis
  marketLocation: string;
  population65Plus: string;
  population85Plus: string;
  populationGrowth: string;
  competitorCount: string;
  marketOccupancy: string;
  averageDailyRate: string;
  demandDrivers: string;

  // Financials
  totalRaise: string;
  equityStructure: string;
  debtFinancing: string;
  projectedNOI: string;
  projectedIRR: string;
  cashOnCash: string;
  equityMultiple: string;
  goingInCapRate: string;
  exitCapRate: string;
  holdPeriod: string;

  // Team
  sponsorName: string;
  sponsorExperience: string;
  priorDeals: string;
  priorReturns: string;
  assetsUnderManagement: string;
  coInvestAmount: string;
  operator: string;
  managementTeam: string;

  // Deal Terms
  minimumInvestment: string;
  preferredReturn: string;
  waterfallStructure: string;
  managementFee: string;
  acquisitionFee: string;
  dispositionFee: string;
  distributionFrequency: string;
  exitStrategy: string;
}

// Question categories for progress tracking
export type QuestionCategory =
  | 'site'
  | 'development'
  | 'market'
  | 'financials'
  | 'team'
  | 'terms';

export interface CategoryProgress {
  category: QuestionCategory;
  label: string;
  description: string;
  completed: boolean;
  current: boolean;
}

// Chat message type
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Application state
export interface AppState {
  // Branding
  brand: BrandConfig;
  setBrand: (brand: Partial<BrandConfig>) => void;

  // Project data
  projectData: Partial<ProjectData>;
  setProjectData: (data: Partial<ProjectData>) => void;

  // Chat
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;

  // Progress
  currentCategory: QuestionCategory;
  setCurrentCategory: (category: QuestionCategory) => void;
  completedCategories: QuestionCategory[];
  markCategoryComplete: (category: QuestionCategory) => void;

  // Generation
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  deckReady: boolean;
  setDeckReady: (ready: boolean) => void;

  // Reset
  reset: () => void;
}

// Slide content for generation
export interface SlideContent {
  type: 'cover' | 'executive' | 'opportunity' | 'market' | 'development' |
        'team' | 'financials' | 'structure' | 'useOfFunds' | 'exit';
  title?: string;
  subtitle?: string;
  content?: Record<string, unknown>;
}
