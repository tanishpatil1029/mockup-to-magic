
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useParkingContext } from "@/context/ParkingContext";
import { useGoogleMaps, GoogleMapComponent } from "@/context/GoogleMapsContext";
import { Search, MapPin, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const MapPage = () => {
  const { parkingSpots } = useParkingContext();
  const { addMarker, clearMarkers } = useGoogleMaps();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null);
  
  // Filter parking spots based on search query
  const filteredSpots = parkingSpots.filter((spot) =>
    spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spot.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Clear existing markers
    clearMarkers();
    
    // Add parking spots as markers
    filteredSpots.forEach((spot) => {
      // Generate some random coordinates around a center point for demo
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

  const handleMarkerClick = (index: number) => {
    setSelectedSpot(index);
  };

  return (
    <div className="min-h-screen pb-16 bg-background">
      <Header title="Parking Map" />
      
      {/* Search Bar */}
      <div className="px-4 pt-2 pb-3">
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
      
      {/* Main Map */}
      <div className="relative h-[calc(100vh-180px)]">
        <GoogleMapComponent 
          markers={parkingMarkers} 
          className="h-full" 
          zoom={14}
          onClick={(e) => {
            if (e.latLng) {
              const clickedPosition = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
              };
              console.log("Clicked position:", clickedPosition);
              
              // Find the closest parking spot (in a real app, this would use actual coordinates)
              const index = Math.floor(Math.random() * filteredSpots.length);
              handleMarkerClick(index);
            }
          }}
        />
        
        {/* Selected Spot Info */}
        {selectedSpot !== null && selectedSpot < filteredSpots.length && (
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <Card className="shadow-lg animate-in fade-in slide-in-from-bottom-4">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{filteredSpots[selectedSpot].name}</h3>
                    <p className="text-muted-foreground text-sm">{filteredSpots[selectedSpot].location}</p>
                    <div className="flex items-center mt-2">
                      <span className="font-medium">${filteredSpots[selectedSpot].price.toFixed(2)}/hr</span>
                      <span className="mx-2">•</span>
                      <span className={filteredSpots[selectedSpot].available ? "text-green-500" : "text-red-500"}>
                        {filteredSpots[selectedSpot].available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => setSelectedSpot(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="default" className="w-full">Book Now</Button>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default MapPage;
