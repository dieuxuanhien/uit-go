export interface User {
  id: string;
  email: string;
  password: string;
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: "vi" | "en";
  currency: "VND" | "USD";
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  vehicle: Vehicle;
  status: DriverStatus;
  location?: Location;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  capacity: number;
}

export interface Trip {
  id: string;
  passengerId: string;
  driverId?: string;
  status: TripStatus;
  pickupLocation: Location;
  destination: Location;
  estimatedFare: number;
  actualFare?: number;
  scheduledTime?: Date;
  startTime?: Date;
  endTime?: Date;
  route?: RoutePoint[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city: string;
  district: string;
}

export interface RoutePoint {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

export interface Payment {
  id: string;
  tripId: string;
  amount: number;
  currency: "VND" | "USD";
  method: PaymentMethod;
  status: PaymentStatus;
  processedAt?: Date;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  readAt?: Date;
  createdAt: Date;
}

export enum DriverStatus {
  OFFLINE = "offline",
  ONLINE = "online",
  BUSY = "busy",
  BREAK = "break"
}

export enum TripStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DRIVER_ARRIVING = "driver_arriving",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

export enum PaymentMethod {
  CASH = "cash",
  CARD = "card",
  WALLET = "wallet"
}

export enum PaymentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded"
}

export enum NotificationType {
  TRIP_REQUEST = "trip_request",
  TRIP_ACCEPTED = "trip_accepted",
  DRIVER_ARRIVING = "driver_arriving",
  TRIP_STARTED = "trip_started",
  TRIP_COMPLETED = "trip_completed",
  PAYMENT_PROCESSED = "payment_processed",
  GENERAL = "general"
}
