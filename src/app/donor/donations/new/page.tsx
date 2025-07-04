import { DonationForm } from "@/components/donations/DonationForm";
import Header from "@/components/layout/Header";

export default function NewDonationPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold font-headline mb-2">Create a New Donation</h1>
            <p className="text-muted-foreground mb-8">
                Fill out the form below to list your surplus food. Thank you for your generosity!
            </p>
            <DonationForm />
        </div>
      </main>
    </div>
  );
}
