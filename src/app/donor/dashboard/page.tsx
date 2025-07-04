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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import Header from "@/components/layout/Header";

// Mock data for donations
const donations = [
  {
    id: "1",
    foodName: "Leftover Catering Sandwiches",
    quantity: "25 assorted",
    pickupDate: new Date("2024-08-15"),
    foodType: "Prepared Meals",
    status: "Available" as "Available" | "Claimed",
  },
  {
    id: "2",
    foodName: "Day-Old Pastries",
    quantity: "3 boxes",
    pickupDate: new Date("2024-08-14"),
    foodType: "Bakery",
    status: "Claimed" as "Available" | "Claimed",
  },
    {
    id: "3",
    foodName: "Surplus Canned Beans",
    quantity: "2 cases",
    pickupDate: new Date("2024-08-20"),
    foodType: "Pantry Staples",
    status: "Available" as "Available" | "Claimed",
  },
];

export default function DonorDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8 container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-headline">My Donations</h1>
          <Button asChild>
            <Link href="/donor/donations/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Donation
            </Link>
          </Button>
        </div>

        <div className="rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Food Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Pickup By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">{donation.foodName}</TableCell>
                  <TableCell>{donation.quantity}</TableCell>
                  <TableCell>{format(donation.pickupDate, "PPP")}</TableCell>
                  <TableCell>
                    <Badge variant={donation.status === "Available" ? "default" : "secondary"} className={donation.status === "Available" ? "bg-green-600 text-white" : ""}>
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
                            <Link href={`/donor/donations/${donation.id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete
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
