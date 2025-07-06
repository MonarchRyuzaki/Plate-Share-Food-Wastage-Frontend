"use client";

import { MapPin } from "lucide-react";

interface SimpleMapProps {
  lat: number | null;
  long: number | null;
  address?: string;
  className?: string;
}

export function SimpleMap({
  lat,
  long,
  address,
  className = "",
}: SimpleMapProps) {
  // If coordinates are not available, show a message
  if (lat === null || long === null) {
    return (
      <div
        className={`flex items-center justify-center h-64 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25 ${className}`}
      >
        <div className="text-center text-muted-foreground">
          <MapPin className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm font-medium">
            Location coordinates not available
          </p>
          <p className="text-xs">Unable to display map for this donation</p>
        </div>
      </div>
    );
  }

  // Create the embedded map URL (using OpenStreetMap via iframe)
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    long - 0.01
  },${lat - 0.01},${long + 0.01},${
    lat + 0.01
  }&layer=mapnik&marker=${lat},${long}`;

  return (
    <div className={`relative rounded-lg overflow-hidden border ${className}`}>
      <iframe
        src={mapUrl}
        width="100%"
        height="256"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map showing location${address ? ` at ${address}` : ""}`}
        className="w-full"
      />
      <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground">
        {lat.toFixed(4)}, {long.toFixed(4)}
      </div>
    </div>
  );
}
