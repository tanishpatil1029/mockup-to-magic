
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import ParkingDetails from "./pages/ParkingDetails";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSuccess";
import { ThemeProvider } from "./context/ThemeContext";
import { ParkingProvider } from "./context/ParkingContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ParkingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/splash" element={<Splash />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/parking/:id" element={<ParkingDetails />} />
              <Route path="/booking/new" element={<Booking />} />
              <Route path="/booking-success/:id" element={<BookingSuccess />} />
              <Route path="/bookings" element={<Booking />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ParkingProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
