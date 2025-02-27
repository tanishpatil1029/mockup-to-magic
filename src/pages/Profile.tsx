
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Save, MapPin, Car, CalendarClock, Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleMapComponent } from "@/context/GoogleMapsContext";
import { useParkingContext } from "@/context/ParkingContext";
import { Link } from "react-router-dom";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").optional().nullable(),
  age: z.number().positive().optional().nullable(),
  weight: z.number().positive().optional().nullable(),
  height: z.number().positive().optional().nullable(),
  fitness_goals: z.string().optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { userProfile, isLoading, updateProfile } = useUser();
  const { cars, bookings } = useParkingContext();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: userProfile?.full_name || "",
      age: userProfile?.age || null,
      weight: userProfile?.weight || null,
      height: userProfile?.height || null,
      fitness_goals: userProfile?.fitness_goals || "",
    },
  });

  React.useEffect(() => {
    if (userProfile && !isLoading) {
      form.reset({
        full_name: userProfile.full_name,
        age: userProfile.age,
        weight: userProfile.weight,
        height: userProfile.height,
        fitness_goals: userProfile.fitness_goals,
      });
    }
  }, [userProfile, isLoading, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-16 bg-background">
        <Header title="My Profile" />
        <div className="flex justify-center items-center h-[70vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const activeBookingsCount = bookings.filter(b => b.status === "active").length;
  const completedBookingsCount = bookings.filter(b => b.status === "completed").length;

  return (
    <div className="min-h-screen pb-16 bg-background">
      <Header title="My Profile" />

      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src="/placeholder.svg" alt="Profile" />
            <AvatarFallback className="text-xl">
              {getInitials(userProfile?.full_name)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{userProfile?.full_name || "User"}</h2>
          <p className="text-muted-foreground">Premium Member</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cars</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{cars.length}</div>
              <Link to="/cars" className="text-primary text-sm flex items-center mt-1">
                <Car className="h-3 w-3 mr-1" /> Manage Cars
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bookings</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{activeBookingsCount + completedBookingsCount}</div>
              <Link to="/bookings" className="text-primary text-sm flex items-center mt-1">
                <CalendarClock className="h-3 w-3 mr-1" /> View History
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Map Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Your Locations
            </CardTitle>
            <CardDescription>Recently visited parking spots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] rounded-md overflow-hidden">
              <GoogleMapComponent 
                markers={[
                  { lat: 40.7128, lng: -74.0060 },
                  { lat: 40.7135, lng: -74.0046 }
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your personal details</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
            </Button>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your name" 
                          {...field} 
                          value={field.value || ''} 
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || ''} 
                            onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || ''} 
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || ''} 
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="fitness_goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add any additional notes or preferences here..." 
                          className="min-h-[80px]" 
                          {...field} 
                          value={field.value || ''} 
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isEditing && (
                  <CardFooter className="px-0 pt-4">
                    <Button type="submit" className="w-full">Save Changes</Button>
                  </CardFooter>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-primary" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start text-muted-foreground">
              Notification Preferences
            </Button>
            <Button variant="outline" className="w-full justify-start text-muted-foreground">
              Payment Methods
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive">
              Log Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
