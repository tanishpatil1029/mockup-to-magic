
import React, { createContext, useContext, useState } from "react";

// Types
export interface Car {
  id: string;
  name: string;
  licensePlate: string;
  color: string;
  type: "sedan" | "suv" | "hatchback";
}

export interface ParkingSpot {
  id: string;
  name: string;
  location: string;
  price: number;
  distance: string;
  available: boolean;
  image?: string;
  coordinates: { lat: number; lng: number };
}

export interface Booking {
  id: string;
  parkingSpotId: string;
  carId: string;
  startTime: Date;
  endTime: Date;
  status: "active" | "upcoming" | "completed" | "cancelled";
  totalPrice: number;
}

interface ParkingContextType {
  cars: Car[];
  selectedCar: Car | null;
  parkingSpots: ParkingSpot[];
  bookings: Booking[];
  selectedParkingSpot: ParkingSpot | null;
  selectCar: (car: Car) => void;
  addCar: (car: Car) => void;
  removeCar: (carId: string) => void;
  selectParkingSpot: (spot: ParkingSpot) => void;
  createBooking: (booking: Omit<Booking, "id">) => Booking;
  cancelBooking: (bookingId: string) => void;
}

// Initial mock data
const initialCars: Car[] = [
  {
    id: "1",
    name: "My Tesla",
    licensePlate: "ABC 123",
    color: "#FFFFFF",
    type: "sedan",
  },
  {
    id: "2",
    name: "Family SUV",
    licensePlate: "XYZ 789",
    color: "#000000",
    type: "suv",
  },
];

const initialParkingSpots: ParkingSpot[] = [
  {
    id: "1",
    name: "Central Parking",
    location: "123 Main St",
    price: 5.50,
    distance: "0.5 km",
    available: true,
    coordinates: { lat: 40.7128, lng: -74.0060 },
  },
  {
    id: "2",
    name: "Downtown Garage",
    location: "456 Park Ave",
    price: 7.25,
    distance: "1.2 km",
    available: true,
    coordinates: { lat: 40.7135, lng: -74.0046 },
  },
  {
    id: "3",
    name: "Plaza Parking",
    location: "789 Broadway",
    price: 4.75,
    distance: "0.8 km",
    available: false,
    coordinates: { lat: 40.7110, lng: -74.0070 },
  },
];

const initialBookings: Booking[] = [
  {
    id: "1",
    parkingSpotId: "1",
    carId: "1",
    startTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    endTime: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
    status: "active",
    totalPrice: 11.00,
  },
];

// Create context
export const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

// Provider component
export const ParkingProvider = ({ children }: { children: React.ReactNode }) => {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [selectedCar, setSelectedCar] = useState<Car | null>(initialCars[0]);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(initialParkingSpots);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [selectedParkingSpot, setSelectedParkingSpot] = useState<ParkingSpot | null>(null);

  // Select a car
  const selectCar = (car: Car) => {
    setSelectedCar(car);
  };

  // Add a new car
  const addCar = (car: Car) => {
    setCars([...cars, car]);
  };

  // Remove a car
  const removeCar = (carId: string) => {
    setCars(cars.filter((car) => car.id !== carId));
    if (selectedCar?.id === carId) {
      setSelectedCar(cars.length > 0 ? cars[0] : null);
    }
  };

  // Select a parking spot
  const selectParkingSpot = (spot: ParkingSpot) => {
    setSelectedParkingSpot(spot);
  };

  // Create a new booking
  const createBooking = (bookingData: Omit<Booking, "id">) => {
    const newBooking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
    };
    
    setBookings([...bookings, newBooking]);
    
    // Update parking spot availability
    setParkingSpots(
      parkingSpots.map((spot) =>
        spot.id === bookingData.parkingSpotId ? { ...spot, available: false } : spot
      )
    );
    
    return newBooking;
  };

  // Cancel a booking
  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    
    if (booking) {
      // Update booking status
      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" as const } : b
        )
      );
      
      // Make the parking spot available again
      setParkingSpots(
        parkingSpots.map((spot) =>
          spot.id === booking.parkingSpotId ? { ...spot, available: true } : spot
        )
      );
    }
  };

  return (
    <ParkingContext.Provider
      value={{
        cars,
        selectedCar,
        parkingSpots,
        bookings,
        selectedParkingSpot,
        selectCar,
        addCar,
        removeCar,
        selectParkingSpot,
        createBooking,
        cancelBooking,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

// Custom hook for using the context
export const useParkingContext = () => {
  const context = useContext(ParkingContext);
  
  if (context === undefined) {
    throw new Error("useParkingContext must be used within a ParkingProvider");
  }
  
  return context;
};
