export const API_ENDPOINTS = {
  USER_SERVICE: process.env.USER_SERVICE_URL || "http://localhost:3001",
  DRIVER_SERVICE: process.env.DRIVER_SERVICE_URL || "http://localhost:3002",
  TRIP_SERVICE: process.env.TRIP_SERVICE_URL || "http://localhost:3003",
  NOTIFICATION_SERVICE: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3004",
  PAYMENT_SERVICE: process.env.PAYMENT_SERVICE_URL || "http://localhost:3005",
};

export const MICROSERVICES_CONFIG = {
  USER_SERVICE: {
    name: "user-service",
    port: 3001,
    host: "localhost"
  },
  DRIVER_SERVICE: {
    name: "driver-service", 
    port: 3002,
    host: "localhost"
  },
  TRIP_SERVICE: {
    name: "trip-service",
    port: 3003,
    host: "localhost"
  },
  NOTIFICATION_SERVICE: {
    name: "notification-service",
    port: 3004,
    host: "localhost"
  },
  PAYMENT_SERVICE: {
    name: "payment-service",
    port: 3005,
    host: "localhost"
  }
};

export const KAFKA_TOPICS = {
  TRIP_CREATED: "trip.created",
  TRIP_ACCEPTED: "trip.accepted",
  DRIVER_LOCATION_UPDATED: "driver.location.updated",
  PAYMENT_PROCESSED: "payment.processed",
  NOTIFICATION_SENT: "notification.sent"
};

export const DATABASE_CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/uit-go",
  REDIS_URI: process.env.REDIS_URI || "redis://localhost:6379"
};
