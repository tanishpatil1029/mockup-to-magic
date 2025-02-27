
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useParkingContext, Car } from "@/context/ParkingContext";
import { Plus, Car as CarIcon, Edit, Trash, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CarsPage = () => {
  const { cars, addCar, removeCar, selectCar, selectedCar } = useParkingContext();
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    licensePlate: "",
    color: "#000000",
    type: "sedan" as const,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      licensePlate: "",
      color: "#000000",
      type: "sedan" as const,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.licensePlate) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (editingCar) {
      // Update existing car
      const updatedCar = {
        ...editingCar,
        ...formData,
      };
      
      // Remove old car
      removeCar(editingCar.id);
      
      // Add updated car
      addCar(updatedCar);
      
      toast.success("Car updated successfully");
      setEditingCar(null);
    } else {
      // Add new car
      const newCar: Car = {
        id: `car-${Date.now()}`,
        ...formData,
      };
      
      addCar(newCar);
      toast.success("Car added successfully");
    }
    
    resetForm();
    setIsAddingCar(false);
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      licensePlate: car.licensePlate,
      color: car.color,
      type: car.type,
    });
    setIsAddingCar(true);
  };

  const handleDelete = (carId: string) => {
    removeCar(carId);
    toast.success("Car removed successfully");
  };

  return (
    <div className="min-h-screen pb-16 bg-background">
      <Header title="My Vehicles" />
      
      <div className="p-4">
        {isAddingCar ? (
          <div className="neo-card rounded-xl overflow-hidden mb-6 animate-fade-in">
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-4">
                {editingCar ? "Edit Vehicle" : "Add New Vehicle"}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Vehicle Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
                      placeholder="e.g. My Tesla"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      License Plate
                    </label>
                    <input
                      type="text"
                      name="licensePlate"
                      value={formData.licensePlate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
                      placeholder="e.g. ABC 123"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Vehicle Type
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
                      >
                        <option value="sedan">Sedan</option>
                        <option value="suv">SUV</option>
                        <option value="hatchback">Hatchback</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Vehicle Color
                      </label>
                      <input
                        type="color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="w-full h-10 rounded-lg border border-border bg-background p-1"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-white rounded-lg py-3 font-medium transition-all hover:bg-primary/90"
                    >
                      {editingCar ? "Update Vehicle" : "Add Vehicle"}
                    </button>
                    
                    <button
                      type="button"
                      className="flex-1 bg-muted text-foreground rounded-lg py-3 font-medium transition-all hover:bg-muted/70"
                      onClick={() => {
                        setIsAddingCar(false);
                        setEditingCar(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <button
            className="w-full mb-6 p-4 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors"
            onClick={() => setIsAddingCar(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            <span>Add New Vehicle</span>
          </button>
        )}
        
        <h3 className="font-semibold text-lg mb-4">Your Vehicles</h3>
        
        <div className="space-y-4">
          {cars.length > 0 ? (
            cars.map((car) => (
              <div
                key={car.id}
                className={cn(
                  "neo-card rounded-xl overflow-hidden transition-all",
                  selectedCar?.id === car.id 
                    ? "border-2 border-primary ring-2 ring-primary/30" 
                    : ""
                )}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full mr-3 flex items-center justify-center bg-muted">
                        <CarIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{car.name}</h4>
                        <p className="text-sm text-muted-foreground">{car.licensePlate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-6 h-6 rounded-full border border-border"
                        style={{ backgroundColor: car.color }}
                      />
                      
                      <button
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                        onClick={() => handleEdit(car)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                        onClick={() => handleDelete(car.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground capitalize">
                      {car.type}
                    </span>
                    
                    <button
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                        selectedCar?.id === car.id 
                          ? "bg-primary text-white" 
                          : "border border-border hover:bg-muted"
                      )}
                      onClick={() => selectCar(car)}
                    >
                      {selectedCar?.id === car.id ? (
                        <span className="flex items-center">
                          <Check className="h-4 w-4 mr-1" />
                          Selected
                        </span>
                      ) : (
                        "Select"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <p>No vehicles added yet</p>
            </div>
          )}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default CarsPage;
