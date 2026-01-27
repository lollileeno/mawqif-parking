"use client";

import React from "react";
import { useUniversity, ReservationRecord } from "@/context/UniversityContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export function RecentReservations() {
  const { language, recentReservations } = useUniversity();

  const texts = {
    en: {
      title: "Recent Reservations",
      noReservations: "No recent reservations",
      spot: "Spot",
      duration: "Duration",
      hours: "hours",
      hour: "hour",
      status: {
        active: "Active",
        completed: "Completed",
        cancelled: "Cancelled",
      },
      viewAll: "View All",
    },
    ar: {
      title: "الحجوزات الأخيرة",
      noReservations: "لا توجد حجوزات حديثة",
      spot: "الموقف",
      duration: "المدة",
      hours: "ساعات",
      hour: "ساعة",
      status: {
        active: "نشط",
        completed: "مكتمل",
        cancelled: "ملغي",
      },
      viewAll: "عرض الكل",
    },
  };

  const t = texts[language];

  const getStatusColor = (status: ReservationRecord["status"]) => {
    switch (status) {
      case "active":
        return "bg-success/20 text-success";
      case "completed":
        return "bg-primary/20 text-primary";
      case "cancelled":
        return "bg-destructive/20 text-destructive";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (recentReservations.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {language === "ar" ? reservation.lotName.ar : reservation.lotName.en}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.spot}: {reservation.spotNumber} • {reservation.duration} {reservation.duration > 1 ? t.hours : t.hour}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(reservation.date)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(reservation.status)}`}>
                  {t.status[reservation.status]}
                </span>
                <p className="text-sm font-semibold mt-1">
                  {reservation.totalCost > 0 ? `${reservation.totalCost} SAR` : (language === "ar" ? "مجاني" : "Free")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
