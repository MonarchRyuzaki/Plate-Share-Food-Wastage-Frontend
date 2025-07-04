import { logout } from "@/app/auth/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Utensils } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

const Header = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("plateshare-auth-token")?.value;
  const userName = cookieStore.get("plateshare-user-name")?.value;
  const userRole = cookieStore.get("plateshare-user-role")?.value;

  const userInitial = userName ? userName.charAt(0).toUpperCase() : "";
  const dashboardHref =
    userRole?.toLowerCase() === "donor" ? "/donor/dashboard" : "/ngo/dashboard";

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
      <Link href="/" className="flex items-center justify-center">
        <Utensils className="h-6 w-6 text-primary" />
        <span className="ml-2 text-xl font-bold font-headline">PlateShare</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        {token && userName && userRole ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Welcome, {userName}!</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={dashboardHref}>Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form action={logout} className="w-full">
                  <button
                    type="submit"
                    className="w-full text-left px-2 py-1.5 text-sm flex items-center cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <div className="hidden sm:flex gap-4">
              <Button variant="ghost" asChild>
                <Link href="/auth/donor/login">Donor Login</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/auth/ngo/login">NGO Login</Link>
              </Button>
            </div>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link href="/auth/donor/register">Get Started</Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
