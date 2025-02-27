
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const Splash = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Show splash for 2 seconds then navigate to onboarding
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    const navigationTimer = setTimeout(() => {
      navigate("/onboarding");
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(navigationTimer);
    };
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="flex flex-col items-center">
        <div className={cn(
          "relative w-20 h-20 mb-6 transition-all duration-1000",
          isLoaded ? "scale-100 opacity-100" : "scale-50 opacity-0"
        )}>
          <div className="absolute inset-0 bg-primary rounded-2xl"></div>
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <Car className="h-10 w-10" />
          </div>
        </div>

        <h1 className={cn(
          "text-4xl font-bold mb-2 transition-all duration-1000 delay-300",
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}>
          Parking
        </h1>
        
        <div className={cn(
          "flex items-center text-xl text-muted-foreground transition-all duration-1000 delay-500",
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}>
          <span>Mobile App</span>
        </div>
      </div>
      
      <div className={cn(
        "mt-12 transition-all duration-1000 delay-700",
        isLoaded ? "opacity-100" : "opacity-0"
      )}>
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-pulse-subtle" style={{width: '70%'}}></div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
