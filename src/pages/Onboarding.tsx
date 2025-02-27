
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, ChevronRight, MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const steps: OnboardingStep[] = [
  {
    title: "Find Parking Easily",
    description: "Discover available parking spots near you with real-time updates",
    icon: MapPin,
    color: "bg-primary",
  },
  {
    title: "Choose Your Vehicle",
    description: "Select from your saved vehicles or add a new one",
    icon: Car,
    color: "bg-blue-500",
  },
  {
    title: "Book in Seconds",
    description: "Reserve your spot with just a few taps and manage your bookings effortlessly",
    icon: Calendar,
    color: "bg-yellow-500",
  },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/");
    }
  };

  const skipOnboarding = () => {
    navigate("/");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header with Skip */}
      <div className="flex justify-end p-4">
        <button 
          className="text-muted-foreground text-sm font-medium py-2 px-4 rounded-lg hover:bg-muted transition-colors"
          onClick={skipOnboarding}
        >
          Skip
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={cn(
              "transition-all duration-500 absolute max-w-md w-full",
              index === currentStep 
                ? "opacity-100 translate-x-0 z-10" 
                : index < currentStep 
                  ? "opacity-0 -translate-x-full z-0" 
                  : "opacity-0 translate-x-full z-0"
            )}
          >
            <div className="flex flex-col items-center text-center">
              <div className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center mb-8", 
                step.color
              )}>
                <step.icon className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold mb-4">{step.title}</h2>
              <p className="text-muted-foreground mb-8">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mb-12">
        {steps.map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-2.5 rounded-full mx-1 transition-all duration-300",
              index === currentStep
                ? "w-6 bg-primary"
                : "w-2.5 bg-gray-300 dark:bg-gray-700"
            )}
          />
        ))}
      </div>

      {/* Continue Button */}
      <div className="p-6">
        <button
          className="w-full bg-primary text-white rounded-xl py-4 font-semibold flex items-center justify-center transition-all hover:bg-primary/90"
          onClick={nextStep}
        >
          {currentStep < steps.length - 1 ? (
            <>
              Continue
              <ChevronRight className="ml-2 h-5 w-5" />
            </>
          ) : (
            "Get Started"
          )}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
