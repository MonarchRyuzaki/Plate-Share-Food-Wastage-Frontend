"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Route,
  ShieldAlert,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export interface Donation {
  _id: string;
  foodTitle: string;
  donorName: string; // This would likely be populated from a 'userId' reference
  expiryDate: Date;
  foodType: string[];
  city: string;
  state: string;
  foodImage: string;
  aiHint: string;
  distanceKm: number | null;
  containsAllergen: string[];
  priority: string;
  foodQuantity: string;
  foodDescription: string;
}

export function DonationCard({ donation }: { donation: Donation }) {
  const location = `${donation.city}, ${donation.state}`;
  const searchParams = useSearchParams();

  // Create URL with preserved location parameters (lat, long, locationName)
  // Exclude filter-specific parameters for the details page
  const detailsUrl = (() => {
    const params = new URLSearchParams();

    // Only preserve location-related parameters
    const lat = searchParams.get("lat");
    const long = searchParams.get("long");

    if (lat) params.set("lat", lat);
    if (long) params.set("long", long);

    const queryString = params.toString();
    return `/donations/${donation._id}${queryString ? `?${queryString}` : ""}`;
  })();

  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0 relative">
        <Image
          src={donation.foodImage}
          alt={donation.foodTitle}
          data-ai-hint={donation.aiHint}
          width={400}
          height={200}
          className="object-cover w-full h-48 rounded-t-lg"
        />
        {donation.distanceKm !== null && (
          <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
            <Route className="mr-1 h-3 w-3" />
            {donation.distanceKm.toFixed(1)} km away
          </Badge>
        )}
      </CardHeader>
      <CardContent className="pt-6 flex-grow">
        <div className="flex flex-wrap gap-1 mb-2">
          {donation.foodType.map((type) => (
            <Badge key={type} variant="secondary">
              {type}
            </Badge>
          ))}
        </div>
        <CardTitle className="text-xl font-headline mb-2">
          {donation.foodTitle}
        </CardTitle>
        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center">
            <Utensils className="h-4 w-4 mr-2" />
            <span>From: {donation.donorName}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{location}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Expires on: {format(donation.expiryDate, "PPP")}</span>
          </div>
        </div>
        {donation.containsAllergen && donation.containsAllergen.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-muted-foreground mb-1">
              Potential Allergens
            </h4>
            <div className="flex flex-wrap gap-1">
              {donation.containsAllergen.map((allergen) => (
                <Badge
                  key={allergen}
                  variant="outline"
                  className="border-destructive text-destructive flex items-center gap-1 text-xs p-1 font-normal"
                >
                  <ShieldAlert className="h-3 w-3" />
                  {allergen}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={detailsUrl}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
