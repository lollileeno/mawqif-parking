"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UniversityTheme, universities, getUniversityById } from "@/config/universities";

export type UserRole = "student" | "faculty" | "staff" | "visitor";
export type Theme = "light" | "dark";

export interface ReservationRecord {
  id: string;
  lotId: string;
  lotName: { en: string; ar: string };
  spotNumber: string;
  date: string;
  duration: number;
  vehiclePlate: string;
  status: "active" | "completed" | "cancelled";
  totalCost: number;
}

interface UniversityContextType {
  currentUniversity: UniversityTheme | null;
  setUniversity: (id: string) => void;
  universities: UniversityTheme[];
  language: "en" | "ar";
  setLanguage: (lang: "en" | "ar") => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  theme: Theme;
  toggleTheme: () => void;
  favoriteLots: string[];
  toggleFavoriteLot: (lotId: string) => void;
  isFavoriteLot: (lotId: string) => boolean;
  recentReservations: ReservationRecord[];
  addReservation: (reservation: Omit<ReservationRecord, "id">) => void;
}

const UniversityContext = createContext<UniversityContextType | undefined>(undefined);

export function UniversityProvider({ children }: { children: ReactNode }) {
  const [currentUniversity, setCurrentUniversity] = useState<UniversityTheme | null>(null);
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [userRole, setUserRole] = useState<UserRole>("student");
  const [theme, setTheme] = useState<Theme>("light");
  const [favoriteLots, setFavoriteLots] = useState<string[]>([]);
  const [recentReservations, setRecentReservations] = useState<ReservationRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  const setUniversity = (id: string) => {
    const university = getUniversityById(id);
    if (university) {
      setCurrentUniversity(university);
      localStorage.setItem("selectedUniversity", id);
      applyTheme(university);
    }
  };

  const applyTheme = (university: UniversityTheme) => {
    const root = document.documentElement;
    root.style.setProperty("--primary", university.colors.primary);
    root.style.setProperty("--primary-foreground", university.colors.primaryForeground);
    root.style.setProperty("--secondary", university.colors.secondary);
    root.style.setProperty("--secondary-foreground", university.colors.secondaryForeground);
    root.style.setProperty("--accent", university.colors.accent);
    root.style.setProperty("--accent-foreground", university.colors.accentForeground);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleFavoriteLot = (lotId: string) => {
    setFavoriteLots((prev) => {
      const newFavorites = prev.includes(lotId)
        ? prev.filter((id) => id !== lotId)
        : [...prev, lotId];
      localStorage.setItem("favoriteLots", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavoriteLot = (lotId: string) => favoriteLots.includes(lotId);

  const addReservation = (reservation: Omit<ReservationRecord, "id">) => {
    const newReservation: ReservationRecord = {
      ...reservation,
      id: `RES-${Date.now().toString(36).toUpperCase()}`,
    };
    setRecentReservations((prev) => {
      const updated = [newReservation, ...prev].slice(0, 5);
      localStorage.setItem("recentReservations", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    setMounted(true);
    
    const savedUniversity = localStorage.getItem("selectedUniversity");
    const savedLanguage = localStorage.getItem("language") as "en" | "ar" | null;
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedFavorites = localStorage.getItem("favoriteLots");
    const savedReservations = localStorage.getItem("recentReservations");
    
    if (savedUniversity) {
      setUniversity(savedUniversity);
    }
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme === "dark" ? "dark" : "light");
      document.documentElement.classList.remove(savedTheme === "dark" ? "light" : "dark");
    }
    if (savedFavorites) {
      setFavoriteLots(JSON.parse(savedFavorites));
    }
    if (savedReservations) {
      setRecentReservations(JSON.parse(savedReservations));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  return (
    <UniversityContext.Provider
      value={{
        currentUniversity,
        setUniversity,
        universities,
        language,
        setLanguage,
        userRole,
        setUserRole,
        theme,
        toggleTheme,
        favoriteLots,
        toggleFavoriteLot,
        isFavoriteLot,
        recentReservations,
        addReservation,
      }}
    >
      {children}
    </UniversityContext.Provider>
  );
}

export function useUniversity() {
  const context = useContext(UniversityContext);
  if (context === undefined) {
    throw new Error("useUniversity must be used within a UniversityProvider");
  }
  return context;
}
