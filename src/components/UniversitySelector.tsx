"use client";

import React from "react";
import Image from "next/image";
import { useUniversity } from "@/context/UniversityContext";
import { Card, CardContent } from "@/components/ui/Card";

export function UniversitySelector() {
  const { universities, setUniversity, currentUniversity, language } = useUniversity();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {universities.map((uni) => (
        <Card
          key={uni.id}
          className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
            currentUniversity?.id === uni.id
              ? "ring-2 ring-primary shadow-lg"
              : ""
          }`}
          onClick={() => setUniversity(uni.id)}
        >
          <CardContent className="p-4">
            <div
              className="w-full h-24 rounded-lg mb-3 flex items-center justify-center bg-white p-2"
              style={{ border: `2px solid ${uni.colors.primary}` }}
            >
              <img
                src={uni.logo}
                alt={uni.name.en}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.parentElement!.innerHTML = `<span class="text-2xl font-bold" style="color: ${uni.colors.primary}">${uni.slug.toUpperCase()}</span>`;
                }}
              />
            </div>
            <h3 className="font-semibold text-sm text-center">
              {language === "ar" ? uni.name.ar : uni.name.en}
            </h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
