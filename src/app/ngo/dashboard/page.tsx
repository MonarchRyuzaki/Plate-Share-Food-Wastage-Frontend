import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import Header from "@/components/layout/Header";

// Mock data for donations an NGO has claimed
const claimedDonations = [
  {
    id: "2",
    foodName: "Day-Old Pastries",
    donorName: "The Corner Bakery",
    claimedDate: new Date("2024-08-14"),
    status: "Claimed" as "Claimed" | "Picked Up",
  },
  {
    id: "6",
    foodName: "Whole Chickens",
    donorName: "Butcher Block",
    claimedDate: new Date("2024-08-15"),
    status: "Picked Up" as "Claimed" | "Picked Up",
  },
  {
    id: "3",
    foodName: "Cheddar Cheese Blocks",
    donorName: "Dairy Farms Inc.",
    claimedDate: new Date("2024-08-18"),
    status: "Claimed" as "Claimed" | "Picked Up",
  },
];

export default function NgoDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8 container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-headline">My Claimed Donations</h1>
           <Button asChild variant="outline">
            <Link href="/donations">
              Find New Donations
            </Link>
          </Button>
        </div>

        <div className="rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Food Item</TableHead>
                <TableHead>From Donor</TableHead>
                <TableHead>Claimed On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claimedDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">
                    <Link href={`/donations/${donation.id}`} className="hover:underline">
                      {donation.foodName}
                    </Link>
                  </TableCell>
                  <TableCell>{donation.donorName}</TableCell>
                  <TableCell>{format(donation.claimedDate, "PPP")}</TableCell>
                  <TableCell>
                    <Badge variant={donation.status === "Picked Up" ? "secondary" : "default"} className={donation.status === "Claimed" ? "bg-blue-600 text-white" : ""}>
                        {donation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                           <Link href={`/donations/${donation.id}`}>View Details</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
