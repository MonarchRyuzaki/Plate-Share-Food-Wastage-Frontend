import Header from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Heart,
  MapPin,
  Phone,
  Route,
  ShieldAlert,
  Tag,
  Utensils,
} from "lucide-react";
import Image from "next/image";

async function getDonationDetails(id: string) {
  console.log(`Fetching details for donation: ${id}`);
  const mockData: { [key: string]: any } = {
    "1": {
      _id: "1",
      foodTitle: "Artisan Bread Loaves",
      foodDescription:
        "A variety of freshly baked artisan breads, including sourdough and multigrain. Best if used within 2 days.",
      foodQuantity: "Approx. 30 loaves",
      donorName: "The Corner Bakery",
      expiryDate: new Date("2024-08-16"),
      pickupTime: "10:00",
      foodType: ["Bakery"],
      address: "123 Bread Lane",
      city: "New York",
      state: "NY",
      foodImage: "https://placehold.co/800x400.png",
      aiHint: "artisan bread",
      containsAllergen: ["Gluten"],
      contactPhoneNumber: "555-0101",
      priority: "Medium",
      distanceKm: 2.5,
    },
    "2": {
      _id: "2",
      foodTitle: "Fresh Organic Salads",
      foodDescription:
        "Mixed green salads with grilled chicken and a light vinaigrette. Contains nuts in a separate container.",
      foodQuantity: "15 large bowls",
      donorName: "Green Leaf Cafe",
      expiryDate: new Date("2024-08-15"),
      pickupTime: "18:00",
      foodType: ["Prepared Meals"],
      address: "456 Salad St",
      city: "New York",
      state: "NY",
      foodImage: "https://placehold.co/800x400.png",
      aiHint: "fresh salad",
      containsAllergen: ["Nuts"],
      contactPhoneNumber: "555-0102",
      priority: "High",
      distanceKm: 1.2,
    },
    "3": {
      _id: "3",
      foodTitle: "Cheddar Cheese Blocks",
      foodDescription: "Sharp cheddar cheese.",
      foodQuantity: "5 blocks",
      donorName: "Dairy Farms Inc.",
      expiryDate: new Date("2024-08-20"),
      pickupTime: "09:00",
      foodType: ["Dairy & Eggs"],
      address: "789 Dairy Drive",
      city: "Brooklyn",
      state: "NY",
      foodImage: "https://placehold.co/800x400.png",
      aiHint: "cheese block",
      containsAllergen: ["Dairy"],
      contactPhoneNumber: "555-0103",
      priority: "Low",
      distanceKm: 8.1,
    },
  };
  // Add other donations to mock data
  mockData["4"] = {
    _id: "4",
    foodTitle: "Assorted Canned Goods",
    foodDescription: "Beans, corn, and soup.",
    foodQuantity: "2 cases",
    donorName: "Pantry Plus",
    expiryDate: new Date("2024-09-01"),
    pickupTime: "11:00",
    foodType: ["Pantry Staples"],
    address: "101 Shelf St",
    city: "New York",
    state: "NY",
    foodImage: "https://placehold.co/800x400.png",
    aiHint: "canned food",
    containsAllergen: [],
    contactPhoneNumber: "555-0104",
    priority: "Medium",
    distanceKm: 5.5,
  };
  mockData["5"] = {
    _id: "5",
    foodTitle: "Fresh Apples and Oranges",
    foodDescription: "Organic apples and oranges.",
    foodQuantity: "1 large box",
    donorName: "City Farmers Market",
    expiryDate: new Date("2024-08-18"),
    pickupTime: "13:00",
    foodType: ["Produce"],
    address: "202 Orchard Ave",
    city: "Queens",
    state: "NY",
    foodImage: "https://placehold.co/800x400.png",
    aiHint: "apples oranges",
    containsAllergen: [],
    contactPhoneNumber: "555-0105",
    priority: "High",
    distanceKm: 12.0,
  };
  mockData["6"] = {
    _id: "6",
    foodTitle: "Whole Chickens",
    foodDescription: "Ready to be cooked.",
    foodQuantity: "10 whole chickens",
    donorName: "Butcher Block",
    expiryDate: new Date("2024-08-15"),
    pickupTime: "15:00",
    foodType: ["Meat & Fish"],
    address: "303 Protein Pl",
    city: "New York",
    state: "NY",
    foodImage: "https://placehold.co/800x400.png",
    aiHint: "raw chicken",
    containsAllergen: [],
    contactPhoneNumber: "555-0106",
    priority: "High",
    distanceKm: 3.8,
  };

  return mockData[id] || null;
}

export default async function DonationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const donation = await getDonationDetails(params.id);

  if (!donation) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto p-4 md:p-8 text-center">
          <h1 className="text-2xl font-bold">Donation not found</h1>
          <p>This donation may have been claimed or removed.</p>
        </main>
      </div>
    );
  }

  const fullAddress = `${donation.address}, ${donation.city}, ${donation.state}`;
  const priorityColor =
    donation.priority === "High"
      ? "bg-red-500"
      : donation.priority === "Medium"
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-secondary py-8 md:py-12">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Image
                src={donation.foodImage}
                alt={donation.foodTitle}
                data-ai-hint={donation.aiHint}
                width={800}
                height={400}
                className="object-cover w-full rounded-lg shadow-lg"
              />
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Pickup Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{fullAddress}</p>
                  {/* Placeholder for map */}
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Map Placeholder</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {donation.foodType.map((type: string) => (
                  <Badge key={type} variant="secondary">
                    {type}
                  </Badge>
                ))}
                <Badge className={`${priorityColor} text-white`}>
                  <Tag className="mr-1 h-3 w-3" /> {donation.priority} Priority
                </Badge>
                {donation.distanceKm !== null && (
                  <Badge variant="outline">
                    <Route className="mr-1 h-3 w-3" />
                    {donation.distanceKm.toFixed(1)} km away
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold font-headline mt-4">
                {donation.foodTitle}
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                from {donation.donorName}
              </p>

              <Card className="my-6">
                <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <Utensils className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Quantity</p>
                      <p className="text-muted-foreground">
                        {donation.foodQuantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Expires On</p>
                      <p className="text-muted-foreground">
                        {format(donation.expiryDate, "EEEE, MMMM d")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Available After</p>
                      <p className="text-muted-foreground">
                        {donation.pickupTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Contact</p>
                      <p className="text-muted-foreground">
                        {donation.contactPhoneNumber}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Description</h3>
                  <p className="text-muted-foreground">
                    {donation.foodDescription}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Potential Allergens</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {donation.containsAllergen.length > 0 ? (
                      donation.containsAllergen.map((allergen: string) => (
                        <Badge
                          key={allergen}
                          variant="outline"
                          className="border-destructive text-destructive flex items-center gap-1"
                        >
                          <ShieldAlert className="h-3 w-3" />
                          {allergen}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        None specified
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button size="lg" className="w-full mt-8 text-lg">
                <Heart className="mr-2 h-5 w-5" /> Claim This Donation
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
