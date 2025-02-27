
import React, { useEffect, useRef, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { ParkingSpot, useParkingContext } from "@/context/ParkingContext";
import { cn } from "@/lib/utils";

interface ParkingMapProps {
  interactive?: boolean;
  className?: string;
}

const ParkingMap = ({ interactive = true, className }: ParkingMapProps) => {
  const { parkingSpots, selectedParkingSpot, selectParkingSpot } = useParkingContext();
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulating map loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      ref={mapRef} 
      className={cn(
        "map-container w-full h-[300px] bg-gray-100 dark:bg-gray-800 overflow-hidden transition-all duration-500", 
        !isLoaded && "animate-pulse", 
        className
      )}
    >
      {/* Simulated map background */}
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 opacity-80">
        {/* Grid pattern for map */}
        <div className="w-full h-full grid grid-cols-8 grid-rows-8">
          {Array.from({ length: 64 }).map((_, index) => (
            <div 
              key={index}
              className="border border-gray-300/30 dark:border-gray-600/30"
            />
          ))}
        </div>
        
        {/* Roads */}
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-0 bottom-0 w-[10px] bg-gray-300 dark:bg-gray-600 transform -translate-x-1/2"></div>
          <div className="absolute top-1/2 left-0 right-0 h-[10px] bg-gray-300 dark:bg-gray-600 transform -translate-y-1/2"></div>
        </div>
      </div>

      {/* User location */}
      <div className="absolute left-1/2 bottom-1/3 transform -translate-x-1/2">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75" style={{ width: '16px', height: '16px' }}></div>
          <div className="relative z-10 bg-blue-500 rounded-full p-1">
            <Navigation className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      {/* Parking spots pins */}
      {isLoaded && parkingSpots.map((spot) => (
        <ParkingPin 
          key={spot.id}
          spot={spot}
          isSelected={selectedParkingSpot?.id === spot.id}
          onClick={() => interactive && selectParkingSpot(spot)}
          style={{
            left: `${30 + Math.random() * 40}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
        />
      ))}
    </div>
  );
};

interface ParkingPinProps {
  spot: ParkingSpot;
  isSelected: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}

const ParkingPin = ({ spot, isSelected, onClick, style }: ParkingPinProps) => {
  return (
    <div 
      className={cn(
        "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300",
        isSelected ? "z-20 scale-125" : "z-10 hover:scale-110"
      )}
      style={style}
      onClick={onClick}
    >
      <div className={cn(
        "p-1 rounded-full shadow-md",
        spot.available 
          ? "bg-primary text-white" 
          : "bg-gray-400 dark:bg-gray-600 text-white"
      )}>
        <MapPin className="h-5 w-5" />
      </div>
      
      {isSelected && (
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 text-xs w-32 text-center animate-fade-in">
          <p className="font-medium text-sm">{spot.name}</p>
          <p className="text-muted-foreground">${spot.price.toFixed(2)}/hr</p>
        </div>
      )}
    </div>
  );
};

export default ParkingMap;
