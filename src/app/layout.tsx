import './styles.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'GQSI Demo — Vector for Good × IQSF',
  description: 'Interactive demo of the Global Queer Safety Index (static sample data).'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.5.1/mapbox-gl.css" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
