import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import { ALLERGENS, FOOD_TYPES } from "@/lib/constants";
import { Calendar, Clock, Heart, MapPin, Phone, Utensils } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

async function getDonationDetails(id: string) {
    console.log(`Fetching details for donation: ${id}`);
    // Mock data based on ID
    const mockData: { [key: string]: any } = {
        '1': { id: '1', foodName: 'Artisan Bread Loaves', quantity: 'Approx. 30 loaves', donorName: 'The Corner Bakery', pickupDate: new Date('2024-08-16'), pickupTime: '10:00', foodType: 'Bakery', location: '123 Bread Lane, New York, NY', imageUrl: 'https://placehold.co/800x400.png', aiHint: 'artisan bread', description: 'A variety of freshly baked artisan breads, including sourdough and multigrain. Best if used within 2 days.', allergens: ['Gluten'], contact: '555-0101' },
        '2': { id: '2', foodName: 'Fresh Organic Salads', quantity: '15 large bowls', donorName: 'Green Leaf Cafe', pickupDate: new Date('2024-08-15'), pickupTime: '18:00', foodType: 'Prepared Meals', location: '456 Salad St, New York, NY', imageUrl: 'https://placehold.co/800x400.png', aiHint: 'fresh salad', description: 'Mixed green salads with grilled chicken and a light vinaigrette. Contains nuts in a separate container.', allergens: ['Nuts'], contact: '555-0102' },
    };
    return mockData[id] || null;
}


export default async function DonationDetailPage({ params }: { params: { id: string } }) {
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
        )
    }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-secondary py-8 md:py-12">
        <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                     <Image
                        src={donation.imageUrl}
                        alt={donation.foodName}
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
                            <p className="mb-4">{donation.location}</p>
                            {/* Placeholder for map */}
                            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                                <p className="text-muted-foreground">Map Placeholder</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Badge variant="secondary">{donation.foodType}</Badge>
                    <h1 className="text-4xl font-bold font-headline mt-2">{donation.foodName}</h1>
                    <p className="text-lg text-muted-foreground mt-1">from {donation.donorName}</p>
                    
                    <Card className="my-6">
                        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-start space-x-3">
                                <Utensils className="h-6 w-6 text-primary mt-1"/>
                                <div>
                                    <p className="font-semibold">Quantity</p>
                                    <p className="text-muted-foreground">{donation.quantity}</p>
                                </div>
                            </div>
                             <div className="flex items-start space-x-3">
                                <Calendar className="h-6 w-6 text-primary mt-1"/>
                                <div>
                                    <p className="font-semibold">Pickup By</p>
                                    <p className="text-muted-foreground">{format(donation.pickupDate, "EEEE, MMMM d")}</p>
                                </div>
                            </div>
                             <div className="flex items-start space-x-3">
                                <Clock className="h-6 w-6 text-primary mt-1"/>
                                <div>
                                    <p className="font-semibold">Available After</p>
                                    <p className="text-muted-foreground">{donation.pickupTime}</p>
                                </div>
                            </div>
                             <div className="flex items-start space-x-3">
                                <Phone className="h-6 w-6 text-primary mt-1"/>
                                <div>
                                    <p className="font-semibold">Contact</p>
                                    <p className="text-muted-foreground">{donation.contact}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-lg">Description</h3>
                            <p className="text-muted-foreground">{donation.description}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Potential Allergens</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {donation.allergens.map((allergen: string) => (
                                    <Badge key={allergen} variant="outline" className="border-red-500 text-red-700">{allergen}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Button size="lg" className="w-full mt-8 text-lg">
                        <Heart className="mr-2 h-5 w-5"/> Claim This Donation
                    </Button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
