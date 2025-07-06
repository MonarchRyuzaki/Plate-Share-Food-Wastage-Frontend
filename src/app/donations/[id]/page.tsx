import Header from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleMap } from "@/components/ui/simple-map";
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

async function getDonationDetails(
  id: string,
  searchParams: { [key: string]: string | string[] | undefined }
) {
  try {
    // Get lat and long from URL parameters, with fallback to default NYC coordinates
    const lat = searchParams.lat ? Number(searchParams.lat) : 40.7128;
    const long = searchParams.long ? Number(searchParams.long) : -74.006;

    // Build query parameters (only lat and long, no filter parameters)
    const params = new URLSearchParams({
      lat: lat.toString(),
      long: long.toString(),
    });

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/api/food-donations/${id}?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch donation details: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Transform the response to match our frontend interface
    const donation = data.donation;
    return {
      _id: donation._id,
      foodTitle: donation.foodTitle,
      foodDescription: donation.foodDescription,
      foodQuantity: donation.foodQuantity.toString(),
      donorName: donation.userId?.name || "Anonymous Donor",
      expiryDate: new Date(donation.expiryDate),
      pickupTime: "Contact donor for pickup time", // Backend doesn't have pickupTime field
      foodType: donation.foodType,
      address: donation.address,
      city: donation.city,
      state: donation.state,
      foodImage:
        donation.foodImage?.[0]?.url || "https://placehold.co/800x400.png",
      aiHint: donation.foodTitle.toLowerCase().replace(/\s+/g, " "), // Generate AI hint from title
      containsAllergen: donation.containsAllergen || [],
      contactPhoneNumber: donation.contactPhoneNumber || "Contact via platform",
      contactEmail: donation.contactEmail || "",
      priority: donation.priority,
      distanceKm: donation.distance || null,
      lat: donation.lat || null, // Use lat from donation or fallback to provided lat
      long: donation.long || null, // Use long from donation or fallback to provided long
    };
  } catch (error) {
    console.error("Error fetching donation details:", error);
    return null;
  }
}

export default async function DonationDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { id } = await params;
  const queryParams = await searchParams;
  const donation = await getDonationDetails(id, queryParams);
  console.log(donation);
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
                  <SimpleMap
                    lat={donation.lat}
                    long={donation.long}
                    address={fullAddress}
                  />
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
                  <Badge className="bg-accent text-accent-foreground">
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
