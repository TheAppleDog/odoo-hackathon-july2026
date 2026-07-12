-- TransitOps database schema foundation
-- This file defines the initial MySQL structure only.

CREATE DATABASE IF NOT EXISTS transitops;
USE transitops;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) DEFAULT NULL,
  role VARCHAR(50) DEFAULT 'operator',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registration VARCHAR(50) NOT NULL UNIQUE,
  vehicle_name VARCHAR(120) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  last_service_date DATE DEFAULT NULL,
  assigned_driver_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_vehicles_driver FOREIGN KEY (assigned_driver_id) REFERENCES drivers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS trips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_name VARCHAR(150) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
  start_time DATETIME DEFAULT NULL,
  end_time DATETIME DEFAULT NULL,
  vehicle_id INT DEFAULT NULL,
  driver_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_trips_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
  CONSTRAINT fk_trips_driver FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS drivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL,
  license_number VARCHAR(100) NOT NULL UNIQUE,
  license_expiry DATE DEFAULT NULL,
  experience VARCHAR(50) DEFAULT NULL,
  availability VARCHAR(50) NOT NULL DEFAULT 'available',
  status VARCHAR(50) NOT NULL DEFAULT 'available',
  address VARCHAR(255) DEFAULT NULL,
  assigned_vehicle_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_drivers_vehicle FOREIGN KEY (assigned_vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL
);

