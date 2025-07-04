import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Utensils, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

export interface Donation {
  id: string;
  foodName: string;
  donorName: string;
  pickupDate: Date;
  foodType: string;
  location: string;
  imageUrl: string;
  aiHint: string;
}

export function DonationCard({ donation }: { donation: Donation }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <Image
          src={donation.imageUrl}
          alt={donation.foodName}
          data-ai-hint={donation.aiHint}
          width={400}
          height={200}
          className="object-cover w-full h-48 rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="pt-6 flex-grow">
        <Badge variant="secondary" className="mb-2">{donation.foodType}</Badge>
        <CardTitle className="text-xl font-headline mb-2">{donation.foodName}</CardTitle>
        <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center">
                <Utensils className="h-4 w-4 mr-2" />
                <span>From: {donation.donorName}</span>
            </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{donation.location}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Pickup by: {format(donation.pickupDate, "PPP")}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/donations/${donation.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
