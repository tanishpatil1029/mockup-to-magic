
import React from "react";
import { Car, useParkingContext } from "@/context/ParkingContext";
import { Check, Car as CarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarSelectionProps {
  horizontal?: boolean;
}

const CarSelection = ({ horizontal = false }: CarSelectionProps) => {
  const { cars, selectedCar, selectCar } = useParkingContext();

  return (
    <div className={cn(
      "w-full",
      horizontal ? "flex overflow-x-auto no-scrollbar space-x-4 py-2 px-1" : "space-y-4"
    )}>
      {cars.map((car) => (
        <CarCard
          key={car.id}
          car={car}
          isSelected={selectedCar?.id === car.id}
          onSelect={() => selectCar(car)}
          horizontal={horizontal}
        />
      ))}
    </div>
  );
};

interface CarCardProps {
  car: Car;
  isSelected: boolean;
  onSelect: () => void;
  horizontal?: boolean;
}

const CarCard = ({ car, isSelected, onSelect, horizontal }: CarCardProps) => {
  return (
    <div
      className={cn(
        "relative rounded-xl transition-all duration-300 cursor-pointer overflow-hidden",
        isSelected 
          ? "border-2 border-primary ring-2 ring-primary/30" 
          : "border border-border",
        horizontal 
          ? "min-w-[200px] flex-shrink-0" 
          : "w-full"
      )}
      onClick={onSelect}
    >
      <div className={cn(
        "flex items-center p-4 glass-card",
        horizontal ? "flex-col text-center h-40 justify-between" : "flex-row justify-between"
      )}>
        <div className={cn(
          "flex items-center",
          horizontal ? "flex-col space-y-2" : "space-x-3"
        )}>
          <div className="bg-primary/10 p-3 rounded-full">
            <CarIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{car.name}</h3>
            <p className="text-sm text-muted-foreground">{car.licensePlate}</p>
          </div>
        </div>
        
        {isSelected && (
          <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
        
        <div className={cn(
          "w-12 h-3 rounded-full",
          horizontal ? "mt-2" : ""
        )} 
        style={{ backgroundColor: car.color }} 
        />
      </div>
    </div>
  );
};

export default CarSelection;
