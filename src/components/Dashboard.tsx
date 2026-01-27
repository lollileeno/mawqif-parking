"use client";

import React, { useState } from "react";
import { useUniversity } from "@/context/UniversityContext";
import { UniversitySelector } from "@/components/UniversitySelector";
import { ParkingLotCard } from "@/components/ParkingLotCard";
import { ParkingMap } from "@/components/ParkingMap";
import { SpotReservationForm } from "@/components/SpotReservationForm";
import { InteractiveMap } from "@/components/InteractiveMap";
import { RecentReservations } from "@/components/RecentReservations";
import { Card, CardContent } from "@/components/ui/Card";
import { mockParkingLots } from "@/data/mockData";
import { ParkingLot, ParkingSpot } from "@/types/parking";

type ViewMode = "lots" | "map" | "reservation";

export function Dashboard() {
  const { currentUniversity, language } = useUniversity();
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("lots");

  const texts = {
    en: {
      selectUniversity: "Select Your University",
      selectDescription: "Choose your university to access parking services",
      parkingLots: "Available Parking Lots",
      totalSpots: "Total Spots",
      available: "Available Now",
      occupied: "Occupied",
      reserved: "Reserved",
    },
    ar: {
      selectUniversity: "اختر جامعتك",
      selectDescription: "اختر جامعتك للوصول إلى خدمات المواقف",
      parkingLots: "المواقف المتاحة",
      totalSpots: "إجمالي المواقف",
      available: "متاح الآن",
      occupied: "مشغول",
      reserved: "محجوز",
    },
  };

  const t = texts[language];

  const stats = {
    total: mockParkingLots.reduce((acc, lot) => acc + lot.totalSpots, 0),
    available: mockParkingLots.reduce((acc, lot) => acc + lot.availableSpots, 0),
    occupied: mockParkingLots.reduce(
      (acc, lot) => acc + (lot.totalSpots - lot.availableSpots),
      0
    ),
  };

  const handleSelectLot = (lot: ParkingLot) => {
    setSelectedLot(lot);
    setViewMode("map");
  };

  const handleReserveSpot = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    setViewMode("reservation");
  };

  const handleBackToLots = () => {
    setSelectedLot(null);
    setSelectedSpot(null);
    setViewMode("lots");
  };

  const handleBackToMap = () => {
    setSelectedSpot(null);
    setViewMode("map");
  };

  if (!currentUniversity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">{t.selectUniversity}</h2>
          <p className="text-muted-foreground">{t.selectDescription}</p>
        </div>
        <UniversitySelector />
      </div>
    );
  }

  // Show parking map view
  if (viewMode === "map" && selectedLot) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ParkingMap
          lot={selectedLot}
          onReserve={handleReserveSpot}
          onBack={handleBackToLots}
        />
      </div>
    );
  }

  // Show reservation view
  if (viewMode === "reservation" && selectedLot && selectedSpot) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SpotReservationForm
          lot={selectedLot}
          spot={selectedSpot}
          onBack={handleBackToMap}
          onComplete={handleBackToLots}
        />
      </div>
    );
  }

  // Default: Show parking lots list
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.totalSpots}</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.available}</p>
                <p className="text-2xl font-bold text-success">{stats.available}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.occupied}</p>
                <p className="text-2xl font-bold text-destructive">{stats.occupied}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reservations */}
      <RecentReservations />

      {/* Interactive Map */}
      <div className="mb-8">
        <InteractiveMap
          lots={mockParkingLots}
          onSelectLot={handleSelectLot}
          selectedLotId={selectedLot?.id}
        />
      </div>

      <h2 className="text-2xl font-bold mb-6">{t.parkingLots}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockParkingLots.map((lot) => (
          <ParkingLotCard key={lot.id} lot={lot} onSelect={handleSelectLot} />
        ))}
      </div>
    </div>
  );
}

interface ReservationModalProps {
  lot: ParkingLot;
  onClose: () => void;
}

function ReservationModal({ lot, onClose }: ReservationModalProps) {
  const { language, userRole } = useUniversity();
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [duration, setDuration] = useState(1);

  const isFreeForUser = lot.freeForRoles?.includes(userRole as "student" | "faculty" | "staff") ?? false;

  const texts = {
    en: {
      title: "Reserve Parking Spot",
      lot: "Parking Lot",
      vehicle: "Vehicle Plate Number",
      duration: "Duration (hours)",
      total: "Total Cost",
      free: "Free",
      confirm: "Confirm Reservation",
      cancel: "Cancel",
      freeParking: "Free parking for university members",
    },
    ar: {
      title: "حجز موقف",
      lot: "الموقف",
      vehicle: "رقم لوحة السيارة",
      duration: "المدة (ساعات)",
      total: "التكلفة الإجمالية",
      free: "مجاني",
      confirm: "تأكيد الحجز",
      cancel: "إلغاء",
      freeParking: "موقف مجاني لمنسوبي الجامعة",
    },
  };

  const t = texts[language];
  const totalCost = isFreeForUser ? 0 : (lot.pricePerHour ? lot.pricePerHour * duration : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      language === "ar"
        ? `تم حجز موقف في ${lot.name.ar} بنجاح!`
        : `Successfully reserved a spot at ${lot.name.en}!`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">{t.title}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t.lot}</label>
              <p className="text-muted-foreground">
                {language === "ar" ? lot.name.ar : lot.name.en}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t.vehicle}</label>
              <input
                type="text"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                placeholder="ABC 1234"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t.duration}</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
                  <option key={h} value={h}>
                    {h} {language === "ar" ? "ساعة" : "hour"}
                    {h > 1 && language === "en" ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between items-center py-3 border-t border-border">
              <span className="font-medium">{t.total}</span>
              <div className="text-right">
                <span className="text-xl font-bold text-primary">
                  {totalCost > 0 ? `${totalCost} SAR` : t.free}
                </span>
                {isFreeForUser && (
                  <p className="text-xs text-success">{t.freeParking} ✓</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                {t.confirm}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
