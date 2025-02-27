import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';

interface MapContextType {
  isLoaded: boolean;
  center: google.maps.LatLngLiteral;
  setCenter: (center: google.maps.LatLngLiteral) => void;
  markers: google.maps.LatLngLiteral[];
  addMarker: (position: google.maps.LatLngLiteral) => void;
  clearMarkers: () => void;
  getUserLocation: () => Promise<google.maps.LatLngLiteral | null>;
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

  const getUserLocation = (): Promise<google.maps.LatLngLiteral | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log("Geolocation is not supported by this browser.");
        resolve(null);
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          resolve(userLocation);
        },
        (error) => {
          console.error("Error getting location:", error.message);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  };

  useEffect(() => {
    // Try to get user's location when the component mounts
    getUserLocation().then(location => {
      if (location) {
        setCenter(location);
      }
    });
  }, []);

  const addMarker = (position: google.maps.LatLngLiteral) => {
    setMarkers(prevMarkers => [...prevMarkers, position]);
  };

  const clearMarkers = () => {
    setMarkers([]);
  };

  return (
    <MapContext.Provider
      value={{
        isLoaded,
        center,
        setCenter,
        markers,
        addMarker,
        clearMarkers,
        getUserLocation
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
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const { getUserLocation } = useGoogleMaps();
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [localCenter, setLocalCenter] = useState(center);

  useEffect(() => {
    // If center prop changes, update localCenter
    setLocalCenter(center);
  }, [center]);

  useEffect(() => {
    // Try to get user's location when the component mounts
    getUserLocation().then(location => {
      if (location) {
        setUserLocation(location);
        setLocalCenter(location);
      }
    });
  }, [getUserLocation]);

  const handleMapLoad = () => {
    console.log("Google Maps loaded successfully");
    setIsMapLoaded(true);
  };

  const handleMapError = (error: Error) => {
    console.error("Error loading Google Maps:", error);
    setMapError("Failed to load map. Please try again later.");
  };

  return (
    <div className={`relative ${className}`} style={{ minHeight: '300px' }}>
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
          <p className="text-muted-foreground">{mapError}</p>
        </div>
      )}
      
      {!isMapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} onLoad={handleMapLoad} onError={handleMapError}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={localCenter}
          zoom={zoom}
          onClick={onClick}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControl: true,
          }}
        >
          {/* User's current location marker */}
          {userLocation && (
            <MarkerF 
              position={userLocation} 
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
              }}
            />
          )}
          
          {/* Other markers */}
          {markers.map((marker, index) => (
            <MarkerF key={index} position={marker} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};
