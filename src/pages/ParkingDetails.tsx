
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { useParkingContext } from "@/context/ParkingContext";
import { CalendarDays, Clock, MapPin, Info, Star, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import CarSelection from "@/components/common/CarSelection";
import { toast } from "sonner";

const ParkingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { parkingSpots, selectedCar } = useParkingContext();
  
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(
    new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // 2 hours later
  );

  const parkingSpot = parkingSpots.find((spot) => spot.id === id);

  if (!parkingSpot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Parking Spot Not Found</h2>
          <button 
            className="text-primary"
            onClick={() => navigate("/")}
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  // Calculate total duration in hours
  const durationMs = endDate.getTime() - startDate.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  const totalPrice = parkingSpot.price * durationHours;

  const handleBooking = () => {
    if (!selectedCar) {
      toast.error("Please select a car");
      return;
    }
    
    // Navigate to booking page with parking spot id
    navigate(`/booking/new?spotId=${parkingSpot.id}&start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
  };

  const handleTimeChange = (type: "start" | "end", hours: number) => {
    if (type === "start") {
      const newStart = new Date(startDate);
      newStart.setHours(newStart.getHours() + hours);
      
      // Don't allow start time to be after end time
      if (newStart < endDate) {
        setStartDate(newStart);
      }
    } else {
      const newEnd = new Date(endDate);
      newEnd.setHours(newEnd.getHours() + hours);
      
      // Don't allow end time to be before start time
      if (newEnd > startDate) {
        setEndDate(newEnd);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBack title={parkingSpot.name} />
      
      <div className="p-4">
        {/* Parking Spot Details */}
        <div className="neo-card rounded-xl overflow-hidden mb-6">
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{parkingSpot.name}</h2>
                <div className="flex items-center text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{parkingSpot.location}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-muted">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-muted">
                  <Star className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between text-sm mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Open 24/7</p>
                  <p className="text-muted-foreground text-xs">Always available</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2">
                  <Info className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Indoor Parking</p>
                  <p className="text-muted-foreground text-xs">Secure</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Price</span>
                <div>
                  <span className="text-primary font-bold text-xl">${parkingSpot.price.toFixed(2)}</span>
                  <span className="text-muted-foreground text-sm ml-1">/hr</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Distance</span>
                <span>{parkingSpot.distance}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Time Selection */}
        <div className="neo-card rounded-xl overflow-hidden mb-6">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-4">Select Time</h3>
            
            <div className="space-y-4">
              {/* Start Time */}
              <div>
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 text-primary mr-2" />
                  <span className="font-medium">Start Time</span>
                </div>
                
                <div className="flex items-center">
                  <button 
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center"
                    onClick={() => handleTimeChange("start", -1)}
                  >
                    -
                  </button>
                  
                  <div className="flex-1 text-center">
                    <div className="font-medium">
                      {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {startDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  
                  <button 
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center"
                    onClick={() => handleTimeChange("start", 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* End Time */}
              <div>
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 text-primary mr-2" />
                  <span className="font-medium">End Time</span>
                </div>
                
                <div className="flex items-center">
                  <button 
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center"
                    onClick={() => handleTimeChange("end", -1)}
                  >
                    -
                  </button>
                  
                  <div className="flex-1 text-center">
                    <div className="font-medium">
                      {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {endDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  
                  <button 
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center"
                    onClick={() => handleTimeChange("end", 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Duration */}
              <div className="bg-muted p-3 rounded-lg flex justify-between items-center">
                <span className="font-medium">Total Duration</span>
                <span>{durationHours.toFixed(1)} hrs</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Vehicle Selection */}
        <div className="neo-card rounded-xl overflow-hidden mb-6">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-4">Select Vehicle</h3>
            <CarSelection />
          </div>
        </div>
        
        {/* Bottom Booking Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-muted-foreground">Total Price</span>
              <div>
                <span className="text-primary font-bold text-2xl">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold transition-all hover:bg-primary/90"
              onClick={handleBooking}
            >
              Book Now
            </button>
          </div>
        </div>
        
        {/* Space to account for fixed bottom bar */}
        <div className="h-24"></div>
      </div>
    </div>
  );
};

export default ParkingDetails;
