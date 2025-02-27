
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';

interface MapContextType {
  isLoaded: boolean;
  center: google.maps.LatLngLiteral;
  setCenter: (center: google.maps.LatLngLiteral) => void;
  markers: google.maps.LatLngLiteral[];
  addMarker: (position: google.maps.LatLngLiteral) => void;
  clearMarkers: () => void;
}

const defaultCenter: google.maps.LatLngLiteral = {
  lat: 40.7128,
  lng: -74.0060
};

const MapContext = createContext<MapContextType | undefined>(undefined);

// Substitute with your actual API key
const GOOGLE_MAPS_API_KEY = "";

export const GoogleMapsProvider = ({ children }: { children: ReactNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(defaultCenter);
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);

  const addMarker = (position: google.maps.LatLngLiteral) => {
    setMarkers(prevMarkers => [...prevMarkers, position]);
  };

  const clearMarkers = () => {
    setMarkers([]);
  };

  const handleLoad = () => {
    setIsLoaded(true);
    
    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(userLocation);
        },
        () => {
          console.log("Error getting location or permission denied");
        }
      );
    }
  };

  return (
    <MapContext.Provider
      value={{
        isLoaded,
        center,
        setCenter,
        markers,
        addMarker,
        clearMarkers
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useGoogleMaps = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};

const containerStyle = {
  width: '100%',
  height: '100%'
};

interface GoogleMapComponentProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  markers?: google.maps.LatLngLiteral[];
  onClick?: (e: google.maps.MapMouseEvent) => void;
  className?: string;
}

export const GoogleMapComponent = ({
  center = defaultCenter,
  zoom = 12,
  markers = [],
  onClick,
  className = ''
}: GoogleMapComponentProps) => {
  // Create a local handleLoad function
  const handleMapLoad = () => {
    console.log("Google Maps loaded successfully");
  };

  return (
    <div className={`relative ${className}`} style={{ minHeight: '300px' }}>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} onLoad={handleMapLoad}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          onClick={onClick}
        >
          {markers.map((marker, index) => (
            <MarkerF key={index} position={marker} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};
