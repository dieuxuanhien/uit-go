import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { TripService } from "./trip.service";
import { Trip, Location, TripStatus } from "@uit-go/shared";

@Controller()
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @MessagePattern("trip.create")
  async createTrip(data: {
    passengerId: string;
    pickupLocation: Location;
    destination: Location;
    scheduledTime?: Date;
  }): Promise<Trip> {
    return this.tripService.createTrip(data);
  }

  @MessagePattern("trip.findById")
  async findTripById(id: string): Promise<Trip | null> {
    return this.tripService.findById(id);
  }

  @MessagePattern("trip.acceptTrip")
  async acceptTrip(data: { tripId: string; driverId: string }): Promise<Trip> {
    return this.tripService.acceptTrip(data.tripId, data.driverId);
  }

  @MessagePattern("trip.updateStatus")
  async updateStatus(data: { tripId: string; status: TripStatus }): Promise<Trip> {
    return this.tripService.updateStatus(data.tripId, data.status);
  }

  @MessagePattern("trip.findByPassenger")
  async findByPassenger(passengerId: string): Promise<Trip[]> {
    return this.tripService.findByPassenger(passengerId);
  }

  @MessagePattern("trip.findByDriver")
  async findByDriver(driverId: string): Promise<Trip[]> {
    return this.tripService.findByDriver(driverId);
  }
}
