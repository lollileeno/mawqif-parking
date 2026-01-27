"use client";

import React, { useState } from "react";
import { useUniversity } from "@/context/UniversityContext";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface FeedbackFormProps {
  onClose: () => void;
}

export function FeedbackForm({ onClose }: FeedbackFormProps) {
  const { language } = useUniversity();
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const texts = {
    en: {
      title: "Send Feedback",
      subtitle: "Help us improve your parking experience",
      rating: "How would you rate your experience?",
      category: "Category",
      categories: {
        general: "General Feedback",
        bug: "Report a Bug",
        feature: "Feature Request",
        parking: "Parking Issue",
        payment: "Payment Issue",
      },
      message: "Your Message",
      messagePlaceholder: "Tell us what you think...",
      submit: "Submit Feedback",
      cancel: "Cancel",
      submitting: "Submitting...",
      successTitle: "Thank You!",
      successMessage: "Your feedback has been submitted successfully.",
      close: "Close",
    },
    ar: {
      title: "إرسال ملاحظات",
      subtitle: "ساعدنا في تحسين تجربة المواقف",
      rating: "كيف تقيم تجربتك؟",
      category: "الفئة",
      categories: {
        general: "ملاحظات عامة",
        bug: "الإبلاغ عن خطأ",
        feature: "طلب ميزة",
        parking: "مشكلة في الموقف",
        payment: "مشكلة في الدفع",
      },
      message: "رسالتك",
      messagePlaceholder: "أخبرنا برأيك...",
      submit: "إرسال الملاحظات",
      cancel: "إلغاء",
      submitting: "جاري الإرسال...",
      successTitle: "شكراً لك!",
      successMessage: "تم إرسال ملاحظاتك بنجاح.",
      close: "إغلاق",
    },
  };

  const t = texts[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">{t.successTitle}</h3>
            <p className="text-muted-foreground mb-6">{t.successMessage}</p>
            <Button onClick={onClose} className="w-full">
              {t.close}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold">{t.title}</h3>
              <p className="text-sm text-muted-foreground">{t.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t.rating}</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <svg
                      className={`w-8 h-8 ${star <= rating ? "text-warning fill-warning" : "text-muted-foreground"}`}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.category}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">--</option>
                {Object.entries(t.categories).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.message}</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.messagePlaceholder}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                {t.cancel}
              </Button>
              <Button type="submit" disabled={isSubmitting || !rating || !category} className="flex-1">
                {isSubmitting ? t.submitting : t.submit}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
