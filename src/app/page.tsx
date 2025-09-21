'use client';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFudXMtZGVtbyIsImEiOiJjbTFqZjNqZjcwMGZnMmxzZGZqbGJhZGZuIn0.VGF3VGF3VGF3VGF3VGF3VGF3';

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
  const mapRef = useRef<mapboxgl.Map|null>(null);
  const elRef = useRef<HTMLDivElement|null>(null);
  const [mode, setMode] = useState<'traveler'|'policy'|'intersectional'>('traveler');
  const [intersectionalCategory, setIntersectionalCategory] = useState<keyof Intersectional>('transgender');
  const [data, setData] = useState<Row[]>([]);

  useEffect(() => { fetch('/gqsi.json').then(r=>r.json()).then(setData); }, []);

  useEffect(() => {
    if (!elRef.current || !mapboxgl.accessToken) return;
    if (mapRef.current) return; // create once

    const map = new mapboxgl.Map({
      container: elRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [10, 20],
      zoom: 1.3
    });
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch:true }), 'top-right');
    map.on('load', () => addLayer(map, data, mode, intersectionalCategory));

    mapRef.current = map;
    return () => map.remove();
  }, [elRef.current]);

  // Update data or mode
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    updateLayer(map, data, mode, intersectionalCategory);
  }, [data, mode, intersectionalCategory]);

  function colorExpr(field:string){
    return ['interpolate',['linear'],['get',field],
      0,'#ff3b3b', 50,'#ffd700', 75,'#00b7ff', 90,'#6e40c9'
    ] as any;
  }

  function addLayer(map: mapboxgl.Map, rows: Row[], mode: 'traveler'|'policy'|'intersectional', intersectionalCat: keyof Intersectional){
    const features = rows.map(r=>({
      type:'Feature',
      properties: { 
        name:r.name, 
        score_traveler:r.score_traveler, 
        score_policy:r.score_policy,
        ...Object.fromEntries(Object.entries(r.intersectional).map(([k,v]) => [`intersectional_${k}`, v]))
      },
      geometry: { type:'Point', coordinates:[r.lng, r.lat] }
    }));
    const geojson = { type:'FeatureCollection', features } as any;
    if (!map.getSource('gqsi')) map.addSource('gqsi',{ type:'geojson', data: geojson });

    const scoreField = mode === 'intersectional' ? `intersectional_${intersectionalCat}` : 
                      mode === 'traveler' ? 'score_traveler' : 'score_policy';

    if (!map.getLayer('gqsi-circles')) {
      map.addLayer({
        id:'gqsi-circles',
        type:'circle',
        source:'gqsi',
        paint: {
          'circle-radius': ['interpolate',['linear'],['coalesce',['get', scoreField],0], 0,4, 100,12],
          'circle-color': colorExpr(scoreField),
          'circle-opacity': 0.85,
          'circle-stroke-color':'#ffffff',
          'circle-stroke-width':1
        }
      });
    }

    map.on('click','gqsi-circles',(e)=>{
      const f = e.features?.[0] as any; if (!f) return;
      const p = f.properties;
      const coords = f.geometry.coordinates.slice();
      const sTrav = p.score_traveler, sPol = p.score_policy;
      
      const intersectionalScores = Object.keys(rows[0].intersectional).map(key => 
        `<div style="font-size:12px;display:flex;justify-content:space-between;margin:2px 0">
          <span>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
          <b>${p[`intersectional_${key}`]}</b>
        </div>`
      ).join('');

      new mapboxgl.Popup({ offset:12 }).setLngLat(coords).setHTML(`
        <div style="font-family:Inter,system-ui,sans-serif;max-width:250px">
          <div style="font-weight:700;margin-bottom:8px;font-size:14px">${p.name}</div>
          <div style="font-size:13px;margin-bottom:4px">Traveler score: <b>${sTrav}</b></div>
          <div style="font-size:13px;margin-bottom:8px">Policy score: <b>${sPol}</b></div>
          <div style="border-top:1px solid #eee;padding-top:8px;margin-top:8px">
            <div style="font-weight:600;font-size:12px;margin-bottom:4px;color:#666">Intersectional Safety:</div>
            ${intersectionalScores}
          </div>
          <div style="opacity:.7;font-size:11px;margin-top:8px;font-style:italic">Demo data for illustration.</div>
        </div>
      `).addTo(map);
    });

    map.on('mouseenter','gqsi-circles',()=>{ map.getCanvas().style.cursor='pointer'; });
    map.on('mouseleave','gqsi-circles',()=>{ map.getCanvas().style.cursor=''; });
  }

  function updateLayer(map: mapboxgl.Map, rows: Row[], mode: 'traveler'|'policy'|'intersectional', intersectionalCat: keyof Intersectional){
    const src = map.getSource('gqsi') as mapboxgl.GeoJSONSource;
    if (src) {
      const features = rows.map(r=>({
        type:'Feature',
        properties: { 
          name:r.name, 
          score_traveler:r.score_traveler, 
          score_policy:r.score_policy,
          ...Object.fromEntries(Object.entries(r.intersectional).map(([k,v]) => [`intersectional_${k}`, v]))
        },
        geometry: { type:'Point', coordinates:[r.lng, r.lat] }
      }));
      src.setData({ type:'FeatureCollection', features } as any);
    }

    const scoreField = mode === 'intersectional' ? `intersectional_${intersectionalCat}` : 
                      mode === 'traveler' ? 'score_traveler' : 'score_policy';

    if (map.getLayer('gqsi-circles')) {
      map.setPaintProperty('gqsi-circles','circle-radius',
        ['interpolate',['linear'],['coalesce',['get', scoreField],0],0,4,100,12] as any
      );
      map.setPaintProperty('gqsi-circles','circle-color',
        colorExpr(scoreField) as any
      );
    }
  }

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
              <div id="map" ref={elRef} className="map" />
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
