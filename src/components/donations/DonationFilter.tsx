'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ALLERGENS, FOOD_TYPES } from "@/lib/constants";
import { Search, X } from "lucide-react";
import React from "react";

export type FilterState = {
  location: string;
  preferredFood: string[];
  rejectedFood: string[];
  avoidAllergens: string[];
};

interface DonationFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

export function DonationFilter({ onFilterChange }: DonationFilterProps) {
  const [filters, setFilters] = React.useState<FilterState>({
    location: "New York, NY",
    preferredFood: [],
    rejectedFood: [],
    avoidAllergens: [],
  });

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    const freshFilters = {
        location: "New York, NY",
        preferredFood: [],
        rejectedFood: [],
        avoidAllergens: [],
    };
    setFilters(freshFilters);
    onFilterChange(freshFilters);
  }

  const handleMultiSelectChange = (
    field: keyof FilterState,
    value: string
  ) => {
    setFilters((prev) => {
      const currentValues = (prev[field] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Donations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="location">Your Location</Label>
          <Input
            id="location"
            placeholder="City, State or Zip Code"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Preferred Food Types</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {FOOD_TYPES.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`pref-${type}`}
                  checked={filters.preferredFood.includes(type)}
                  onCheckedChange={() => handleMultiSelectChange('preferredFood', type)}
                />
                <label htmlFor={`pref-${type}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {type}
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
                  onCheckedChange={() => handleMultiSelectChange('rejectedFood', type)}
                />
                <label htmlFor={`rej-${type}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {type}
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
                  onCheckedChange={() => handleMultiSelectChange('avoidAllergens', allergen)}
                />
                <label htmlFor={`allergen-${allergen}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {allergen}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
            <Button onClick={handleApplyFilters} className="w-full">
                <Search className="mr-2 h-4 w-4" /> Apply Filters
            </Button>
            <Button onClick={handleResetFilters} variant="outline" className="w-full">
                <X className="mr-2 h-4 w-4" /> Reset
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
