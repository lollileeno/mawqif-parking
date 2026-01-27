export interface UniversityTheme {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  slug: string;
  colors: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
  };
  logo: string;
  location: {
    lat: number;
    lng: number;
  };
}

export const universities: UniversityTheme[] = [
  {
    id: "ksu",
    name: {
      en: "King Saud University",
      ar: "جامعة الملك سعود",
    },
    slug: "ksu",
    colors: {
      primary: "#003C71",
      primaryForeground: "#FFFFFF",
      secondary: "#FFFFFF",
      secondaryForeground: "#003C71",
      accent: "#0056A4",
      accentForeground: "#FFFFFF",
    },
    logo: "/logos/ksu.svg",
    location: { lat: 24.7251, lng: 46.6396 },
  },
  {
    id: "imamu",
    name: {
      en: "Imam Mohammad Ibn Saud Islamic University",
      ar: "جامعة الإمام محمد بن سعود الإسلامية",
    },
    slug: "imamu",
    colors: {
      primary: "#5DADE2",
      primaryForeground: "#FFFFFF",
      secondary: "#27AE60",
      secondaryForeground: "#FFFFFF",
      accent: "#2ECC71",
      accentForeground: "#FFFFFF",
    },
    logo: "/logos/imamu.svg",
    location: { lat: 24.8103, lng: 46.7006 },
  },
  {
    id: "pnu",
    name: {
      en: "Princess Nourah bint Abdulrahman University",
      ar: "جامعة الأميرة نورة بنت عبدالرحمن",
    },
    slug: "pnu",
    colors: {
      primary: "#6B2D5B",
      primaryForeground: "#FFFFFF",
      secondary: "#C9A227",
      secondaryForeground: "#FFFFFF",
      accent: "#8B3A75",
      accentForeground: "#FFFFFF",
    },
    logo: "/logos/pnu.svg",
    location: { lat: 24.8462, lng: 46.7244 },
  },
  {
    id: "ksauhs",
    name: {
      en: "King Saud bin Abdulaziz University for Health Sciences",
      ar: "جامعة الملك سعود بن عبدالعزيز للعلوم الصحية",
    },
    slug: "ksauhs",
    colors: {
      primary: "#003366",
      primaryForeground: "#FFFFFF",
      secondary: "#FFD700",
      secondaryForeground: "#003366",
      accent: "#004080",
      accentForeground: "#FFFFFF",
    },
    logo: "/logos/ksauhs.svg",
    location: { lat: 24.7579, lng: 46.8524 },
  },
  {
    id: "psu",
    name: {
      en: "Prince Sultan University",
      ar: "جامعة الأمير سلطان",
    },
    slug: "psu",
    colors: {
      primary: "#8B0000",
      primaryForeground: "#FFFFFF",
      secondary: "#FFD700",
      secondaryForeground: "#8B0000",
      accent: "#A52A2A",
      accentForeground: "#FFFFFF",
    },
    logo: "/logos/psu.svg",
    location: { lat: 24.7372, lng: 46.6844 },
  },
  {
    id: "alfaisal",
    name: {
      en: "Alfaisal University",
      ar: "جامعة الفيصل",
    },
    slug: "alfaisal",
    colors: {
      primary: "#1E3A5F",
      primaryForeground: "#FFFFFF",
      secondary: "#C5A572",
      secondaryForeground: "#1E3A5F",
      accent: "#2C4A6E",
      accentForeground: "#FFFFFF",
    },
    logo: "/logos/alfaisal.svg",
    location: { lat: 24.6712, lng: 46.6741 },
  },
  {
    id: "dau",
    name: {
      en: "Dar Al Uloom University",
      ar: "جامعة دار العلوم",
    },
    slug: "dau",
    colors: {
      primary: "#0066B3",
      primaryForeground: "#FFFFFF",
      secondary: "#F7941D",
      secondaryForeground: "#FFFFFF",
      accent: "#0080CC",
      accentForeground: "#FFFFFF",
    },
    logo: "/logos/dau.svg",
    location: { lat: 24.7743, lng: 46.7378 },
  },
  {
    id: "yu",
    name: {
      en: "Al-Yamamah University",
      ar: "جامعة اليمامة",
    },
    slug: "yu",
    colors: {
      primary: "#1B5E20",
      primaryForeground: "#FFFFFF",
      secondary: "#FFFFFF",
      secondaryForeground: "#1B5E20",
      accent: "#2E7D32",
      accentForeground: "#FFFFFF",
    },
    logo: "/logos/yu.svg",
    location: { lat: 24.7948, lng: 46.7523 },
  },
  {
    id: "reu",
    name: {
      en: "Riyadh Elm University",
      ar: "جامعة رياض العلم",
    },
    slug: "reu",
    colors: {
      primary: "#00529B",
      primaryForeground: "#FFFFFF",
      secondary: "#F7931E",
      secondaryForeground: "#FFFFFF",
      accent: "#0066B3",
      accentForeground: "#FFFFFF",
    },
    logo: "/logos/reu.svg",
    location: { lat: 24.7636, lng: 46.6918 },
  },
  {
    id: "aou",
    name: {
      en: "Arab Open University",
      ar: "الجامعة العربية المفتوحة",
    },
    slug: "aou",
    colors: {
      primary: "#0072BC",
      primaryForeground: "#FFFFFF",
      secondary: "#ED1C24",
      secondaryForeground: "#FFFFFF",
      accent: "#0088DD",
      accentForeground: "#FFFFFF",
    },
    logo: "/logos/aou.svg",
    location: { lat: 24.7489, lng: 46.6527 },
  },
];

export const getUniversityById = (id: string): UniversityTheme | undefined => {
  return universities.find((u) => u.id === id);
};

export const getUniversityBySlug = (slug: string): UniversityTheme | undefined => {
  return universities.find((u) => u.slug === slug);
};
