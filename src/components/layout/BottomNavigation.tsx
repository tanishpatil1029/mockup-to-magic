
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Car, Calendar, User, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    {
      label: "Home",
      icon: Home,
      path: "/",
      active: isActive("/")
    },
    {
      label: "Cars",
      icon: Car,
      path: "/cars",
      active: isActive("/cars")
    },
    {
      label: "Map",
      icon: MapPin,
      path: "/map",
      active: isActive("/map")
    },
    {
      label: "Bookings",
      icon: Calendar,
      path: "/bookings",
      active: isActive("/bookings")
    },
    {
      label: "Profile",
      icon: User,
      path: "/profile",
      active: isActive("/profile")
    }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t flex justify-around items-center px-2 z-50">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full",
            item.active ? "text-primary" : "text-muted-foreground"
          )}
        >
          <item.icon className={cn("h-5 w-5 mb-1", item.active ? "text-primary" : "text-muted-foreground")} />
          <span className="text-xs">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNavigation;
