"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ALLERGENS, FOOD_TYPES, PRIORITIES } from "@/lib/constants";
import { MapPin, Plus, Search, Trash2, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { Slider } from "../ui/slider";

type FoodTypeFilter = {
  id: string;
  preference: "prefers" | "rejects" | "";
  category: string;
  specificItem: string;
};

type AllergenFilter = {
  id: string;
  category: string;
  specificItem: string;
};

export type FilterState = {
  locationName: string;
  lat: number | null;
  long: number | null;
  distance: number;
  priorities: string[];
  preferredFood: Array<{ parent: string; specific: string }>;
  rejectedFood: Array<{ parent: string; specific: string }>;
  avoidAllergens: Array<{ parent: string; specific: string }>;
};

export function DonationFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [filters, setFilters] = useState<FilterState>(() => {
    // Parse JSON strings from URL params
    const parseJsonParam = (param: string | null) => {
      if (!param) return [];
      try {
        return JSON.parse(param);
      } catch {
        return [];
      }
    };

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
      preferredFood: parseJsonParam(searchParams.get("preferredFood")),
      rejectedFood: parseJsonParam(searchParams.get("rejectedFood")),
      avoidAllergens: parseJsonParam(searchParams.get("avoidAllergens")),
    };
  });

  const [foodTypeFilters, setFoodTypeFilters] = useState<FoodTypeFilter[]>([
    { id: crypto.randomUUID(), preference: "", category: "", specificItem: "" },
  ]);

  const [allergenFilters, setAllergenFilters] = useState<AllergenFilter[]>([
    { id: crypto.randomUUID(), category: "", specificItem: "" },
  ]);

  useEffect(() => {
    const parseJsonParam = (param: string | null) => {
      if (!param) return [];
      try {
        return JSON.parse(param);
      } catch {
        return [];
      }
    };

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
      preferredFood: parseJsonParam(searchParams.get("preferredFood")),
      rejectedFood: parseJsonParam(searchParams.get("rejectedFood")),
      avoidAllergens: parseJsonParam(searchParams.get("avoidAllergens")),
    });
  }, [searchParams]);

  // Sync food type filters with filters state when component mounts or URL changes
  useEffect(() => {
    const preferred = filters.preferredFood || [];
    const rejected = filters.rejectedFood || [];

    if (preferred.length > 0 || rejected.length > 0) {
      const newFilters: FoodTypeFilter[] = [];

      preferred.forEach((item) => {
        newFilters.push({
          id: crypto.randomUUID(),
          preference: "prefers",
          category: item.parent,
          specificItem: item.specific,
        });
      });

      rejected.forEach((item) => {
        newFilters.push({
          id: crypto.randomUUID(),
          preference: "rejects",
          category: item.parent,
          specificItem: item.specific,
        });
      });

      setFoodTypeFilters(
        newFilters.length > 0
          ? newFilters
          : [
              {
                id: crypto.randomUUID(),
                preference: "",
                category: "",
                specificItem: "",
              },
            ]
      );
    }
  }, [filters.preferredFood, filters.rejectedFood]);

  // Sync allergen filters with filters state
  useEffect(() => {
    const allergens = filters.avoidAllergens || [];

    if (allergens.length > 0) {
      const newFilters: AllergenFilter[] = allergens.map((item) => ({
        id: crypto.randomUUID(),
        category: item.parent,
        specificItem: item.specific,
      }));

      setAllergenFilters(
        newFilters.length > 0
          ? newFilters
          : [{ id: crypto.randomUUID(), category: "", specificItem: "" }]
      );
    }
  }, [filters.avoidAllergens]);

  const updateUrlWithFilters = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams();

      // Set parameters, deleting if they are empty/default to keep URL clean
      Object.entries(newFilters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            // For preferredFood, rejectedFood, avoidAllergens, stringify the array of objects
            if (
              key === "preferredFood" ||
              key === "rejectedFood" ||
              key === "avoidAllergens"
            ) {
              params.set(key, JSON.stringify(value));
            } else {
              // For priorities, keep comma-separated format
              params.set(key, value.join(","));
            }
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
    // Build preferredFood and rejectedFood arrays with parent and specific
    const preferredFood: Array<{ parent: string; specific: string }> = [];
    const rejectedFood: Array<{ parent: string; specific: string }> = [];

    foodTypeFilters.forEach((filter) => {
      if (filter.preference && filter.category) {
        const item = { parent: filter.category, specific: filter.specificItem };
        if (filter.preference === "prefers") {
          preferredFood.push(item);
        } else if (filter.preference === "rejects") {
          rejectedFood.push(item);
        }
      }
    });

    // Build avoidAllergens array with parent and specific
    const avoidAllergens = allergenFilters
      .filter((filter) => filter.category)
      .map((filter) => ({
        parent: filter.category,
        specific: filter.specificItem || "",
      }));

    const updatedFilters = {
      ...filters,
      preferredFood,
      rejectedFood,
      avoidAllergens,
    };

    updateUrlWithFilters(updatedFilters);
  };

  const handleResetFilters = () => {
    setFoodTypeFilters([
      {
        id: crypto.randomUUID(),
        preference: "",
        category: "",
        specificItem: "",
      },
    ]);
    setAllergenFilters([
      { id: crypto.randomUUID(), category: "", specificItem: "" },
    ]);
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

  // Food Type Filter Handlers
  const addFoodTypeFilter = () => {
    setFoodTypeFilters([
      ...foodTypeFilters,
      {
        id: crypto.randomUUID(),
        preference: "",
        category: "",
        specificItem: "",
      },
    ]);
  };

  const removeFoodTypeFilter = (id: string) => {
    if (foodTypeFilters.length > 1) {
      setFoodTypeFilters(foodTypeFilters.filter((filter) => filter.id !== id));
    }
  };

  const updateFoodTypeFilter = (
    id: string,
    field: keyof FoodTypeFilter,
    value: string
  ) => {
    setFoodTypeFilters(
      foodTypeFilters.map((filter) => {
        if (filter.id === id) {
          const updated = { ...filter, [field]: value };
          // Reset category and specificItem when preference changes
          if (field === "preference") {
            updated.category = "";
            updated.specificItem = "";
          }
          // Reset specificItem when category changes
          if (field === "category") {
            updated.specificItem = "";
          }
          return updated;
        }
        return filter;
      })
    );
  };

  // Allergen Filter Handlers
  const addAllergenFilter = () => {
    setAllergenFilters([
      ...allergenFilters,
      { id: crypto.randomUUID(), category: "", specificItem: "" },
    ]);
  };

  const removeAllergenFilter = (id: string) => {
    if (allergenFilters.length > 1) {
      setAllergenFilters(allergenFilters.filter((filter) => filter.id !== id));
    }
  };

  const updateAllergenFilter = (
    id: string,
    field: keyof AllergenFilter,
    value: string
  ) => {
    setAllergenFilters(
      allergenFilters.map((filter) => {
        if (filter.id === id) {
          const updated = { ...filter, [field]: value };
          // Reset specificItem when category changes
          if (field === "category") {
            updated.specificItem = "";
          }
          return updated;
        }
        return filter;
      })
    );
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

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Food Type Filters</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFoodTypeFilter}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Filter
            </Button>
          </div>
          <div className="space-y-3">
            {foodTypeFilters.map((filter, index) => (
              <div
                key={filter.id}
                className="p-3 border rounded-md space-y-2 bg-muted/30"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">
                    Filter {index + 1}
                  </span>
                  {foodTypeFilters.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFoodTypeFilter(filter.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <Select
                  value={filter.preference}
                  onValueChange={(value) =>
                    updateFoodTypeFilter(filter.id, "preference", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Prefers or Rejects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prefers">Prefers</SelectItem>
                    <SelectItem value="rejects">Rejects</SelectItem>
                  </SelectContent>
                </Select>
                {filter.preference && (
                  <Select
                    value={filter.category}
                    onValueChange={(value) =>
                      updateFoodTypeFilter(filter.id, "category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(FOOD_TYPES).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {filter.category && (
                  <Select
                    value={filter.specificItem}
                    onValueChange={(value) =>
                      updateFoodTypeFilter(filter.id, "specificItem", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Specific Item" />
                    </SelectTrigger>
                    <SelectContent>
                      {FOOD_TYPES[
                        filter.category as keyof typeof FOOD_TYPES
                      ].map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Allergen Filters</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAllergenFilter}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Filter
            </Button>
          </div>
          <div className="space-y-3">
            {allergenFilters.map((filter, index) => (
              <div
                key={filter.id}
                className="p-3 border rounded-md space-y-2 bg-muted/30"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">
                    Filter {index + 1}
                  </span>
                  {allergenFilters.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAllergenFilter(filter.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <Select
                  value={filter.category}
                  onValueChange={(value) =>
                    updateAllergenFilter(filter.id, "category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(ALLERGENS).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filter.category && (
                  <Select
                    value={filter.specificItem}
                    onValueChange={(value) =>
                      updateAllergenFilter(filter.id, "specificItem", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Specific Item" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALLERGENS[filter.category as keyof typeof ALLERGENS].map(
                        (item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
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
