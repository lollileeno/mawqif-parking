"use client";

import React, { useState } from "react";
import { useUniversity } from "@/context/UniversityContext";
import { ParkingLot, ParkingSpot } from "@/types/parking";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface SpotReservationFormProps {
  lot: ParkingLot;
  spot: ParkingSpot;
  onBack: () => void;
  onComplete: () => void;
}

export function SpotReservationForm({ lot, spot, onBack, onComplete }: SpotReservationFormProps) {
  const { language, userRole, addReservation } = useUniversity();
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [duration, setDuration] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reservationId, setReservationId] = useState("");

  const isFreeForUser = lot.freeForRoles?.includes(userRole as "student" | "faculty" | "staff") ?? false;
  const totalCost = isFreeForUser ? 0 : (lot.pricePerHour ? lot.pricePerHour * duration : 0);

  const texts = {
    en: {
      title: "Complete Your Reservation",
      backToMap: "Back to Map",
      spotDetails: "Spot Details",
      spotNumber: "Spot Number",
      section: "Section",
      floor: "Floor",
      type: "Type",
      parkingLot: "Parking Lot",
      vehicleInfo: "Vehicle Information",
      plateNumber: "Plate Number",
      platePlaceholder: "Enter your plate number",
      duration: "Parking Duration",
      hours: "hours",
      hour: "hour",
      paymentSummary: "Payment Summary",
      hourlyRate: "Hourly Rate",
      totalDuration: "Total Duration",
      totalCost: "Total Cost",
      free: "Free",
      freeNote: "Free parking for university students & faculty",
      confirm: "Confirm Reservation",
      processing: "Processing...",
      success: "Reservation Confirmed!",
      successMessage: "Your parking spot has been reserved successfully.",
      reservationId: "Reservation ID",
      spotTypes: {
        regular: "Regular",
        handicapped: "Handicapped",
        ev: "EV Charging",
        reserved: "Reserved",
      },
    },
    ar: {
      title: "أكمل حجزك",
      backToMap: "العودة للخريطة",
      spotDetails: "تفاصيل الموقف",
      spotNumber: "رقم الموقف",
      section: "القسم",
      floor: "الطابق",
      type: "النوع",
      parkingLot: "موقف السيارات",
      vehicleInfo: "معلومات السيارة",
      plateNumber: "رقم اللوحة",
      platePlaceholder: "أدخل رقم اللوحة",
      duration: "مدة الوقوف",
      hours: "ساعات",
      hour: "ساعة",
      paymentSummary: "ملخص الدفع",
      hourlyRate: "السعر بالساعة",
      totalDuration: "المدة الإجمالية",
      totalCost: "التكلفة الإجمالية",
      free: "مجاني",
      freeNote: "موقف مجاني لطلاب وأعضاء هيئة التدريس",
      confirm: "تأكيد الحجز",
      processing: "جاري المعالجة...",
      success: "تم تأكيد الحجز!",
      successMessage: "تم حجز موقفك بنجاح.",
      reservationId: "رقم الحجز",
      spotTypes: {
        regular: "عادي",
        handicapped: "ذوي الاحتياجات",
        ev: "شحن كهربائي",
        reserved: "محجوز",
      },
    },
  };

  const t = texts[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Save reservation
    const newId = `RES-${Date.now().toString(36).toUpperCase()}`;
    setReservationId(newId);
    
    addReservation({
      lotId: lot.id,
      lotName: lot.name,
      spotNumber: spot.spotNumber,
      date: new Date().toISOString(),
      duration,
      vehiclePlate,
      status: "active",
      totalCost,
    });

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleShareLocation = async () => {
    const shareData = {
      title: language === "ar" ? `موقف ${spot.spotNumber}` : `Parking Spot ${spot.spotNumber}`,
      text: language === "ar" 
        ? `موقفي في ${lot.name.ar} - موقف ${spot.spotNumber}`
        : `My parking spot at ${lot.name.en} - Spot ${spot.spotNumber}`,
      url: `https://www.google.com/maps?q=${lot.location.lat},${lot.location.lng}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(
        `${shareData.text}\n${shareData.url}`
      );
      alert(language === "ar" ? "تم نسخ الموقع!" : "Location copied to clipboard!");
    }
  };

  if (isSuccess) {
    
    return (
      <div className="max-w-lg mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">{t.success}</h2>
            <p className="text-muted-foreground mb-6">{t.successMessage}</p>
            
            <div className="bg-muted/50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.reservationId}</span>
                <span className="font-mono font-bold">{reservationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.spotNumber}</span>
                <span className="font-semibold">{spot.spotNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.parkingLot}</span>
                <span className="font-semibold">{language === "ar" ? lot.name.ar : lot.name.en}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.duration}</span>
                <span className="font-semibold">{duration} {duration > 1 ? t.hours : t.hour}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.totalCost}</span>
                <span className="font-bold text-primary">{totalCost > 0 ? `${totalCost} SAR` : t.free}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleShareLocation}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {language === "ar" ? "مشاركة الموقع" : "Share Location"}
              </Button>
              <Button onClick={onComplete} className="flex-1">
                {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
        ← {t.backToMap}
      </Button>

      <h1 className="text-2xl font-bold mb-6">{t.title}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Spot Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t.spotDetails}
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">{t.parkingLot}</span>
                  <span className="font-medium">{language === "ar" ? lot.name.ar : lot.name.en}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">{t.spotNumber}</span>
                  <span className="font-mono font-bold text-primary">{spot.spotNumber}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">{t.section}</span>
                  <span className="font-medium">{spot.section}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">{t.floor}</span>
                  <span className="font-medium">{spot.floor}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">{t.type}</span>
                  <span className="font-medium">{t.spotTypes[spot.type]}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 11l1.5-4.5h11L19 11m-1.5 5a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 011.5-1.5 1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5m-11 0A1.5 1.5 0 015 14.5 1.5 1.5 0 016.5 13 1.5 1.5 0 018 14.5 1.5 1.5 0 016.5 16M18.92 6c-.2-.58-.76-1-1.42-1h-11c-.66 0-1.22.42-1.42 1L3 12v8a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-8l-2.08-6z"/>
                </svg>
                {t.vehicleInfo}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.plateNumber}</label>
                  <input
                    type="text"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                    placeholder={t.platePlaceholder}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center font-mono text-lg tracking-wider"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t.duration}</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 4, 8].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setDuration(h)}
                        className={`py-3 rounded-lg border-2 transition-all ${
                          duration === h
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {h} {h > 1 ? t.hours : t.hour}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {t.paymentSummary}
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">{t.hourlyRate}</span>
                <span className="font-medium">
                  {isFreeForUser ? (
                    <span className="text-success">{t.free}</span>
                  ) : (
                    `${lot.pricePerHour || 0} SAR`
                  )}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">{t.totalDuration}</span>
                <span className="font-medium">{duration} {duration > 1 ? t.hours : t.hour}</span>
              </div>
              <div className="flex justify-between py-3 text-lg">
                <span className="font-semibold">{t.totalCost}</span>
                <span className="font-bold text-primary text-xl">
                  {totalCost > 0 ? `${totalCost} SAR` : t.free}
                </span>
              </div>
              {isFreeForUser && (
                <p className="text-sm text-success flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t.freeNote}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full py-4 text-lg"
          disabled={isSubmitting || !vehiclePlate}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {t.processing}
            </span>
          ) : (
            t.confirm
          )}
        </Button>
      </form>
    </div>
  );
}
