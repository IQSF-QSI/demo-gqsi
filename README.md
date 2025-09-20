# Next.js Mapbox Demo Application

A modern, interactive one-page Next.js application featuring a Mapbox component with static JSON data visualization.

## 🚀 Live Demo

**Deployed on Vercel**: [Coming Soon]

## 📍 Features

- **Interactive Map**: Built with Mapbox GL JS and react-map-gl
- **Static Data Integration**: JSON-based location data with 5 NYC landmarks
- **Category-based Visualization**: Color-coded markers for different location types
- **Interactive UI Elements**:
  - Clickable markers with detailed popups
  - Category legend with color indicators
  - Location list panel for easy navigation
  - Smooth hover effects and transitions
- **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS

## 🛠 Technology Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: Mapbox GL JS + react-map-gl
- **Deployment**: Vercel
- **Package Manager**: npm

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

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Vercel (Recommended)

This application is optimized for Vercel deployment:

1. **Connect Repository**: Import the GitHub repository to Vercel
2. **Configure Settings**: Vercel will auto-detect Next.js settings
3. **Deploy**: Automatic deployment on every push to main branch

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

## 📍 Sample Data

The application displays 5 iconic New York City locations:

1. **Central Park** (Park) - Large public park in Manhattan
2. **Times Square** (Landmark) - Major commercial intersection
3. **Brooklyn Bridge** (Bridge) - Historic suspension bridge
4. **Statue of Liberty** (Monument) - Iconic symbol of freedom
5. **Empire State Building** (Building) - Art Deco skyscraper

## 🎨 Customization

- **Add Locations**: Modify `src/data/locations.json`
- **Change Colors**: Update the `getCategoryColor` function
- **Modify Styling**: Edit Tailwind classes in components
- **Add Features**: Extend the MapboxComponent with additional functionality

## 🗺 Mapbox Configuration

The application uses a demo Mapbox token. For production:

1. Create account at [mapbox.com](https://mapbox.com)
2. Generate access token
3. Replace token in `MapboxComponent.tsx`
4. Use environment variables: `NEXT_PUBLIC_MAPBOX_TOKEN`

## 📱 Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Repository**: https://github.com/IQSF-QSI/demo-gqsi
- **Live Demo**: [Vercel Deployment URL]
- **Documentation**: [Project Wiki]
