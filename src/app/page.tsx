'use client';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFudXMtZGVtbyIsImEiOiJjbTFqZjNqZjcwMGZnMmxzZGZqbGJhZGZuIn0.VGF3VGF3VGF3VGF3VGF3VGF3';

type Row = { id:string; name:string; score_traveler:number; score_policy:number; lng:number; lat:number };

export default function Page() {
  const mapRef = useRef<mapboxgl.Map|null>(null);
  const elRef = useRef<HTMLDivElement|null>(null);
  const [mode, setMode] = useState<'traveler'|'policy'>('traveler');
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
    map.on('load', () => addLayer(map, data, mode));

    mapRef.current = map;
    return () => map.remove();
  }, [elRef.current]);

  // Update data or mode
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    updateLayer(map, data, mode);
  }, [data, mode]);

  function colorExpr(field:string){
    return ['interpolate',['linear'],['get',field],
      0,'#ff3b3b', 50,'#ffd700', 75,'#00b7ff', 90,'#6e40c9'
    ] as any;
  }

  function addLayer(map: mapboxgl.Map, rows: Row[], mode: 'traveler'|'policy'){
    const features = rows.map(r=>({
      type:'Feature',
      properties: { name:r.name, score_traveler:r.score_traveler, score_policy:r.score_policy },
      geometry: { type:'Point', coordinates:[r.lng, r.lat] }
    }));
    const geojson = { type:'FeatureCollection', features } as any;
    if (!map.getSource('gqsi')) map.addSource('gqsi',{ type:'geojson', data: geojson });

    if (!map.getLayer('gqsi-circles')) {
      map.addLayer({
        id:'gqsi-circles',
        type:'circle',
        source:'gqsi',
        paint: {
          'circle-radius': ['interpolate',['linear'],['coalesce',['get', mode==='traveler'?'score_traveler':'score_policy'],0], 0,4, 100,12],
          'circle-color': colorExpr(mode==='traveler'?'score_traveler':'score_policy'),
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
      new mapboxgl.Popup({ offset:12 }).setLngLat(coords).setHTML(`
        <div style="font-family:Inter,system-ui,sans-serif">
          <div style="font-weight:700;margin-bottom:4px">${p.name}</div>
          <div style="font-size:13px">Traveler score: <b>${sTrav}</b></div>
          <div style="font-size:13px">Policy score: <b>${sPol}</b></div>
          <div style="opacity:.7;font-size:12px;margin-top:6px">Demo data for illustration.</div>
        </div>
      `).addTo(map);
    });

    map.on('mouseenter','gqsi-circles',()=>{ map.getCanvas().style.cursor='pointer'; });
    map.on('mouseleave','gqsi-circles',()=>{ map.getCanvas().style.cursor=''; });
  }

  function updateLayer(map: mapboxgl.Map, rows: Row[], mode: 'traveler'|'policy'){
    const src = map.getSource('gqsi') as mapboxgl.GeoJSONSource;
    if (src) {
      const features = rows.map(r=>({
        type:'Feature',
        properties: { name:r.name, score_traveler:r.score_traveler, score_policy:r.score_policy },
        geometry: { type:'Point', coordinates:[r.lng, r.lat] }
      }));
      src.setData({ type:'FeatureCollection', features } as any);
    }
    if (map.getLayer('gqsi-circles')) {
      map.setPaintProperty('gqsi-circles','circle-radius',
        ['interpolate',['linear'],['coalesce',['get', mode==='traveler'?'score_traveler':'score_policy'],0],0,4,100,12] as any
      );
      map.setPaintProperty('gqsi-circles','circle-color',
        colorExpr(mode==='traveler'?'score_traveler':'score_policy') as any
      );
    }
  }

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
              Explore sample safety scores for travelers and policy. This demo uses static data to illustrate
              the live experience. Hover a country dot or tap to see details.
            </p>
            <div className="controls" role="tablist" aria-label="View mode">
              <button className={"tab " + (mode==='traveler'?'active':'')} onClick={()=>setMode('traveler')} role="tab" aria-selected={mode==='traveler'}>Traveler View</button>
              <button className={"tab " + (mode==='policy'?'active':'')} onClick={()=>setMode('policy')} role="tab" aria-selected={mode==='policy'}>Policy View</button>
            </div>
            <div className="legend">
              <div className="dot" style={{background:'#ff3b3b'}}></div><span>Low</span>
              <div className="dot" style={{background:'#ffd700'}}></div><span>Medium</span>
              <div className="dot" style={{background:'#00b7ff'}}></div><span>High</span>
              <div className="dot" style={{background:'#6e40c9'}}></div><span>Very High</span>
            </div>
            <p className="notice">Demo-only data • GDPR-ready architecture in full product.</p>
          </div>
          <div>
            <div className="mapWrap">
              <div id="map" ref={elRef} className="map" />
            </div>
          </div>
        </section>
        <footer>
          © {new Date().getFullYear()} Vector for Good × IQSF — Demo. <small className="muted">Built with Mapbox GL JS.</small>
        </footer>
      </main>
    </>
  );
}
