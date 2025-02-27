
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useParkingContext, Booking } from "@/context/ParkingContext";
import BookingCard from "@/components/common/BookingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

const BookingsPage = () => {
  const { bookings } = useParkingContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Get bookings for the selected date
  const bookingsForDate = bookings.filter((booking) => 
    isSameDay(new Date(booking.startTime), selectedDate)
  );
  
  // Group bookings by status
  const activeBookings = bookings.filter((booking) => booking.status === "active");
  const upcomingBookings = bookings.filter((booking) => booking.status === "upcoming");
  const completedBookings = bookings.filter((booking) => booking.status === "completed");
  
  const navigateDate = (days: number) => {
    setSelectedDate(addDays(selectedDate, days));
  };
  
  const formatDateLabel = (date: Date) => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    
    if (isSameDay(date, today)) {
      return "Today";
    } else if (isSameDay(date, tomorrow)) {
      return "Tomorrow";
    } else {
      return format(date, "EEE, MMM d");
    }
  };
  
  return (
    <div className="min-h-screen pb-16 bg-background">
      <Header title="My Bookings" />
      
      <div className="p-4">
        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center border border-border hover:bg-muted transition-colors"
            onClick={() => navigateDate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-primary mr-2" />
            <span className="font-medium">{formatDateLabel(selectedDate)}</span>
          </div>
          
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center border border-border hover:bg-muted transition-colors"
            onClick={() => navigateDate(1)}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
            <TabsTrigger value="upcoming" className="flex-1">Upcoming</TabsTrigger>
            <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-0">
            <div className="space-y-4">
              {activeBookings.length > 0 ? (
                activeBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <p>No active bookings</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-0">
            <div className="space-y-4">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <p>No upcoming bookings</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <div className="space-y-4">
              {completedBookings.length > 0 ? (
                completedBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} showActions={false} />
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <p>No booking history</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default BookingsPage;
