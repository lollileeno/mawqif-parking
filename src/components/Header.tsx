"use client";

import React, { useState } from "react";
import { useUniversity, UserRole } from "@/context/UniversityContext";
import { Button } from "@/components/ui/Button";
import { FeedbackForm } from "@/components/FeedbackForm";

export function Header() {
  const { currentUniversity, language, setLanguage, setUniversity, universities, userRole, setUserRole, theme, toggleTheme } = useUniversity();
  const [showUniversityMenu, setShowUniversityMenu] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const texts = {
    en: {
      title: "Mawqif",
      subtitle: "Smart Parking Management System",
      language: "العربية",
      changeUniversity: "Change University",
      roles: {
        student: "Student",
        faculty: "Faculty",
        staff: "Staff",
        visitor: "Visitor",
      },
    },
    ar: {
      title: "موقِف",
      subtitle: "نظام إدارة المواقف الذكي",
      language: "English",
      changeUniversity: "تغيير الجامعة",
      roles: {
        student: "طالب",
        faculty: "عضو هيئة تدريس",
        staff: "موظف",
        visitor: "زائر",
      },
    },
  };

  const t = texts[language];

  return (
    <header className="bg-primary text-primary-foreground shadow-lg relative">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentUniversity && (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity bg-white p-1 overflow-hidden"
                onClick={() => setShowUniversityMenu(!showUniversityMenu)}
                title={t.changeUniversity}
              >
                <img
                  src={currentUniversity.logo}
                  alt={currentUniversity.name.en}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.parentElement!.innerHTML = `<span class="text-lg font-bold" style="color: ${currentUniversity.colors.primary}">${currentUniversity.slug.toUpperCase().slice(0, 2)}</span>`;
                  }}
                />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">{t.title}</h1>
              <p className="text-sm opacity-80">
                {currentUniversity
                  ? language === "ar"
                    ? currentUniversity.name.ar
                    : currentUniversity.name.en
                  : t.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUniversity && (
              <>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="px-2 py-1.5 text-sm rounded-lg bg-white/10 text-primary-foreground border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="student" className="text-foreground">{t.roles.student}</option>
                  <option value="faculty" className="text-foreground">{t.roles.faculty}</option>
                  <option value="staff" className="text-foreground">{t.roles.staff}</option>
                  <option value="visitor" className="text-foreground">{t.roles.visitor}</option>
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground hover:bg-white/10"
                  onClick={() => setShowUniversityMenu(!showUniversityMenu)}
                >
                  {t.changeUniversity}
                </Button>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                console.log("Theme toggle clicked, current theme:", theme);
                toggleTheme();
              }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              title={theme === "light" ? "Dark Mode" : "Light Mode"}
            >
              {theme === "light" ? (
                <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setShowFeedback(true)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              title={language === "ar" ? "إرسال ملاحظات" : "Send Feedback"}
            >
              <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            >
              {t.language}
            </Button>
          </div>
        </div>
      </div>

      {showUniversityMenu && currentUniversity && (
        <div className="absolute top-full left-0 right-0 bg-card text-card-foreground shadow-xl border-t z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {universities.map((uni) => (
                <button
                  key={uni.id}
                  className={`p-3 rounded-lg border transition-all hover:shadow-md ${
                    currentUniversity.id === uni.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => {
                    setUniversity(uni.id);
                    setShowUniversityMenu(false);
                  }}
                >
                  <div className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center bg-white p-1 overflow-hidden">
                    <img
                      src={uni.logo}
                      alt={uni.name.en}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.parentElement!.innerHTML = `<span class="text-sm font-bold" style="color: ${uni.colors.primary}">${uni.slug.toUpperCase()}</span>`;
                      }}
                    />
                  </div>
                  <p className="text-xs text-center font-medium truncate">
                    {language === "ar" ? uni.name.ar : uni.name.en}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)} />}
    </header>
  );
}
