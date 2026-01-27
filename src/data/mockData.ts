import { ParkingLot, ParkingSpot } from "@/types/parking";

export const mockParkingLots: ParkingLot[] = [
  {
    id: "lot-1",
    name: { en: "Main Gate Parking", ar: "موقف البوابة الرئيسية" },
    universityId: "ksu",
    location: { lat: 24.7136, lng: 46.6753 },
    totalSpots: 200,
    availableSpots: 45,
    type: "mixed",
    operatingHours: { open: "06:00", close: "22:00" },
    pricePerHour: 5,
    freeForRoles: ["student", "faculty", "staff"],
  },
  {
    id: "lot-2",
    name: { en: "Engineering Building", ar: "موقف كلية الهندسة" },
    universityId: "ksu",
    location: { lat: 24.7140, lng: 46.6760 },
    totalSpots: 150,
    availableSpots: 23,
    type: "student",
    operatingHours: { open: "07:00", close: "21:00" },
    pricePerHour: 5,
    freeForRoles: ["student", "faculty", "staff"],
  },
  {
    id: "lot-3",
    name: { en: "Faculty Parking A", ar: "موقف أعضاء هيئة التدريس أ" },
    universityId: "ksu",
    location: { lat: 24.7145, lng: 46.6770 },
    totalSpots: 80,
    availableSpots: 12,
    type: "faculty",
    operatingHours: { open: "06:00", close: "23:00" },
    pricePerHour: 5,
    freeForRoles: ["student", "faculty", "staff"],
  },
  {
    id: "lot-4",
    name: { en: "Visitor Center", ar: "موقف مركز الزوار" },
    universityId: "ksu",
    location: { lat: 24.7150, lng: 46.6780 },
    totalSpots: 100,
    availableSpots: 67,
    type: "visitor",
    operatingHours: { open: "08:00", close: "20:00" },
    pricePerHour: 10,
  },
  {
    id: "lot-5",
    name: { en: "Science Complex", ar: "موقف مجمع العلوم" },
    universityId: "ksu",
    location: { lat: 24.7155, lng: 46.6790 },
    totalSpots: 120,
    availableSpots: 0,
    type: "student",
    operatingHours: { open: "07:00", close: "21:00" },
    pricePerHour: 5,
    freeForRoles: ["student", "faculty", "staff"],
  },
  {
    id: "lot-6",
    name: { en: "Medical Center Parking", ar: "موقف المركز الطبي" },
    universityId: "ksu",
    location: { lat: 24.7160, lng: 46.6800 },
    totalSpots: 180,
    availableSpots: 89,
    type: "mixed",
    operatingHours: { open: "00:00", close: "23:59" },
    pricePerHour: 8,
    freeForRoles: ["student", "faculty", "staff"],
  },
];

export const generateMockSpots = (lotId: string, total: number): ParkingSpot[] => {
  const spots: ParkingSpot[] = [];
  const statuses: ParkingSpot["status"][] = ["available", "occupied", "reserved", "maintenance"];
  const types: ParkingSpot["type"][] = ["regular", "handicapped", "ev", "reserved"];

  for (let i = 1; i <= total; i++) {
    const floor = Math.ceil(i / 50);
    const section = String.fromCharCode(65 + ((i - 1) % 4));
    
    spots.push({
      id: `${lotId}-spot-${i}`,
      lotId,
      spotNumber: `${section}${String(i).padStart(3, "0")}`,
      type: i % 20 === 0 ? "handicapped" : i % 15 === 0 ? "ev" : i % 25 === 0 ? "reserved" : "regular",
      status: statuses[Math.floor(Math.random() * 4)],
      floor,
      section,
    });
  }

  return spots;
};
