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
  safetyScore: number;
  legalStatus: string;
  marriageEquality: boolean;
  adoptionRights: boolean;
  discriminationProtections: boolean;
}

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFudXMtZGVtbyIsImEiOiJjbTFqZjNqZjcwMGZnMmxzZGZqbGJhZGZuIn0.VGF3VGF3VGF3VGF3VGF3VGF3'; // Demo token

export default function MapboxComponent() {
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 30,
    zoom: 2
  });
  
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const locations: Location[] = locationsData;

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      very_safe: '#22c55e',      // Green
      moderately_safe: '#84cc16', // Light green
      moderately_unsafe: '#f59e0b', // Orange
      unsafe: '#ef4444',         // Red
      very_unsafe: '#dc2626'     // Dark red
    };
    return colors[category] || '#6b7280';
  };

  const getSafetyLevel = (score: number) => {
    if (score >= 80) return 'Very Safe';
    if (score >= 60) return 'Moderately Safe';
    if (score >= 40) return 'Moderately Unsafe';
    if (score >= 20) return 'Unsafe';
    return 'Very Unsafe';
  };

  return (
    <div className="w-full h-screen relative">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
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
              className="w-8 h-8 rounded-full border-3 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-white font-bold text-xs"
              style={{ backgroundColor: getCategoryColor(location.category) }}
            >
              {location.safetyScore}
            </div>
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
            className="max-w-sm"
          >
            <div className="p-4">
              <h3 className="font-bold text-xl mb-2">{selectedLocation.name}</h3>
              <div className="mb-3">
                <div 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white mb-2"
                  style={{ backgroundColor: getCategoryColor(selectedLocation.category) }}
                >
                  Safety Score: {selectedLocation.safetyScore}/100
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Safety Level:</strong> {getSafetyLevel(selectedLocation.safetyScore)}
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-3">{selectedLocation.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Legal Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    selectedLocation.legalStatus === 'Full equality' ? 'bg-green-100 text-green-800' :
                    selectedLocation.legalStatus === 'Mixed protections' ? 'bg-yellow-100 text-yellow-800' :
                    selectedLocation.legalStatus === 'Limited protections' ? 'bg-orange-100 text-orange-800' :
                    selectedLocation.legalStatus === 'Decriminalized' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedLocation.legalStatus}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${selectedLocation.marriageEquality ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-xs">Marriage Equality</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${selectedLocation.adoptionRights ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-xs">Adoption Rights</span>
                  </div>
                  <div className="flex items-center col-span-2">
                    <span className={`w-3 h-3 rounded-full mr-2 ${selectedLocation.discriminationProtections ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-xs">Anti-Discrimination Laws</span>
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
        <h4 className="font-bold mb-3">Global Queer Safety Index</h4>
        {Object.entries({
          very_safe: 'Very Safe (80-100)',
          moderately_safe: 'Moderately Safe (60-79)',
          moderately_unsafe: 'Moderately Unsafe (40-59)',
          unsafe: 'Unsafe (20-39)',
          very_unsafe: 'Very Unsafe (0-19)'
        }).map(([category, label]) => (
          <div key={category} className="flex items-center mb-2">
            <div 
              className="w-4 h-4 rounded-full mr-3"
              style={{ backgroundColor: getCategoryColor(category) }}
            />
            <span className="text-sm">{label}</span>
          </div>
        ))}
      </div>

      {/* Country List */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-sm max-h-80 overflow-y-auto">
        <h4 className="font-bold mb-3">Countries ({locations.length})</h4>
        {locations
          .sort((a, b) => b.safetyScore - a.safetyScore)
          .map((location) => (
          <div 
            key={location.id}
            className="mb-2 p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => {
              setViewState({
                longitude: location.longitude,
                latitude: location.latitude,
                zoom: 5
              });
              setSelectedLocation(location);
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-3 flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: getCategoryColor(location.category) }}
                >
                  {location.safetyScore}
                </div>
                <span className="font-medium text-sm">{location.name}</span>
              </div>
              <span className="text-xs text-gray-500">{getSafetyLevel(location.safetyScore)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Title */}
      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-gray-800">Global Queer Safety Index</h1>
        <p className="text-sm text-gray-600 mt-1">Interactive map of LGBTQ+ safety worldwide</p>
      </div>
    </div>
  );
}
