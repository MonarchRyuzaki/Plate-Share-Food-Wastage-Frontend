import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DonationList from "@/components/donations/DonationList";

export default function AllDonationsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-headline">Find Available Food Donations</h1>
            <p className="text-muted-foreground text-lg mt-2">Browse listings from generous donors in your area.</p>
        </div>
        <DonationList />
      </main>
      <Footer />
    </div>
  );
}
