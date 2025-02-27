
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useParkingContext } from "@/context/ParkingContext";
import { CheckCircle, ArrowRight, MapPin, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const BookingSuccess = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { bookings, parkingSpots, cars } = useParkingContext();
  
  // Find the booking
  const booking = bookings.find((b) => b.id === id);
  
  // Get parking spot and car details
  const parkingSpot = booking 
    ? parkingSpots.find((spot) => spot.id === booking.parkingSpotId) 
    : undefined;
  
  const car = booking 
    ? cars.find((c) => c.id === booking.carId) 
    : undefined;
  
  useEffect(() => {
    // If booking not found, redirect to home
    if (!booking || !parkingSpot || !car) {
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [booking, parkingSpot, car, navigate]);
  
  if (!booking || !parkingSpot || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Booking Not Found</h2>
          <p className="text-muted-foreground mb-4">Redirecting to home...</p>
        </div>
      </div>
    );
  }
  
  // Format dates
  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);
  
  const dateFormatted = format(startDate, "MMMM d, yyyy");
  const startTimeFormatted = format(startDate, "h:mm a");
  const endTimeFormatted = format(endDate, "h:mm a");
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="animate-scale-up w-full max-w-md">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground text-center mb-8">Your parking spot has been reserved successfully.</p>
          
          {/* Booking Card */}
          <div className="neo-card rounded-xl overflow-hidden mb-6 divide-y divide-border">
            {/* Parking Spot Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg">{parkingSpot.name}</h3>
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{parkingSpot.location}</span>
              </div>
            </div>
            
            {/* Date & Time */}
            <div className="p-4">
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 text-primary mr-2" />
                <span className="font-medium">{dateFormatted}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                  <span>{startTimeFormatted}</span>
                </div>
                
                <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                  <span>{endTimeFormatted}</span>
                </div>
              </div>
            </div>
            
            {/* Vehicle Info */}
            <div className="p-4">
              <h4 className="font-medium mb-2">Vehicle</h4>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full mr-2" style={{ backgroundColor: car.color }}></div>
                <div>
                  <p className="font-medium">{car.name}</p>
                  <p className="text-sm text-muted-foreground">{car.licensePlate}</p>
                </div>
              </div>
            </div>
            
            {/* Booking ID & Price */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-mono text-sm">{booking.id.substring(0, 8)}</span>
              </div>
              
              <div className="flex justify-between items-center font-semibold">
                <span>Total Paid</span>
                <span className="text-primary">${booking.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex flex-col space-y-3">
            <button
              className="w-full bg-primary text-white rounded-xl py-3 font-semibold transition-all hover:bg-primary/90"
              onClick={() => navigate("/bookings")}
            >
              View My Bookings
            </button>
            
            <button
              className="w-full bg-transparent border border-border rounded-xl py-3 font-semibold transition-all hover:bg-muted"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
