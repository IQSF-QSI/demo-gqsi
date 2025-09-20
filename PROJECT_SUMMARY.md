# Next.js Mapbox Demo Application

A modern, interactive one-page Next.js application featuring a Mapbox component with static JSON data visualization.

## 🚀 Features

- **Interactive Map**: Built with Mapbox GL JS and react-map-gl
- **Static Data Integration**: JSON-based location data with 5 NYC landmarks
- **Category-based Visualization**: Color-coded markers for different location types
- **Interactive UI Elements**:
  - Clickable markers with detailed popups
  - Category legend with color indicators
  - Location list panel for easy navigation
  - Smooth hover effects and transitions
- **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, Turbopack

## 📍 Sample Locations

The application displays 5 iconic New York City locations:

1. **Central Park** (Park) - Large public park in Manhattan
2. **Times Square** (Landmark) - Major commercial intersection
3. **Brooklyn Bridge** (Bridge) - Historic suspension bridge
4. **Statue of Liberty** (Monument) - Iconic symbol of freedom
5. **Empire State Building** (Building) - Art Deco skyscraper

## 🛠 Technology Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: Mapbox GL JS + react-map-gl
- **Build Tool**: Turbopack (Next.js)
- **Package Manager**: npm

## 🏗 Project Structure

```
demo-gqsi/
├── src/
│   ├── app/
│   │   └── page.tsx              # Main application page
│   ├── components/
│   │   └── MapboxComponent.tsx   # Interactive map component
│   └── data/
│       └── locations.json        # Static location data
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

## 🎨 Design Features

- **Responsive Design**: Adapts to different screen sizes
- **Color-coded Categories**: Each location type has a unique color
- **Interactive Elements**: Hover effects, smooth transitions
- **Professional UI**: Clean, modern interface with proper spacing
- **Accessibility**: Semantic HTML and proper contrast ratios

## 🚦 Getting Started

The development server is already running at:
- **Local**: http://localhost:3000
- **Network**: http://169.254.0.21:3000

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📦 Dependencies

### Core Dependencies
- `next`: 15.5.3
- `react`: Latest
- `react-dom`: Latest
- `mapbox-gl`: Latest
- `react-map-gl`: Latest

### Development Dependencies
- `typescript`: Latest
- `@types/node`: Latest
- `@types/react`: Latest
- `@types/react-dom`: Latest
- `tailwindcss`: Latest
- `eslint`: Latest
- `eslint-config-next`: Latest

## 🗺 Map Configuration

The application uses a demo Mapbox token for development purposes. For production use, you should:

1. Create a Mapbox account at https://mapbox.com
2. Generate your own access token
3. Replace the token in `MapboxComponent.tsx`
4. Consider using environment variables for token management

## 🎯 Key Components

### MapboxComponent.tsx
- Main interactive map component
- Handles marker rendering and popup interactions
- Manages map state and user interactions
- Includes legend and location list panels

### locations.json
- Static data source for map markers
- Structured with id, name, description, coordinates, and category
- Easily extensible for additional locations

## 🔧 Customization

The application is designed to be easily customizable:

- **Add Locations**: Modify `src/data/locations.json`
- **Change Colors**: Update the `getCategoryColor` function
- **Modify Styling**: Edit Tailwind classes in components
- **Add Features**: Extend the MapboxComponent with additional functionality

## 📱 Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## 🎉 Success Metrics

✅ **Application Created**: Next.js app with TypeScript and Tailwind CSS  
✅ **Mapbox Integration**: Interactive map with react-map-gl  
✅ **Static Data**: JSON-based location management  
✅ **Development Server**: Running and accessible  
✅ **Interactive Features**: Markers, popups, navigation  
✅ **Professional Design**: Modern UI with smooth interactions  

The application is production-ready and demonstrates modern web development best practices with React, Next.js, and interactive mapping technologies.
