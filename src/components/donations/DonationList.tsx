"use client";
import { Donation, DonationCard } from "@/components/donations/DonationCard";
import { DonationFilter } from "@/components/donations/DonationFilter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Utensils } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  moreResultsAvailable?: boolean;
}

interface DonationResponse {
  donations: Donation[];
  pagination: PaginationInfo;
}

export default function DonationList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [donations, setDonations] = useState<Donation[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current page from URL
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Read filters from URL parameters
      const lat = searchParams.get("lat")
        ? Number(searchParams.get("lat"))
        : 40.7128;
      const long = searchParams.get("long")
        ? Number(searchParams.get("long"))
        : -74.006;
      const distance = searchParams.get("distance")
        ? Number(searchParams.get("distance"))
        : 10;

      // Build query parameters
      const params = new URLSearchParams({
        lat: lat.toString(),
        long: long.toString(),
        distance: distance.toString(),
        page: currentPage.toString(),
      });

      // Add filter parameters from URL - only if they have values
      const priorities = searchParams.get("priorities");
      if (priorities && priorities.trim()) {
        params.append("priority", priorities);
      }

      const preferredFood = searchParams.get("preferredFood");
      if (preferredFood && preferredFood.trim()) {
        params.append("prefersFoodType", preferredFood);
      }

      const rejectedFood = searchParams.get("rejectedFood");
      if (rejectedFood && rejectedFood.trim()) {
        const neededRejectedFood = JSON.parse(rejectedFood).map((item: any) => item.specific || item.parent);
        params.append("rejectsFoodType", JSON.stringify(neededRejectedFood));
      }
      
      const avoidAllergens = searchParams.get("avoidAllergens");
      if (avoidAllergens && avoidAllergens.trim()) {
        const avoidedAllergens = JSON.parse(avoidAllergens).map((item: any) => item.specific || item.parent);
        params.append("avoidsAllergens", JSON.stringify(avoidedAllergens));
      }

      console.log("Fetching donations with params:", params.toString());

      // Add cache-busting timestamp to prevent 304 responses
      params.append("_t", Date.now().toString());

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/food-donations?${params.toString()}`,
        {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(
          `Failed to fetch donations: ${response.status} ${response.statusText}`
        );
      }

      const data: DonationResponse = await response.json();
      console.log("API Response:", data);

      // Transform the data to match our frontend interface
      const transformedDonations = data.donations.map((donation: any) => ({
        ...donation,
        donorName: donation.userId?.name || "Anonymous Donor",
        foodImage:
          donation.foodImage?.[0]?.url || "https://placehold.co/400x200.png",
        expiryDate: new Date(donation.expiryDate),
      }));

      console.log("Transformed donations:", transformedDonations);
      setDonations(transformedDonations);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching donations:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch donations"
      );
      setDonations([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch donations when URL parameters change
  useEffect(() => {
    fetchDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <DonationFilter />
        </div>
        <div className="lg:col-span-3">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading donations...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <DonationFilter />
        </div>
        <div className="lg:col-span-3">
          <Alert variant="destructive">
            <Utensils className="h-4 w-4" />
            <AlertTitle>Error Loading Donations</AlertTitle>
            <AlertDescription>
              {error}. Please try again later.
              <Button
                variant="outline"
                className="mt-2 ml-2"
                onClick={() => fetchDonations()}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <DonationFilter />
      </div>
      <div className="lg:col-span-3">
        {donations.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {donations.map((donation) => (
                <DonationCard key={donation._id} donation={donation} />
              ))}
            </div>
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4 mt-8">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= pagination.totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
            {pagination?.moreResultsAvailable && (
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  More results may be available. Try adjusting your filters for
                  better results.
                </p>
              </div>
            )}
          </>
        ) : (
          <Alert>
            <Utensils className="h-4 w-4" />
            <AlertTitle>No Donations Found</AlertTitle>
            <AlertDescription>
              No donations match your current filter criteria. Try broadening
              your search or adjusting your location.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
