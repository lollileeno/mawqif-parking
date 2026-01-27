"use client";

import React, { useEffect, useState } from "react";
import { useUniversity } from "@/context/UniversityContext";
import { ParkingLot } from "@/types/parking";
import { Button } from "@/components/ui/Button";

interface InteractiveMapProps {
  lots: ParkingLot[];
  onSelectLot: (lot: ParkingLot) => void;
  selectedLotId?: string;
}

export function InteractiveMap({ lots, onSelectLot, selectedLotId }: InteractiveMapProps) {
  const { language, currentUniversity } = useUniversity();
  const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Dynamically import Leaflet components (client-side only)
    const loadMap = async () => {
      const L = await import("leaflet");
      const { MapContainer, TileLayer, Marker, Popup, useMap } = await import("react-leaflet");

      // Fix Leaflet default marker icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      // Create custom marker icons based on availability
      const createIcon = (available: number, total: number) => {
        const percentage = (available / total) * 100;
        let color = "#22c55e"; // green
        if (percentage < 20) color = "#ef4444"; // red
        else if (percentage < 50) color = "#f59e0b"; // yellow

        return L.divIcon({
          className: "custom-marker",
          html: `
            <div style="
              background: ${color};
              width: 40px;
              height: 40px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid white;
              box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            ">
              <span style="
                transform: rotate(45deg);
                color: white;
                font-weight: bold;
                font-size: 12px;
              ">${available}</span>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        });
      };

      // Map component wrapper
      const MapWrapper = ({ lots, onSelectLot, selectedLotId }: InteractiveMapProps) => {
        const center: [number, number] = [24.7136, 46.6753]; // Riyadh center

        return (
          <MapContainer
            center={center}
            zoom={14}
            style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {lots.map((lot) => (
              <Marker
                key={lot.id}
                position={[lot.location.lat, lot.location.lng]}
                icon={createIcon(lot.availableSpots, lot.totalSpots)}
                eventHandlers={{
                  click: () => onSelectLot(lot),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-base mb-2">
                      {language === "ar" ? lot.name.ar : lot.name.en}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-gray-500">{language === "ar" ? "متاح:" : "Available:"}</span>{" "}
                        <span className="font-semibold text-green-600">{lot.availableSpots}</span>
                        <span className="text-gray-400"> / {lot.totalSpots}</span>
                      </p>
                      <p>
                        <span className="text-gray-500">{language === "ar" ? "ساعات العمل:" : "Hours:"}</span>{" "}
                        {lot.operatingHours.open} - {lot.operatingHours.close}
                      </p>
                    </div>
                    <button
                      onClick={() => onSelectLot(lot)}
                      className="mt-3 w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      {language === "ar" ? "عرض المواقف" : "View Spots"}
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        );
      };

      setMapComponent(() => MapWrapper);
      setIsLoaded(true);
    };

    loadMap();
  }, [language]);

  const texts = {
    en: {
      loading: "Loading map...",
      mapTitle: "Parking Locations",
      legend: "Legend",
      available: "Many spots available",
      limited: "Limited spots",
      full: "Almost full",
    },
    ar: {
      loading: "جاري تحميل الخريطة...",
      mapTitle: "مواقع المواقف",
      legend: "الدليل",
      available: "مواقف متاحة كثيرة",
      limited: "مواقف محدودة",
      full: "شبه ممتلئ",
    },
  };

  const t = texts[language];

  if (!isLoaded || !MapComponent) {
    return (
      <div className="h-[400px] bg-muted rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t.mapTitle}</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span>{t.available}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span>{t.limited}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span>{t.full}</span>
          </div>
        </div>
      </div>
      <div className="h-[400px] rounded-xl overflow-hidden border border-border shadow-lg">
        <MapComponent lots={lots} onSelectLot={onSelectLot} selectedLotId={selectedLotId} />
      </div>
    </div>
  );
}
