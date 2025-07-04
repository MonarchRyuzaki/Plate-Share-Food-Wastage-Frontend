import { DonationForm } from "@/components/donations/DonationForm";
import Header from "@/components/layout/Header";
import { ALLERGENS, FOOD_TYPES } from "@/lib/constants";

// This is a mock fetch function. In a real app, you'd fetch this from your API.
async function getDonation(id: string) {
  console.log(`Fetching donation with id: ${id}`);
  if (id === "1") {
      return {
        id: "1",
        foodName: "Leftover Catering Sandwiches",
        description: "A mix of turkey, ham, and veggie sandwiches.",
        quantity: "25 assorted",
        pickupDate: new Date("2024-08-15"),
        pickupTime: "14:30",
        foodType: FOOD_TYPES[4], // Prepared Meals
        allergens: [ALLERGENS[1], ALLERGENS[2]], // Gluten, Dairy
        address: "123 Catering Ln, Foodville",
      };
  }
  return null;
}


export default async function EditDonationPage({ params }: { params: { id: string } }) {
  const donation = await getDonation(params.id);

  if (!donation) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto p-4 md:p-8">
                <h1 className="text-2xl font-bold">Donation not found</h1>
            </main>
        </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold font-headline mb-2">Edit Donation</h1>
            <p className="text-muted-foreground mb-8">
                Update the details of your donation listing below.
            </p>
            <DonationForm donation={donation} />
        </div>
      </main>
    </div>
  );
}
