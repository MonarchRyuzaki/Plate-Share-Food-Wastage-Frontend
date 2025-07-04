"use client";

import { createFoodDonation } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ALLERGENS, FOOD_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const donationFormSchema = z.object({
  title: z.string().min(2, {
    message: "Food title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  quantity: z.string().min(1, { message: "Please specify a quantity." }),
  expiryDate: z.date({
    required_error: "An expiry date is required.",
  }),
  type: z.array(z.string()).min(1, {
    message: "Please select at least one food type.",
  }),
  allergens: z.array(z.string()).optional(),
  address: z.string().min(5, { message: "Please provide a valid address." }),
  city: z.string().min(2, { message: "Please provide a city." }),
  state: z.string().min(2, { message: "Please provide a state." }),
  latitude: z.string().min(1, { message: "Location is required." }),
  longitude: z.string().min(1, { message: "Location is required." }),
  images: z.any().refine((files) => files && files.length > 0, {
    message: "At least one food image is required.",
  }),
});

type DonationFormValues = z.infer<typeof donationFormSchema>;

interface DonationFormProps {
  donation?: Partial<DonationFormValues> & { id?: string };
}

export function DonationForm({ donation }: DonationFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationObtained, setLocationObtained] = useState(false);

  const defaultValues: Partial<DonationFormValues> = donation || {
    title: "",
    description: "",
    quantity: "",
    expiryDate: new Date(
      new Date().getMilliseconds() + 7 * 24 * 60 * 60 * 1000
    ),
    type: [],
    allergens: [],
    address: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
  };

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues,
  });

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        form.setValue("latitude", latitude.toString());
        form.setValue("longitude", longitude.toString());
        setLocationObtained(true);
        setIsGettingLocation(false);
        toast({
          title: "Location obtained",
          description: "Your current location has been detected successfully.",
        });
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = "Failed to get your location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please allow location access and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Automatically get location when component mounts
  useEffect(() => {
    if (!donation && !locationObtained) {
      getCurrentLocation();
    }
  }, []);

  async function onSubmit(data: DonationFormValues) {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Add form fields to FormData
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("quantity", data.quantity);
      formData.append("type", data.type.join(","));
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("latitude", data.latitude);
      formData.append("longitude", data.longitude);
      formData.append("expiryDate", data.expiryDate.toISOString());

      if (data.allergens && data.allergens.length > 0) {
        formData.append("allergens", data.allergens.join(","));
      }

      // Add images if any
      if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          formData.append("foodImage", data.images[i]);
        }
      }

      const result = await createFoodDonation(formData);

      if (result.success) {
        toast({
          title: "Success!",
          description: "Your food donation has been listed successfully.",
        });
        router.push("/donor/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create donation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Location Status */}
        <div className="flex items-center space-x-2 p-4 border rounded-lg bg-muted/50">
          <MapPin className="h-4 w-4" />
          <div className="flex-1">
            {isGettingLocation ? (
              <span className="text-sm text-muted-foreground">
                Getting your location...
              </span>
            ) : locationObtained ? (
              <span className="text-sm text-green-600">
                Location detected successfully
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                Location not detected
              </span>
            )}
          </div>
          {!locationObtained && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
            >
              {isGettingLocation ? "Getting Location..." : "Get Location"}
            </Button>
          )}
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Food Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Sourdough Loaves, Vegetable Curry"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A clear and concise name for the food item(s).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us more about the food, its condition, preparation details, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 10 meals, 5 boxes, approx 20 lbs"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Estimate the amount of food available.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Food Images *</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormDescription>
                Upload at least one photo of your food items (required).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pickup Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="New York" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="NY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Hidden fields for latitude and longitude */}
        <input type="hidden" {...form.register("latitude")} />
        <input type="hidden" {...form.register("longitude")} />

        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiry Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick an expiry date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Food Types</FormLabel>
                <FormDescription>
                  Select all applicable food types.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {FOOD_TYPES.map((type) => (
                  <FormField
                    key={type}
                    control={form.control}
                    name="type"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={type}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(type)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value || []),
                                      type,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== type
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {type.replace(/_/g, " ")}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allergens"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Potential Allergens</FormLabel>
                <FormDescription>
                  Select any allergens that may be present in the food.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ALLERGENS.map((allergen) => (
                  <FormField
                    key={allergen}
                    control={form.control}
                    name="allergens"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={allergen}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(allergen)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value || []),
                                      allergen,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== allergen
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {allergen.replace(/_/g, " ")}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting || !locationObtained}>
          {isSubmitting ? "Creating Donation..." : "Create Donation"}
        </Button>
      </form>
    </Form>
  );
}
