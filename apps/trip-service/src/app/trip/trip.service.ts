import { Injectable } from "@nestjs/common";
import { Trip, Location, TripStatus, generateId, calculateDistance, estimateFare } from "@uit-go/shared";

@Injectable()
export class TripService {
  private trips: Map<string, Trip> = new Map();

  async createTrip(data: {
    passengerId: string;
    pickupLocation: Location;
    destination: Location;
    scheduledTime?: Date;
  }): Promise<Trip> {
    const distance = calculateDistance(data.pickupLocation, data.destination);
    const estimatedFare = estimateFare(distance);

    const trip: Trip = {
      id: generateId(),
      passengerId: data.passengerId,
      status: TripStatus.PENDING,
      pickupLocation: data.pickupLocation,
      destination: data.destination,
      estimatedFare: estimatedFare,
      scheduledTime: data.scheduledTime,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.trips.set(trip.id, trip);
    return trip;
  }

  async findById(id: string): Promise<Trip | null> {
    return this.trips.get(id) || null;
  }

  async acceptTrip(tripId: string, driverId: string): Promise<Trip> {
    const trip = this.trips.get(tripId);
    if (!trip) {
      throw new Error("Trip not found");
    }

    const updatedTrip = {
      ...trip,
      driverId,
      status: TripStatus.ACCEPTED,
      updatedAt: new Date(),
    };

    this.trips.set(tripId, updatedTrip);
    return updatedTrip;
  }

  async updateStatus(tripId: string, status: TripStatus): Promise<Trip> {
    const trip = this.trips.get(tripId);
    if (!trip) {
      throw new Error("Trip not found");
    }

    const updates: Partial<Trip> = { status, updatedAt: new Date() };
    
    if (status === TripStatus.IN_PROGRESS) {
      updates.startTime = new Date();
    } else if (status === TripStatus.COMPLETED) {
      updates.endTime = new Date();
    }

    const updatedTrip = { ...trip, ...updates };
    this.trips.set(tripId, updatedTrip);
    return updatedTrip;
  }

  async findByPassenger(passengerId: string): Promise<Trip[]> {
    return Array.from(this.trips.values()).filter(trip => trip.passengerId === passengerId);
  }

  async findByDriver(driverId: string): Promise<Trip[]> {
    return Array.from(this.trips.values()).filter(trip => trip.driverId === driverId);
  }
}
