
import React from "react";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showThemeToggle?: boolean;
  transparent?: boolean;
  className?: string;
}

const Header = ({
  title,
  showBack = false,
  showThemeToggle = true,
  transparent = false,
  className,
}: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    if (location.pathname === "/") {
      // If on home page, don't do anything
      return;
    }
    navigate(-1);
  };

  return (
    <header
      className={cn(
        "w-full px-4 py-4 flex items-center justify-between",
        transparent ? "bg-transparent" : "bg-background",
        className
      )}
    >
      <div className="flex items-center">
        {showBack && (
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        {title && <h1 className="text-xl font-semibold">{title}</h1>}
      </div>

      {showThemeToggle && (
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>
      )}
    </header>
  );
};

export default Header;
