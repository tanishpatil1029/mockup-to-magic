
import React from "react";
import { ParkingSpot as ParkingSpotType, useParkingContext } from "@/context/ParkingContext";
import { Calendar, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ParkingSpotCardProps {
  spot: ParkingSpotType;
  showDetails?: boolean;
}

const ParkingSpotCard = ({ spot, showDetails = true }: ParkingSpotCardProps) => {
  const { selectParkingSpot } = useParkingContext();
  const navigate = useNavigate();

  const handleSelect = () => {
    selectParkingSpot(spot);
    navigate(`/parking/${spot.id}`);
  };

  return (
    <div className="neo-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{spot.name}</h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{spot.location}</span>
            </div>
          </div>
          <div className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            spot.available 
              ? "bg-primary/10 text-primary" 
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          )}>
            {spot.available ? "Available" : "Occupied"}
          </div>
        </div>

        {showDetails && (
          <div className="flex justify-between items-center mt-4 mb-2">
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>24/7</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>All days</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {spot.distance}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-primary font-bold text-xl">${spot.price.toFixed(2)}</span>
            <span className="text-muted-foreground text-sm ml-1">/hr</span>
          </div>
          
          <button
            className={cn(
              "px-4 py-2 rounded-lg text-white font-medium text-sm transition-all",
              spot.available 
                ? "bg-primary hover:bg-primary/90" 
                : "bg-gray-400 cursor-not-allowed"
            )}
            onClick={handleSelect}
            disabled={!spot.available}
          >
            {spot.available ? "Book Now" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkingSpotCard;
