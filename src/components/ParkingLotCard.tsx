"use client";

import React from "react";
import { useUniversity } from "@/context/UniversityContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ParkingLot } from "@/types/parking";

interface ParkingLotCardProps {
  lot: ParkingLot;
  onSelect: (lot: ParkingLot) => void;
}

export function ParkingLotCard({ lot, onSelect }: ParkingLotCardProps) {
  const { language, userRole, isFavoriteLot, toggleFavoriteLot } = useUniversity();
  const isFavorite = isFavoriteLot(lot.id);

  const availabilityPercentage = (lot.availableSpots / lot.totalSpots) * 100;
  const getAvailabilityColor = () => {
    if (availabilityPercentage > 50) return "bg-success";
    if (availabilityPercentage > 20) return "bg-warning";
    return "bg-destructive";
  };

  const isFreeForUser = lot.freeForRoles?.includes(userRole as "student" | "faculty" | "staff") ?? false;

  // Check if user can access this lot based on their role
  const canAccessLot = () => {
    if (lot.type === "mixed") return true;
    if (lot.type === "visitor") return true;
    if (lot.type === "student" && userRole === "student") return true;
    if (lot.type === "faculty" && (userRole === "faculty" || userRole === "staff")) return true;
    return false;
  };

  const isRestricted = !canAccessLot();

  const texts = {
    en: {
      available: "Available",
      of: "of",
      spots: "spots",
      type: {
        student: "Student",
        faculty: "Faculty",
        visitor: "Visitor",
        mixed: "Mixed",
      },
      hours: "Operating Hours",
      reserve: "Reserve Spot",
      full: "Full",
      free: "Free",
      freeFor: "Free for students & faculty",
      restricted: "Restricted",
      studentOnly: "Students Only",
      facultyOnly: "Faculty & Staff Only",
    },
    ar: {
      available: "متاح",
      of: "من",
      spots: "موقف",
      type: {
        student: "طلاب",
        faculty: "أعضاء هيئة التدريس",
        visitor: "زوار",
        mixed: "مختلط",
      },
      hours: "ساعات العمل",
      reserve: "احجز موقف",
      full: "ممتلئ",
      free: "مجاني",
      freeFor: "مجاني للطلاب وأعضاء هيئة التدريس",
      restricted: "محظور",
      studentOnly: "للطلاب فقط",
      facultyOnly: "لأعضاء هيئة التدريس فقط",
    },
  };

  const t = texts[language];

  return (
    <Card className={`hover:shadow-lg transition-shadow relative ${isRestricted ? "opacity-60" : ""}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavoriteLot(lot.id);
        }}
        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted transition-colors z-10"
        title={isFavorite ? (language === "ar" ? "إزالة من المفضلة" : "Remove from favorites") : (language === "ar" ? "إضافة للمفضلة" : "Add to favorites")}
      >
        <svg
          className={`w-5 h-5 ${isFavorite ? "text-destructive fill-destructive" : "text-muted-foreground"}`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="pr-8">{language === "ar" ? lot.name.ar : lot.name.en}</CardTitle>
          <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
            {t.type[lot.type]}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">{t.available}</span>
              <span className="font-semibold">
                {lot.availableSpots} {t.of} {lot.totalSpots} {t.spots}
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${getAvailabilityColor()} transition-all`}
                style={{ width: `${availabilityPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t.hours}</span>
            <span>{lot.operatingHours.open} - {lot.operatingHours.close}</span>
          </div>

          {lot.pricePerHour && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {language === "ar" ? "السعر/ساعة" : "Price/Hour"}
              </span>
              {isFreeForUser ? (
                <span className="font-semibold text-success">{t.free} ✓</span>
              ) : (
                <span className="font-semibold">{lot.pricePerHour} SAR</span>
              )}
            </div>
          )}

          {lot.freeForRoles && lot.freeForRoles.length > 0 && !isFreeForUser && (
            <p className="text-xs text-muted-foreground">{t.freeFor}</p>
          )}

          {isRestricted && (
            <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-lg">
              <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-xs text-destructive font-medium">
                {lot.type === "student" ? t.studentOnly : t.facultyOnly}
              </span>
            </div>
          )}

          <Button
            className="w-full"
            variant={lot.availableSpots > 0 && !isRestricted ? "primary" : "outline"}
            disabled={lot.availableSpots === 0 || isRestricted}
            onClick={() => onSelect(lot)}
          >
            {isRestricted ? t.restricted : lot.availableSpots > 0 ? t.reserve : t.full}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
