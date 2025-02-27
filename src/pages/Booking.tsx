
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import { useParkingContext } from "@/context/ParkingContext";
import { ArrowRight, Calendar, Clock, MapPin, CreditCard, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import CarSelection from "@/components/common/CarSelection";
import { toast } from "sonner";

const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { parkingSpots, selectedCar, createBooking } = useParkingContext();
  
  // Get parking spot ID and times from URL parameters
  const spotId = searchParams.get("spotId") || "";
  const startTimeStr = searchParams.get("start") || "";
  const endTimeStr = searchParams.get("end") || "";
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  
  // Find the selected parking spot
  const parkingSpot = parkingSpots.find((spot) => spot.id === spotId);
  
  // Parse dates or use defaults
  const startTime = startTimeStr ? new Date(startTimeStr) : new Date();
  const endTime = endTimeStr ? new Date(endTimeStr) : new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
  
  // Calculate total duration and price
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  const totalPrice = parkingSpot ? parkingSpot.price * durationHours : 0;
  
  const handleConfirmBooking = () => {
    if (!parkingSpot || !selectedCar) {
      toast.error("Missing required information");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      try {
        const booking = createBooking({
          parkingSpotId: parkingSpot.id,
          carId: selectedCar.id,
          startTime,
          endTime,
          status: "active",
          totalPrice,
        });
        
        // Navigate to success page
        navigate(`/booking-success/${booking.id}`);
      } catch (error) {
        toast.error("Failed to create booking");
        setIsProcessing(false);
      }
    }, 1500);
  };
  
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
  
  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="Confirm Booking" />
      
      <div className="p-4">
        {/* Parking Spot Summary */}
        <div className="neo-card rounded-xl overflow-hidden mb-6">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{parkingSpot.name}</h3>
            <div className="flex items-center text-muted-foreground text-sm mb-4">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{parkingSpot.location}</span>
            </div>
            
            <div className="bg-muted p-3 rounded-lg flex justify-between items-center text-sm mb-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-xs text-muted-foreground mx-1 mt-0.5">
                  {startTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-xs text-muted-foreground mx-1 mt-0.5">
                  {endTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Duration</span>
              <span>{durationHours.toFixed(1)} hrs</span>
            </div>
          </div>
        </div>
        
        {/* Vehicle Selection */}
        <div className="neo-card rounded-xl overflow-hidden mb-6">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-4">Your Vehicle</h3>
            {selectedCar ? (
              <div className="bg-muted p-3 rounded-lg flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full mr-3" style={{ backgroundColor: selectedCar.color }}></div>
                  <div>
                    <p className="font-medium">{selectedCar.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedCar.licensePlate}</p>
                  </div>
                </div>
                <button 
                  className="text-primary text-sm" 
                  onClick={() => navigate(`/parking/${spotId}`)}
                >
                  Change
                </button>
              </div>
            ) : (
              <CarSelection />
            )}
          </div>
        </div>
        
        {/* Payment Method */}
        <div className="neo-card rounded-xl overflow-hidden mb-6">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
            
            <div className="space-y-3">
              <div
                className={cn(
                  "border rounded-lg p-3 flex justify-between items-center cursor-pointer transition-all",
                  paymentMethod === "card" 
                    ? "border-primary bg-primary/5" 
                    : "border-border"
                )}
                onClick={() => setPaymentMethod("card")}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Credit Card</p>
                    <p className="text-xs text-muted-foreground">****-1234</p>
                  </div>
                </div>
                
                {paymentMethod === "card" && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </div>
              
              <div
                className={cn(
                  "border rounded-lg p-3 flex justify-between items-center cursor-pointer transition-all",
                  paymentMethod === "paypal" 
                    ? "border-primary bg-primary/5" 
                    : "border-border"
                )}
                onClick={() => setPaymentMethod("paypal")}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">P</span>
                  </div>
                  <div>
                    <p className="font-medium">PayPal</p>
                    <p className="text-xs text-muted-foreground">user@example.com</p>
                  </div>
                </div>
                
                {paymentMethod === "paypal" && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Price Summary */}
        <div className="neo-card rounded-xl overflow-hidden mb-28">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-4">Price Details</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Parking Fee</span>
                <span>${parkingSpot.price.toFixed(2)} × {durationHours.toFixed(1)} hrs</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Service Fee</span>
                <span>$1.00</span>
              </div>
              
              <div className="border-t border-border my-2 pt-2"></div>
              
              <div className="flex justify-between items-center font-semibold">
                <span>Total</span>
                <span className="text-primary">${(totalPrice + 1).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Confirmation Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-muted-foreground">Total</span>
              <div>
                <span className="text-primary font-bold text-2xl">${(totalPrice + 1).toFixed(2)}</span>
              </div>
            </div>
            
            <button
              className={cn(
                "px-6 py-3 bg-primary text-white rounded-xl font-semibold transition-all",
                isProcessing 
                  ? "opacity-70 cursor-not-allowed" 
                  : "hover:bg-primary/90"
              )}
              onClick={handleConfirmBooking}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm & Pay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
