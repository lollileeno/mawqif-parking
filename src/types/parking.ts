export interface ParkingLot {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  universityId: string;
  location: {
    lat: number;
    lng: number;
  };
  totalSpots: number;
  availableSpots: number;
  type: "student" | "faculty" | "visitor" | "mixed";
  operatingHours: {
    open: string;
    close: string;
  };
  pricePerHour?: number;
  freeForRoles?: ("student" | "faculty" | "staff")[];
}

export interface ParkingSpot {
  id: string;
  lotId: string;
  spotNumber: string;
  type: "regular" | "handicapped" | "ev" | "reserved";
  status: "available" | "occupied" | "reserved" | "maintenance";
  floor?: number;
  section?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  spotId: string;
  startTime: Date;
  endTime: Date;
  status: "pending" | "active" | "completed" | "cancelled";
  vehiclePlate: string;
  totalCost?: number;
}

export interface User {
  id: string;
  email: string;
  name: {
    en: string;
    ar: string;
  };
  universityId: string;
  role: "student" | "faculty" | "staff" | "visitor" | "admin";
  studentId?: string;
  vehicles: Vehicle[];
}

export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  color: string;
  year: number;
}

export interface Permit {
  id: string;
  userId: string;
  type: "daily" | "weekly" | "monthly" | "semester" | "annual";
  startDate: Date;
  endDate: Date;
  status: "active" | "expired" | "suspended";
  lotAccess: string[];
}
