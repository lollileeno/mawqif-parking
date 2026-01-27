"use client";

import React, { useState, useMemo } from "react";
import { useUniversity } from "@/context/UniversityContext";
import { ParkingLot, ParkingSpot } from "@/types/parking";
import { generateMockSpots } from "@/data/mockData";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

interface ParkingMapProps {
  lot: ParkingLot;
  onReserve: (spot: ParkingSpot) => void;
  onBack: () => void;
}

export function ParkingMap({ lot, onReserve, onBack }: ParkingMapProps) {
  const { language, userRole } = useUniversity();
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [hoveredSpot, setHoveredSpot] = useState<ParkingSpot | null>(null);

  const spots = useMemo(() => generateMockSpots(lot.id, lot.totalSpots), [lot]);

  const floors = useMemo(() => {
    const uniqueFloors = [...new Set(spots.map((s) => s.floor || 1))];
    return uniqueFloors.sort((a, b) => a - b);
  }, [spots]);

  const filteredSpots = spots.filter((s) => (s.floor || 1) === selectedFloor);
  const sections = [...new Set(filteredSpots.map((s) => s.section))].sort();

  const isFreeForUser = lot.freeForRoles?.includes(userRole as "student" | "faculty" | "staff") ?? false;

  const texts = {
    en: {
      backToLots: "Back to Parking Lots",
      floor: "Floor",
      section: "Section",
      spot: "Spot",
      status: "Status",
      type: "Type",
      selectSpot: "Click on an available spot to select",
      available: "Available",
      occupied: "Occupied",
      reserved: "Reserved",
      maintenance: "Under Maintenance",
      regular: "Regular",
      handicapped: "Handicapped",
      ev: "EV Charging",
      reservedType: "Reserved",
      reserve: "Reserve This Spot",
      price: "Price",
      free: "Free",
      perHour: "/hour",
      location: "Location",
      hours: "Operating Hours",
      totalSpots: "Total Spots",
      availableNow: "Available Now",
      entrance: "ENTRANCE",
      exit: "EXIT",
      road: "ROAD",
    },
    ar: {
      backToLots: "العودة للمواقف",
      floor: "الطابق",
      section: "القسم",
      spot: "الموقف",
      status: "الحالة",
      type: "النوع",
      selectSpot: "انقر على موقف متاح للاختيار",
      available: "متاح",
      occupied: "مشغول",
      reserved: "محجوز",
      maintenance: "تحت الصيانة",
      regular: "عادي",
      handicapped: "ذوي الاحتياجات",
      ev: "شحن كهربائي",
      reservedType: "محجوز",
      reserve: "احجز هذا الموقف",
      price: "السعر",
      free: "مجاني",
      perHour: "/ساعة",
      location: "الموقع",
      hours: "ساعات العمل",
      totalSpots: "إجمالي المواقف",
      availableNow: "متاح الآن",
      entrance: "المدخل",
      exit: "المخرج",
      road: "الطريق",
    },
  };

  const t = texts[language];

  const getSpotStyle = (spot: ParkingSpot) => {
    const isSelected = selectedSpot?.id === spot.id;
    const isHovered = hoveredSpot?.id === spot.id;

    let bgColor = "";
    let textColor = "";
    let cursor = "cursor-not-allowed";
    let transform = "";
    let shadow = "";

    switch (spot.status) {
      case "available":
        bgColor = isSelected ? "bg-primary" : isHovered ? "bg-success/80" : "bg-success/60";
        textColor = isSelected ? "text-primary-foreground" : "text-success-foreground";
        cursor = "cursor-pointer";
        if (isHovered || isSelected) {
          transform = "scale-105";
          shadow = "shadow-lg";
        }
        break;
      case "occupied":
        bgColor = "bg-destructive/70";
        textColor = "text-destructive-foreground";
        break;
      case "reserved":
        bgColor = "bg-warning/70";
        textColor = "text-warning-foreground";
        break;
      case "maintenance":
        bgColor = "bg-muted";
        textColor = "text-muted-foreground";
        break;
    }

    return `${bgColor} ${textColor} ${cursor} ${shadow} transition-all duration-200 ${transform}`;
  };

  const getSpotIcon = (spot: ParkingSpot) => {
    switch (spot.type) {
      case "handicapped":
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 16h-3l-2.5-5H13v-2h3l1 2h4v2h-2.5l2 3H21v2zm-9-3c-2.5 0-4.5-2-4.5-4.5S9.5 6 12 6c.8 0 1.5.2 2.2.5l-1.5 1.5c-.2-.1-.5-.1-.7-.1-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5c.9 0 1.7-.5 2.1-1.2l1.5 1.5c-.8 1.1-2.1 1.8-3.6 1.8z"/>
          </svg>
        );
      case "ev":
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
          </svg>
        );
      case "reserved":
        return <span className="text-xs font-bold">R</span>;
      default:
        return null;
    }
  };

  const handleSpotClick = (spot: ParkingSpot) => {
    if (spot.status === "available") {
      setSelectedSpot(spot);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
            ← {t.backToLots}
          </Button>
          <h2 className="text-2xl font-bold">
            {language === "ar" ? lot.name.ar : lot.name.en}
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-3 py-1 bg-success/20 text-success rounded-full font-medium">
            {lot.availableSpots} {t.availableNow}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Info & Legend */}
        <div className="lg:col-span-1 space-y-4">
          {/* Lot Info */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold">{t.location}</h3>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-xs text-muted-foreground">
                      {lot.location.lat.toFixed(4)}, {lot.location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">{t.hours}</p>
                  <p className="font-medium">{lot.operatingHours.open} - {lot.operatingHours.close}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t.price}</p>
                  <p className="font-medium text-success">
                    {isFreeForUser ? t.free : `${lot.pricePerHour || 0} SAR${t.perHour}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">{t.status}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-success/60" />
                  <span className="text-sm">{t.available}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-destructive/70" />
                  <span className="text-sm">{t.occupied}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-warning/70" />
                  <span className="text-sm">{t.reserved}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-muted" />
                  <span className="text-sm">{t.maintenance}</span>
                </div>
              </div>
              <h3 className="font-semibold mt-4 mb-3">{t.type}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 16h-3l-2.5-5H13v-2h3l1 2h4v2h-2.5l2 3H21v2zm-9-3c-2.5 0-4.5-2-4.5-4.5S9.5 6 12 6c.8 0 1.5.2 2.2.5l-1.5 1.5c-.2-.1-.5-.1-.7-.1-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5c.9 0 1.7-.5 2.1-1.2l1.5 1.5c-.8 1.1-2.1 1.8-3.6 1.8z"/>
                    </svg>
                  </div>
                  <span className="text-sm">{t.handicapped}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
                    </svg>
                  </div>
                  <span className="text-sm">{t.ev}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Parking Map */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-4">
              {/* Floor Selector */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                {floors.map((floor) => (
                  <Button
                    key={floor}
                    variant={selectedFloor === floor ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFloor(floor)}
                  >
                    {t.floor} {floor}
                  </Button>
                ))}
              </div>

              {/* Parking Layout */}
              <div className="bg-muted/30 rounded-xl p-4 min-h-[400px]">
                {/* Road at top */}
                <div className="flex items-center justify-center gap-4 mb-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                    <span className="px-2 py-1 bg-success rounded text-white">{t.entrance} →</span>
                    <div className="w-32 h-1 bg-gray-400 rounded" />
                    <span className="text-gray-500">{t.road}</span>
                    <div className="w-32 h-1 bg-gray-400 rounded" />
                    <span className="px-2 py-1 bg-destructive rounded text-white">← {t.exit}</span>
                  </div>
                </div>

                {/* Parking Sections */}
                <div className="space-y-6">
                  {sections.map((section) => {
                    const sectionSpots = filteredSpots.filter((s) => s.section === section);
                    const rows = [];
                    for (let i = 0; i < sectionSpots.length; i += 10) {
                      rows.push(sectionSpots.slice(i, i + 10));
                    }

                    return (
                      <div key={section} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-muted-foreground">
                            {t.section} {section}
                          </span>
                          <div className="flex-1 h-px bg-border" />
                        </div>
                        
                        {rows.map((row, rowIndex) => (
                          <div key={rowIndex} className="flex justify-center gap-1">
                            {/* Left parking row */}
                            <div className="flex gap-1">
                              {row.slice(0, 5).map((spot) => (
                                <button
                                  key={spot.id}
                                  className={`w-12 h-16 rounded-lg flex flex-col items-center justify-center text-xs font-medium border-2 border-transparent hover:border-primary/50 ${getSpotStyle(spot)}`}
                                  onClick={() => handleSpotClick(spot)}
                                  onMouseEnter={() => setHoveredSpot(spot)}
                                  onMouseLeave={() => setHoveredSpot(null)}
                                  disabled={spot.status !== "available"}
                                  title={`${spot.spotNumber} - ${t[spot.status as keyof typeof t]}`}
                                >
                                  {getSpotIcon(spot) || (
                                    <>
                                      <svg className="w-5 h-5 mb-0.5 opacity-50" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M5 11l1.5-4.5h11L19 11m-1.5 5a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 011.5-1.5 1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5m-11 0A1.5 1.5 0 015 14.5 1.5 1.5 0 016.5 13 1.5 1.5 0 018 14.5 1.5 1.5 0 016.5 16M18.92 6c-.2-.58-.76-1-1.42-1h-11c-.66 0-1.22.42-1.42 1L3 12v8a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-8l-2.08-6z"/>
                                      </svg>
                                      <span className="text-[10px]">{spot.spotNumber.slice(-3)}</span>
                                    </>
                                  )}
                                </button>
                              ))}
                            </div>

                            {/* Driving lane */}
                            <div className="w-8 flex items-center justify-center">
                              <div className="w-1 h-full bg-gray-300 dark:bg-gray-600 rounded" />
                            </div>

                            {/* Right parking row */}
                            <div className="flex gap-1">
                              {row.slice(5, 10).map((spot) => (
                                <button
                                  key={spot.id}
                                  className={`w-12 h-16 rounded-lg flex flex-col items-center justify-center text-xs font-medium border-2 border-transparent hover:border-primary/50 ${getSpotStyle(spot)}`}
                                  onClick={() => handleSpotClick(spot)}
                                  onMouseEnter={() => setHoveredSpot(spot)}
                                  onMouseLeave={() => setHoveredSpot(null)}
                                  disabled={spot.status !== "available"}
                                  title={`${spot.spotNumber} - ${t[spot.status as keyof typeof t]}`}
                                >
                                  {getSpotIcon(spot) || (
                                    <>
                                      <svg className="w-5 h-5 mb-0.5 opacity-50" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M5 11l1.5-4.5h11L19 11m-1.5 5a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 011.5-1.5 1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5m-11 0A1.5 1.5 0 015 14.5 1.5 1.5 0 016.5 13 1.5 1.5 0 018 14.5 1.5 1.5 0 016.5 16M18.92 6c-.2-.58-.76-1-1.42-1h-11c-.66 0-1.22.42-1.42 1L3 12v8a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-8l-2.08-6z"/>
                                      </svg>
                                      <span className="text-[10px]">{spot.spotNumber.slice(-3)}</span>
                                    </>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selection Info */}
              {selectedSpot ? (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{t.spot}: {selectedSpot.spotNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {t.section} {selectedSpot.section} • {t.floor} {selectedSpot.floor}
                    </p>
                  </div>
                  <Button onClick={() => onReserve(selectedSpot)}>
                    {t.reserve}
                  </Button>
                </div>
              ) : (
                <p className="mt-4 text-center text-muted-foreground text-sm">
                  {t.selectSpot}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
