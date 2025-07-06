"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ALLERGENS, FOOD_TYPES, PRIORITIES } from "@/lib/constants";
import { MapPin, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { Slider } from "../ui/slider";

export type FilterState = {
  locationName: string;
  lat: number | null;
  long: number | null;
  distance: number;
  priorities: string[];
  preferredFood: string[];
  rejectedFood: string[];
  avoidAllergens: string[];
};

export function DonationFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [filters, setFilters] = useState<FilterState>(() => {
    return {
      locationName: searchParams.get("locationName") || "New York, NY",
      lat: searchParams.get("lat") ? Number(searchParams.get("lat")) : 40.7128,
      long: searchParams.get("long")
        ? Number(searchParams.get("long"))
        : -74.006,
      distance: searchParams.get("distance")
        ? Number(searchParams.get("distance"))
        : 10,
      priorities:
        searchParams.get("priorities")?.split(",").filter(Boolean) || [],
      preferredFood:
        searchParams.get("preferredFood")?.split(",").filter(Boolean) || [],
      rejectedFood:
        searchParams.get("rejectedFood")?.split(",").filter(Boolean) || [],
      avoidAllergens:
        searchParams.get("avoidAllergens")?.split(",").filter(Boolean) || [],
    };
  });

  useEffect(() => {
    setFilters({
      locationName: searchParams.get("locationName") || "New York, NY",
      lat: searchParams.get("lat") ? Number(searchParams.get("lat")) : 40.7128,
      long: searchParams.get("long")
        ? Number(searchParams.get("long"))
        : -74.006,
      distance: searchParams.get("distance")
        ? Number(searchParams.get("distance"))
        : 10,
      priorities:
        searchParams.get("priorities")?.split(",").filter(Boolean) || [],
      preferredFood:
        searchParams.get("preferredFood")?.split(",").filter(Boolean) || [],
      rejectedFood:
        searchParams.get("rejectedFood")?.split(",").filter(Boolean) || [],
      avoidAllergens:
        searchParams.get("avoidAllergens")?.split(",").filter(Boolean) || [],
    });
  }, [searchParams]);

  const updateUrlWithFilters = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams();

      // Set parameters, deleting if they are empty/default to keep URL clean
      Object.entries(newFilters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(key, value.join(","));
          }
        } else if (
          value !== null &&
          value !== "" &&
          key !== "locationName" &&
          key !== "lat" &&
          key !== "long"
        ) {
          params.set(key, String(value));
        }
      });

      // Handle location specially
      if (newFilters.lat && newFilters.long) {
        params.set("lat", String(newFilters.lat));
        params.set("long", String(newFilters.long));
        params.set("locationName", newFilters.locationName);
      }

      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname]
  );

  const getLocationAndUpdate = useCallback(
    (isInitialLoad = false) => {
      if (!navigator.geolocation) {
        if (!isInitialLoad) {
          toast({
            variant: "destructive",
            title: "Geolocation not supported",
            description: "Your browser does not support this feature.",
          });
        }
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newFilters = {
            ...filters,
            lat: position.coords.latitude,
            long: position.coords.longitude,
            locationName: "Current Location",
          };
          setFilters(newFilters);
          updateUrlWithFilters(newFilters);
          toast({
            title: "Location Found",
            description: "Showing donations near your current location.",
          });
        },
        () => {
          if (isInitialLoad) {
            toast({
              title: "Location Access Denied",
              description:
                "Showing results for New York, NY. Grant permission to see local results.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Unable to retrieve location",
              description: "Please ensure location services are enabled.",
            });
          }
        }
      );
    },
    [filters, updateUrlWithFilters, toast]
  );

  useEffect(() => {
    if (!searchParams.has("lat") && !searchParams.has("long")) {
      getLocationAndUpdate(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = () => {
    updateUrlWithFilters(filters);
  };

  const handleResetFilters = () => {
    router.push(pathname);
  };

  const handleMultiSelectChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const currentValues = (prev[field] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleGetLocation = () => {
    getLocationAndUpdate(false);
  };

  return (
    <Card className="lg:min-w-[360px]">
      <CardHeader>
        <CardTitle>Filter & Sort</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Your Location</Label>
          <div className="flex items-center justify-between p-2 border rounded-md bg-background">
            <p className="text-sm text-muted-foreground truncate">
              {filters.locationName}
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGetLocation}
              className="h-7 w-7 flex-shrink-0"
            >
              <MapPin className="h-4 w-4 text-primary" />
              <span className="sr-only">Use current location</span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="distance">Max Distance (km)</Label>
            <span className="text-sm text-muted-foreground">
              {filters.distance} km
            </span>
          </div>
          <Slider
            id="distance"
            min={1}
            max={50}
            step={1}
            value={[filters.distance]}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, distance: value[0] }))
            }
          />
        </div>

        <div>
          <Label>Donation Priority</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {PRIORITIES.map((priority) => (
              <div key={priority} className="flex items-center space-x-2">
                <Checkbox
                  id={`prio-${priority}`}
                  checked={filters.priorities.includes(priority)}
                  onCheckedChange={() =>
                    handleMultiSelectChange("priorities", priority)
                  }
                />
                <label
                  htmlFor={`prio-${priority}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 break-words"
                >
                  {priority}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Preferred Food Types</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {FOOD_TYPES.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`pref-${type}`}
                  checked={filters.preferredFood.includes(type)}
                  onCheckedChange={() =>
                    handleMultiSelectChange("preferredFood", type)
                  }
                />
                <label
                  htmlFor={`pref-${type}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 break-words"
                >
                  {type.split("_").join(" ")}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Rejected Food Types</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {FOOD_TYPES.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`rej-${type}`}
                  checked={filters.rejectedFood.includes(type)}
                  onCheckedChange={() =>
                    handleMultiSelectChange("rejectedFood", type)
                  }
                />
                <label
                  htmlFor={`rej-${type}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 break-words"
                >
                  {type.split("_").join(" ")}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Avoid Allergens</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {ALLERGENS.map((allergen) => (
              <div key={allergen} className="flex items-center space-x-2">
                <Checkbox
                  id={`allergen-${allergen}`}
                  checked={filters.avoidAllergens.includes(allergen)}
                  onCheckedChange={() =>
                    handleMultiSelectChange("avoidAllergens", allergen)
                  }
                />
                <label
                  htmlFor={`allergen-${allergen}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 break-words"
                >
                  {allergen.split("_").join(" ")}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleApplyFilters} className="w-full">
            <Search className="mr-2 h-4 w-4" /> Apply Filters
          </Button>
          <Button
            onClick={handleResetFilters}
            variant="outline"
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
