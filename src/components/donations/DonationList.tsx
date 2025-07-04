'use client';
import React, { useState, useEffect } from "react";
import { DonationFilter, FilterState } from "@/components/donations/DonationFilter";
import { DonationCard, Donation } from "@/components/donations/DonationCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Utensils } from "lucide-react";

// This is the same data that was on the NGO dashboard
const allDonations: Donation[] = [
  { id: '1', foodName: 'Artisan Bread Loaves', donorName: 'The Corner Bakery', pickupDate: new Date('2024-08-16'), foodType: 'Bakery', location: 'New York, NY', imageUrl: 'https://placehold.co/400x200.png', aiHint: 'artisan bread'},
  { id: '2', foodName: 'Fresh Organic Salads', donorName: 'Green Leaf Cafe', pickupDate: new Date('2024-08-15'), foodType: 'Prepared Meals', location: 'New York, NY', imageUrl: 'https://placehold.co/400x200.png', aiHint: 'fresh salad'},
  { id: '3', foodName: 'Cheddar Cheese Blocks', donorName: 'Dairy Farms Inc.', pickupDate: new Date('2024-08-20'), foodType: 'Dairy & Eggs', location: 'Brooklyn, NY', imageUrl: 'https://placehold.co/400x200.png', aiHint: 'cheese block'},
  { id: '4', foodName: 'Assorted Canned Goods', donorName: 'Pantry Plus', pickupDate: new Date('2024-09-01'), foodType: 'Pantry Staples', location: 'New York, NY', imageUrl: 'https://placehold.co/400x200.png', aiHint: 'canned food'},
  { id: '5', foodName: 'Fresh Apples and Oranges', donorName: 'City Farmers Market', pickupDate: new Date('2024-08-18'), foodType: 'Produce', location: 'Queens, NY', imageUrl: 'https://placehold.co/400x200.png', aiHint: 'apples oranges' },
  { id: '6', foodName: 'Whole Chickens', donorName: 'Butcher Block', pickupDate: new Date('2024-08-15'), foodType: 'Meat & Fish', location: 'New York, NY', imageUrl: 'https://placehold.co/400x200.png', aiHint: 'raw chicken' },
];

export default function DonationList() {
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>(allDonations);
  const [filters, setFilters] = useState<FilterState | null>(null);

  useEffect(() => {
    if (filters) {
      // In a real app, this logic would be on the backend.
      let donations = allDonations;
      if (filters.location) {
        donations = donations.filter(d => d.location.toLowerCase().includes(filters.location.toLowerCase()));
      }
      if (filters.preferredFood.length > 0) {
        donations = donations.filter(d => filters.preferredFood.includes(d.foodType));
      }
      if (filters.rejectedFood.length > 0) {
        donations = donations.filter(d => !filters.rejectedFood.includes(d.foodType));
      }
      // Allergen filtering would require more data on each donation
      setFilteredDonations(donations);
    } else {
        setFilteredDonations(allDonations)
    }
  }, [filters]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <DonationFilter onFilterChange={setFilters} />
      </div>
      <div className="lg:col-span-3">
        {filteredDonations.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDonations.map((donation) => (
                    <DonationCard key={donation.id} donation={donation} />
                ))}
             </div>
        ) : (
            <Alert>
                <Utensils className="h-4 w-4" />
                <AlertTitle>No Donations Found</AlertTitle>
                <AlertDescription>
                    No donations match your current filter criteria. Try broadening your search.
                </AlertDescription>
            </Alert>
        )}
      </div>
    </div>
  );
}
