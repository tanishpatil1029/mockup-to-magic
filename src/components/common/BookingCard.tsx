
import React from "react";
import { Booking, ParkingSpot, Car, useParkingContext } from "@/context/ParkingContext";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface BookingCardProps {
  booking: Booking;
  showActions?: boolean;
}

const BookingCard = ({ booking, showActions = true }: BookingCardProps) => {
  const { parkingSpots, cars, cancelBooking } = useParkingContext();
  const navigate = useNavigate();
  
  const parkingSpot = parkingSpots.find((spot) => spot.id === booking.parkingSpotId) as ParkingSpot;
  const car = cars.find((car) => car.id === booking.carId) as Car;
  
  // Format dates
  const startTimeString = format(new Date(booking.startTime), "MMM d, h:mm a");
  const endTimeString = format(new Date(booking.endTime), "MMM d, h:mm a");

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "active":
        return "bg-primary/10 text-primary";
      case "upcoming":
        return "bg-blue-500/10 text-blue-500";
      case "completed":
        return "bg-gray-500/10 text-gray-500";
      case "cancelled":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const handleViewDetails = () => {
    navigate(`/booking/${booking.id}`);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    cancelBooking(booking.id);
  };

  return (
    <div 
      className="neo-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{parkingSpot.name}</h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{parkingSpot.location}</span>
            </div>
          </div>
          <div className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            getStatusColor(booking.status)
          )}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </div>
        </div>

        <div className="mt-3 p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: car.color }}></div>
              <span className="font-medium">{car.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">{car.licensePlate}</span>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{startTimeString}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{endTimeString}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-primary font-bold text-xl">${booking.totalPrice.toFixed(2)}</span>
            <span className="text-muted-foreground text-sm ml-1">total</span>
          </div>
          
          {showActions && booking.status !== "cancelled" && booking.status !== "completed" && (
            <button
              className="px-4 py-2 rounded-lg border border-red-500 text-red-500 font-medium text-sm transition-all hover:bg-red-500/10"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
