# Investor Deck Generator

An AI-powered tool that creates professional investor pitch decks for real estate development projects. Built for sponsors and developers raising capital from Limited Partners.

## Features

- **Interactive Q&A**: AI investment analyst guides you through all necessary questions
- **Smart Data Extraction**: Automatically captures key metrics as you chat
- **Custom Branding**: Upload your logo and choose brand colors
- **Professional Output**: Generates polished 10-slide PowerPoint decks
- **Charts & Visualizations**: Includes financial charts, waterfalls, and data visualizations
- **Industry-Specific**: Tailored for healthcare real estate (SNF, ALF, RCFE)

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Anthropic API key.

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How It Works

1. **Upload Branding**: Add your company logo and select brand colors in the right panel
2. **Answer Questions**: The AI will guide you through 6 categories:
   - Site & Property details
   - Development plan
   - Market analysis
   - Financial projections
   - Team & track record
   - Deal terms & structure
3. **Generate Deck**: Once you've completed at least 3 sections, click "Generate Investor Deck"
4. **Download**: A professional .pptx file downloads automatically

## Deck Structure (10 Slides)

1. **Cover** - Project name, raise amount, location
2. **Executive Summary** - Investment highlights and key metrics
3. **The Opportunity** - Property and development details
4. **Market Analysis** - Demographics, competition, demand drivers
5. **Development Plan** - Timeline, phases, budget
6. **Team & Track Record** - Sponsor credentials and experience
7. **Financial Projections** - IRR, equity multiple, NOI growth chart
8. **Deal Structure** - Investment terms and waterfall
9. **Use of Funds** - Capital stack and allocation breakdown
10. **Exit Strategy & Next Steps** - Exit scenarios and call to action

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **PptxGenJS** - PowerPoint generation (client-side)
- **Anthropic Claude API** - AI conversation

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |

## Customization

### Adding New Question Categories

Edit `src/lib/questions.ts` to modify the AI's question flow and add new categories.

### Modifying Slide Templates

Edit `src/lib/deck-generator.ts` to customize slide layouts, charts, and content.

### Changing Color Presets

Edit `src/components/BrandingPanel.tsx` to add or modify color theme presets.

## License

MIT
