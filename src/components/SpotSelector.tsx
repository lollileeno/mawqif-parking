"use client";

import React, { useState, useMemo } from "react";
import { useUniversity } from "@/context/UniversityContext";
import { ParkingLot, ParkingSpot } from "@/types/parking";
import { generateMockSpots } from "@/data/mockData";
import { Button } from "@/components/ui/Button";

interface SpotSelectorProps {
  lot: ParkingLot;
  onSelectSpot: (spot: ParkingSpot) => void;
  onBack: () => void;
}

export function SpotSelector({ lot, onSelectSpot, onBack }: SpotSelectorProps) {
  const { language } = useUniversity();
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);

  const spots = useMemo(() => generateMockSpots(lot.id, lot.totalSpots), [lot]);
  
  const floors = useMemo(() => {
    const uniqueFloors = [...new Set(spots.map((s) => s.floor || 1))];
    return uniqueFloors.sort((a, b) => a - b);
  }, [spots]);

  const filteredSpots = spots.filter((s) => (s.floor || 1) === selectedFloor);

  const texts = {
    en: {
      selectSpot: "Select a Parking Spot",
      floor: "Floor",
      legend: "Legend",
      available: "Available",
      occupied: "Occupied",
      reserved: "Reserved",
      maintenance: "Maintenance",
      handicapped: "Handicapped",
      ev: "EV Charging",
      back: "Back",
      confirm: "Confirm Selection",
      selected: "Selected",
    },
    ar: {
      selectSpot: "اختر موقف",
      floor: "الطابق",
      legend: "الدليل",
      available: "متاح",
      occupied: "مشغول",
      reserved: "محجوز",
      maintenance: "صيانة",
      handicapped: "ذوي الاحتياجات",
      ev: "شحن كهربائي",
      back: "رجوع",
      confirm: "تأكيد الاختيار",
      selected: "المحدد",
    },
  };

  const t = texts[language];

  const getSpotColor = (spot: ParkingSpot) => {
    if (selectedSpot?.id === spot.id) return "bg-primary text-primary-foreground ring-2 ring-offset-2 ring-primary";
    
    switch (spot.status) {
      case "available":
        return "bg-success/20 text-success hover:bg-success/30 cursor-pointer";
      case "occupied":
        return "bg-destructive/20 text-destructive cursor-not-allowed";
      case "reserved":
        return "bg-warning/20 text-warning cursor-not-allowed";
      case "maintenance":
        return "bg-muted text-muted-foreground cursor-not-allowed";
      default:
        return "bg-muted";
    }
  };

  const getSpotIcon = (spot: ParkingSpot) => {
    switch (spot.type) {
      case "handicapped":
        return "♿";
      case "ev":
        return "⚡";
      case "reserved":
        return "🅿️";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t.selectSpot}</h2>
          <p className="text-muted-foreground">
            {language === "ar" ? lot.name.ar : lot.name.en}
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          {t.back}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
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

      <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg text-sm">
        <span className="font-medium">{t.legend}:</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-success/20" />
          <span>{t.available}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-destructive/20" />
          <span>{t.occupied}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-warning/20" />
          <span>{t.reserved}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>♿</span>
          <span>{t.handicapped}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>⚡</span>
          <span>{t.ev}</span>
        </div>
      </div>

      <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-2">
        {filteredSpots.map((spot) => (
          <button
            key={spot.id}
            className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all ${getSpotColor(spot)}`}
            onClick={() => spot.status === "available" && setSelectedSpot(spot)}
            disabled={spot.status !== "available"}
            title={spot.spotNumber}
          >
            {getSpotIcon(spot) || spot.spotNumber.slice(-2)}
          </button>
        ))}
      </div>

      {selectedSpot && (
        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
          <div>
            <span className="text-sm text-muted-foreground">{t.selected}:</span>
            <span className="ml-2 font-bold text-primary">{selectedSpot.spotNumber}</span>
          </div>
          <Button onClick={() => onSelectSpot(selectedSpot)}>
            {t.confirm}
          </Button>
        </div>
      )}
    </div>
  );
}
