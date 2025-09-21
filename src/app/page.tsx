'use client';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

// Set the access token
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

type Intersectional = {
  transgender: number;
  racial_minorities: number;
  religious_minorities: number;
  disabled: number;
  youth: number;
  elderly: number;
  rural: number;
  low_income: number;
};

type Row = { 
  id:string; 
  name:string; 
  score_traveler:number; 
  score_policy:number; 
  lng:number; 
  lat:number;
  intersectional: Intersectional;
};

export default function Page() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mode, setMode] = useState<'traveler'|'policy'|'intersectional'>('traveler');
  const [intersectionalCategory, setIntersectionalCategory] = useState<keyof Intersectional>('transgender');
  const [data, setData] = useState<Row[]>([]);

  // Load data
  useEffect(() => {
    fetch('/gqsi.json')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error loading data:', error));
  }, []);

  // Initialize map
  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [10, 20],
      zoom: 1.3
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update map when data or mode changes
  useEffect(() => {
    if (!map.current || !data.length) return;

    map.current.on('load', () => {
      updateMapData();
    });

    if (map.current.isStyleLoaded()) {
      updateMapData();
    }
  }, [data, mode, intersectionalCategory]);

  const updateMapData = () => {
    if (!map.current || !data.length) return;

    const scoreField = mode === 'intersectional' ? intersectionalCategory : 
                      mode === 'traveler' ? 'score_traveler' : 'score_policy';

    // Remove existing layers and sources
    if (map.current.getLayer('countries')) {
      map.current.removeLayer('countries');
    }
    if (map.current.getSource('countries')) {
      map.current.removeSource('countries');
    }

    // Create GeoJSON features
    const features = data.map(country => ({
      type: 'Feature' as const,
      properties: {
        name: country.name,
        score_traveler: country.score_traveler,
        score_policy: country.score_policy,
        current_score: mode === 'intersectional' ? country.intersectional[intersectionalCategory] :
                      mode === 'traveler' ? country.score_traveler : country.score_policy,
        ...country.intersectional
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [country.lng, country.lat]
      }
    }));

    // Add source
    map.current.addSource('countries', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: features
      }
    });

    // Add layer
    map.current.addLayer({
      id: 'countries',
      type: 'circle',
      source: 'countries',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'current_score'],
          0, 4,
          100, 12
        ],
        'circle-color': [
          'interpolate',
          ['linear'],
          ['get', 'current_score'],
          0, '#ff3b3b',
          50, '#ffd700',
          75, '#00b7ff',
          90, '#6e40c9'
        ],
        'circle-opacity': 0.85,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 1
      }
    });

    // Add click handler
    map.current.on('click', 'countries', (e) => {
      if (!e.features || !e.features[0]) return;
      
      const feature = e.features[0];
      const props = feature.properties;
      const coordinates = (feature.geometry as any).coordinates.slice();

      const intersectionalScores = Object.keys(data[0].intersectional).map(key => 
        `<div style="font-size:12px;display:flex;justify-content:space-between;margin:2px 0">
          <span>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
          <b>${props[key]}</b>
        </div>`
      ).join('');

      new mapboxgl.Popup({ offset: 15 })
        .setLngLat(coordinates)
        .setHTML(`
          <div style="font-family:Inter,system-ui,sans-serif;max-width:250px">
            <div style="font-weight:700;margin-bottom:8px;font-size:14px">${props.name}</div>
            <div style="font-size:13px;margin-bottom:4px">Traveler score: <b>${props.score_traveler}</b></div>
            <div style="font-size:13px;margin-bottom:8px">Policy score: <b>${props.score_policy}</b></div>
            <div style="border-top:1px solid #eee;padding-top:8px;margin-top:8px">
              <div style="font-weight:600;font-size:12px;margin-bottom:4px;color:#666">Intersectional Safety:</div>
              ${intersectionalScores}
            </div>
            <div style="opacity:.7;font-size:11px;margin-top:8px;font-style:italic">Demo data for illustration.</div>
          </div>
        `)
        .addTo(map.current!);
    });

    // Change cursor on hover
    map.current.on('mouseenter', 'countries', () => {
      if (map.current) map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', 'countries', () => {
      if (map.current) map.current.getCanvas().style.cursor = '';
    });
  };

  const intersectionalOptions: {key: keyof Intersectional, label: string}[] = [
    {key: 'transgender', label: 'Transgender'},
    {key: 'racial_minorities', label: 'Racial Minorities'},
    {key: 'religious_minorities', label: 'Religious Minorities'},
    {key: 'disabled', label: 'Disabled'},
    {key: 'youth', label: 'Youth (13-24)'},
    {key: 'elderly', label: 'Elderly (65+)'},
    {key: 'rural', label: 'Rural Areas'},
    {key: 'low_income', label: 'Low Income'}
  ];

  return (
    <>
      <header className="header">
        <div className="wrap">
          <img src="/logo.svg" className="logo" alt="Vector for Good logo"/>
          <a className="brand" href="#"><span>Vector for Good × IQSF</span></a>
          <span className="badge">GQSI Demo (static)</span>
          <div style={{marginLeft: 'auto'}}>
            <a className="button" href="mailto:invest@vectorforgood.org">Request Investor Deck</a>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <div>
            <h1 style={{margin:'0 0 8px'}}>Global Queer Safety Index</h1>
            <p style={{opacity:.85, lineHeight:1.5}}>
              Explore safety scores across different dimensions including intersectional identities. 
              This demo uses static data to illustrate the live experience with intersectionality analysis.
            </p>
            <div className="controls" role="tablist" aria-label="View mode">
              <button className={"tab " + (mode==='traveler'?'active':'')} onClick={()=>setMode('traveler')} role="tab" aria-selected={mode==='traveler'}>Traveler View</button>
              <button className={"tab " + (mode==='policy'?'active':'')} onClick={()=>setMode('policy')} role="tab" aria-selected={mode==='policy'}>Policy View</button>
              <button className={"tab " + (mode==='intersectional'?'active':'')} onClick={()=>setMode('intersectional')} role="tab" aria-selected={mode==='intersectional'}>Intersectional</button>
            </div>
            
            {mode === 'intersectional' && (
              <div style={{marginTop: '12px'}}>
                <label style={{fontSize: '12px', opacity: 0.8, display: 'block', marginBottom: '6px'}}>
                  Intersectional Identity:
                </label>
                <select 
                  value={intersectionalCategory} 
                  onChange={(e) => setIntersectionalCategory(e.target.value as keyof Intersectional)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,.2)',
                    background: 'rgba(255,255,255,.05)',
                    color: 'inherit',
                    fontSize: '12px'
                  }}
                >
                  {intersectionalOptions.map(option => (
                    <option key={option.key} value={option.key} style={{background: '#0b0b0d'}}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="legend">
              <div className="dot" style={{background:'#ff3b3b'}}></div><span>Low</span>
              <div className="dot" style={{background:'#ffd700'}}></div><span>Medium</span>
              <div className="dot" style={{background:'#00b7ff'}}></div><span>High</span>
              <div className="dot" style={{background:'#6e40c9'}}></div><span>Very High</span>
            </div>
            <p className="notice">
              {mode === 'intersectional' 
                ? `Showing safety scores for ${intersectionalOptions.find(o => o.key === intersectionalCategory)?.label} • Demo data`
                : 'Demo-only data • GDPR-ready architecture in full product.'
              }
            </p>
          </div>
          <div>
            <div className="mapWrap">
              <div ref={mapContainer} className="map" />
            </div>
          </div>
        </section>
        <footer>
          © {new Date().getFullYear()} Vector for Good × IQSF — Demo. <small className="muted">Built with Mapbox GL JS. Intersectionality data included.</small>
        </footer>
      </main>
    </>
  );
}
