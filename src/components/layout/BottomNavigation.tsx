
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Car, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  {
    icon: Home,
    label: "Home",
    path: "/",
  },
  {
    icon: Car,
    label: "My Cars",
    path: "/cars",
  },
  {
    icon: Clock,
    label: "Bookings",
    path: "/bookings",
  },
  {
    icon: User,
    label: "Profile",
    path: "/profile",
  },
];

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-background border-t border-border">
      <div className="flex justify-around items-center h-16 px-4 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavButton
            key={item.path}
            icon={item.icon}
            label={item.label}
            isActive={
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path)
            }
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
    </nav>
  );
};

interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavButton = ({ icon: Icon, label, isActive, onClick }: NavButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-16 h-full transition-colors",
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
      aria-label={label}
    >
      <div className={cn(
        "relative flex items-center justify-center",
        isActive && "before:content-[''] before:absolute before:-top-3 before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary"
      )}>
        <Icon className={cn(
          "h-5 w-5",
          isActive && "text-primary"
        )} />
      </div>
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

export default BottomNavigation;
