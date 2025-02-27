
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import ParkingMap from "@/components/common/ParkingMap";
import ParkingSpotCard from "@/components/common/ParkingSpot";
import { useParkingContext } from "@/context/ParkingContext";
import { useGoogleMaps, GoogleMapComponent } from "@/context/GoogleMapsContext";
import { Search, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const Home = () => {
  const { parkingSpots } = useParkingContext();
  const { markers, addMarker, clearMarkers } = useGoogleMaps();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // Filter parking spots based on search query
  const filteredSpots = parkingSpots.filter((spot) =>
    spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spot.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // When component mounts, clear existing markers and add markers for parking spots
    clearMarkers();
    
    // Add parking spots as markers (using mock coordinates for demonstration)
    filteredSpots.forEach((spot, index) => {
      // Generate some random coordinates around a center point for demo purposes
      const lat = 40.7128 + (Math.random() - 0.5) * 0.05;
      const lng = -74.0060 + (Math.random() - 0.5) * 0.05;
      
      addMarker({ lat, lng });
    });
  }, [filteredSpots, addMarker, clearMarkers]);

  // Convert parking spots to map markers
  const parkingMarkers = filteredSpots.map((spot, index) => {
    // Generate some random coordinates around a center point for demo
    const lat = 40.7128 + (Math.random() - 0.5) * 0.05;
    const lng = -74.0060 + (Math.random() - 0.5) * 0.05;
    
    return { lat, lng };
  });

  return (
    <div className="min-h-screen pb-16 bg-background">
      <Header title="Find Parking" />
      
      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search for parking..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center mb-4">
        <div className="bg-muted p-1 rounded-lg flex">
          <button
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              viewMode === "list"
                ? "bg-white dark:bg-gray-800 shadow-sm"
                : "text-muted-foreground"
            )}
            onClick={() => setViewMode("list")}
          >
            List
          </button>
          <button
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              viewMode === "map"
                ? "bg-white dark:bg-gray-800 shadow-sm"
                : "text-muted-foreground"
            )}
            onClick={() => setViewMode("map")}
          >
            Map
          </button>
        </div>
      </div>

      {/* Map View */}
      {viewMode === "map" && (
        <div className="px-4 mb-4">
          <GoogleMapComponent 
            markers={parkingMarkers} 
            className="h-[500px] rounded-xl mb-4" 
            zoom={14}
          />
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <>
          {/* Nearby Section */}
          <div className="px-4 mb-2">
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-lg font-semibold">Nearby Parking</h2>
            </div>
            
            {/* Map Preview */}
            <div className="h-[180px] rounded-xl mb-4 overflow-hidden">
              <GoogleMapComponent 
                markers={parkingMarkers.slice(0, 3)} 
                className="h-full w-full" 
                zoom={13}
              />
            </div>
            
            {/* Parking Spots List */}
            <div className="space-y-4 mt-6">
              {filteredSpots.filter(spot => spot.available).map((spot) => (
                <ParkingSpotCard key={spot.id} spot={spot} />
              ))}
              
              {filteredSpots.filter(spot => spot.available).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No available parking spots found</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Section */}
          <div className="px-4 mt-8">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-lg font-semibold">Recently Viewed</h2>
            </div>
            
            <div className="space-y-4">
              {parkingSpots.slice(0, 2).map((spot) => (
                <ParkingSpotCard key={spot.id} spot={spot} showDetails={false} />
              ))}
            </div>
          </div>
        </>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Home;
