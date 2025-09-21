# Global Queer Safety Index (GQSI) - Interactive Map

An interactive Next.js application visualizing the Global Queer Safety Index data across countries worldwide, providing comprehensive LGBTQ+ safety information through an intuitive map interface.

## 🏳️‍🌈 Live Demo

**Deployed on Vercel**: [Coming Soon]

## 📊 Features

- **Interactive World Map**: Built with Mapbox GL JS displaying global LGBTQ+ safety data
- **Safety Scoring System**: Countries rated 0-100 based on comprehensive safety metrics
- **Legal Status Indicators**: Visual representation of marriage equality, adoption rights, and anti-discrimination protections
- **Color-coded Safety Levels**:
  - 🟢 Very Safe (80-100): Comprehensive protections and equality
  - 🟡 Moderately Safe (60-79): Good protections with some gaps
  - 🟠 Moderately Unsafe (40-59): Limited protections, mixed safety
  - 🔴 Unsafe (20-39): Poor protections, significant risks
  - ⚫ Very Unsafe (0-19): Criminalization and severe persecution

## 🌍 Current Data Coverage

The application currently displays safety data for 10 countries representing different safety levels:

### Very Safe (80-100)
- **Netherlands** (95) - Comprehensive LGBTQ+ rights since 2001
- **Canada** (92) - Strong federal protections and equality
- **Sweden** (90) - Progressive policies and hate crime protections
- **Germany** (88) - Marriage equality and constitutional protections
- **Australia** (85) - Comprehensive federal protections

### Moderately Safe (60-79)
- **United States** (72) - Federal marriage equality, varying state protections

### Moderately Unsafe (40-59)
- **Brazil** (45) - Marriage equality but high violence rates
- **India** (38) - Decriminalized in 2018, limited broader protections

### Unsafe (20-39)
- **Russia** (25) - Anti-LGBTQ+ propaganda laws, hostile environment

### Very Unsafe (0-19)
- **Uganda** (10) - Criminalization with severe penalties

## 🛠 Technology Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: Mapbox GL JS + react-map-gl
- **Deployment**: Vercel
- **Data Format**: JSON-based country safety profiles

## 🏗 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/IQSF-QSI/demo-gqsi.git
cd demo-gqsi

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the Global Queer Safety Index map.

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📊 Data Structure

Each country entry includes:

```json
{
  "id": 1,
  "name": "Country Name",
  "description": "Brief safety overview",
  "latitude": 0.0,
  "longitude": 0.0,
  "category": "very_safe|moderately_safe|moderately_unsafe|unsafe|very_unsafe",
  "safetyScore": 95,
  "legalStatus": "Full equality|Mixed protections|Limited protections|Decriminalized|Hostile|Criminalized",
  "marriageEquality": true,
  "adoptionRights": true,
  "discriminationProtections": true
}
```

## 🚀 Deployment

### Vercel (Recommended)

This application is optimized for Vercel deployment:

1. **Connect Repository**: Import the GitHub repository to Vercel
2. **Configure Settings**: Vercel auto-detects Next.js settings
3. **Deploy**: Automatic deployment on every push to main branch

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

## 🎨 Interactive Features

- **Country Markers**: Click on country markers to view detailed safety information
- **Safety Score Display**: Each marker shows the country's safety score (0-100)
- **Detailed Popups**: Comprehensive information including legal status and specific rights
- **Sortable Country List**: Countries ranked by safety score for easy comparison
- **Zoom Navigation**: Click countries in the list to zoom to their location
- **Color-coded Legend**: Visual guide to safety levels

## 🗺 Mapbox Configuration

The application uses a demo Mapbox token. For production:

1. Create account at [mapbox.com](https://mapbox.com)
2. Generate access token
3. Replace token in `MapboxComponent.tsx`
4. Use environment variables: `NEXT_PUBLIC_MAPBOX_TOKEN`

## 📈 Future Enhancements

- **Real-time Data Integration**: Connect to live GQSI database
- **Historical Trends**: Show safety score changes over time
- **Detailed Metrics**: Breakdown of individual safety factors
- **User Contributions**: Community-driven safety reports
- **Mobile Optimization**: Enhanced mobile experience
- **Accessibility Features**: Screen reader support and keyboard navigation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/safety-enhancement`)
3. Commit changes (`git commit -m 'Add safety enhancement'`)
4. Push to branch (`git push origin feature/safety-enhancement`)
5. Open Pull Request

## 📄 Data Sources

This demonstration uses sample data for visualization purposes. The actual Global Queer Safety Index would incorporate:

- Legal framework analysis
- Social acceptance surveys
- Hate crime statistics
- Healthcare access data
- Economic discrimination measures
- Government policy assessments

## 🔗 Links

- **Repository**: https://github.com/IQSF-QSI/demo-gqsi
- **Live Demo**: [Vercel Deployment URL]
- **IQSF Organization**: [IQSF Website]

## 📱 Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

---

**Global Queer Safety Index** - Empowering LGBTQ+ individuals with data-driven safety information worldwide.
