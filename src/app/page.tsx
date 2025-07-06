import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed, Handshake, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  Share a Plate, Share a Smile
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  PlateShare connects generous donors with surplus food to NGOs who feed the hungry. Together, we can reduce food waste and fight hunger in our communities.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/auth/donor/register">Donate Food</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    <Link href="/auth/ngo/register">Find Food</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Happy people sharing food"
                data-ai-hint="community eating"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A simple process to get surplus food from those who have it to those who need it most.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-4">
                    <UtensilsCrossed className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>1. Donor Lists Food</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  A restaurant, caterer, or individual has surplus food and creates a donation listing on our platform with details about the food items.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                   <div className="mb-4 rounded-full bg-primary/10 p-4">
                    <Handshake className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>2. NGO Finds Donation</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Local NGOs search for available donations, filtering by food type and location to find the perfect match for their needs.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                   <div className="mb-4 rounded-full bg-primary/10 p-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>3. Community is Fed</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  The NGO arranges to pick up the food, and it is distributed to people in need, preventing waste and nourishing the community.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* About Us Section */}
        <section id="abo" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Our Mission</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                At PlateShare, our mission is to build a bridge between abundance and need. We believe that no good food should go to waste, especially when there are people in our communities who go hungry. We leverage technology to create a simple, efficient, and reliable network for food redistribution.
              </p>
            </div>
            <div className="flex space-x-4">
              <Image
                src="https://placehold.co/300x300.png"
                width="300"
                height="300"
                alt="Volunteers smiling"
                data-ai-hint="volunteers smiling"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
              />
              <Image
                src="https://placehold.co/300x300.png"
                width="300"
                height="300"
                alt="Fresh produce"
                data-ai-hint="fresh produce"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover hidden sm:block"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
