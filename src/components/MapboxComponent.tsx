'use client';

import React, { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import locationsData from '../data/locations.json';

interface Location {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
}

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFudXMtZGVtbyIsImEiOiJjbTFqZjNqZjcwMGZnMmxzZGZqbGJhZGZuIn0.VGF3VGF3VGF3VGF3VGF3VGF3'; // Demo token

export default function MapboxComponent() {
  const [viewState, setViewState] = useState({
    longitude: -73.9654,
    latitude: 40.7829,
    zoom: 11
  });
  
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const locations: Location[] = locationsData;

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      park: '#22c55e',
      landmark: '#ef4444',
      bridge: '#3b82f6',
      monument: '#8b5cf6',
      building: '#f59e0b'
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div className="w-full h-screen relative">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            longitude={location.longitude}
            latitude={location.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedLocation(location);
            }}
          >
            <div 
              className="w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: getCategoryColor(location.category) }}
            />
          </Marker>
        ))}

        {selectedLocation && (
          <Popup
            longitude={selectedLocation.longitude}
            latitude={selectedLocation.latitude}
            anchor="top"
            onClose={() => setSelectedLocation(null)}
            closeButton={true}
            closeOnClick={false}
            className="max-w-xs"
          >
            <div className="p-3">
              <h3 className="font-bold text-lg mb-2">{selectedLocation.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{selectedLocation.description}</p>
              <span 
                className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: getCategoryColor(selectedLocation.category) }}
              >
                {selectedLocation.category}
              </span>
            </div>
          </Popup>
        )}
      </Map>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
        <h4 className="font-bold mb-2">Categories</h4>
        {Object.entries({
          park: 'Parks',
          landmark: 'Landmarks', 
          bridge: 'Bridges',
          monument: 'Monuments',
          building: 'Buildings'
        }).map(([category, label]) => (
          <div key={category} className="flex items-center mb-1">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: getCategoryColor(category) }}
            />
            <span className="text-sm">{label}</span>
          </div>
        ))}
      </div>

      {/* Location List */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-sm max-h-64 overflow-y-auto">
        <h4 className="font-bold mb-2">Locations ({locations.length})</h4>
        {locations.map((location) => (
          <div 
            key={location.id}
            className="mb-2 p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => {
              setViewState({
                longitude: location.longitude,
                latitude: location.latitude,
                zoom: 14
              });
              setSelectedLocation(location);
            }}
          >
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: getCategoryColor(location.category) }}
              />
              <span className="font-medium text-sm">{location.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
