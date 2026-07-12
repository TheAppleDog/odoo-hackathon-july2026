CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin','Manager','Operator') DEFAULT 'Operator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_name VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(50),
    capacity INT,
    fuel_type ENUM('Diesel','Petrol','CNG','Electric'),
    odometer INT,
    purchase_date DATE,
    status ENUM('Active','On Trip','Maintenance','Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    email VARCHAR(100),
    license_number VARCHAR(50) UNIQUE,
    license_expiry DATE,
    experience INT,
    status ENUM('Available','On Trip','Leave','Inactive') DEFAULT 'Available',
    assigned_vehicle INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_vehicle) REFERENCES vehicles(id)
        ON DELETE SET NULL
);

CREATE TABLE trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id VARCHAR(30) UNIQUE,
    pickup VARCHAR(100),
    destination VARCHAR(100),
    vehicle_id INT,
    driver_id INT,
    departure DATETIME,
    arrival DATETIME,
    distance DECIMAL(10,2),
    status ENUM('Scheduled','On Trip','Completed','Cancelled') DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY(driver_id) REFERENCES drivers(id)
);

CREATE TABLE maintenance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id VARCHAR(30) UNIQUE,
    vehicle_id INT,
    service_type VARCHAR(100),
    mechanic VARCHAR(100),
    service_date DATE,
    estimated_cost DECIMAL(10,2),
    notes TEXT,
    status ENUM('Scheduled','In Progress','Completed','Overdue'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE fuel_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_id VARCHAR(30) UNIQUE,
    vehicle_id INT,
    driver_id INT,
    fuel_type ENUM('Diesel','Petrol','CNG','Electric'),
    quantity DECIMAL(8,2),
    cost DECIMAL(10,2),
    odometer INT,
    fuel_station VARCHAR(100),
    fuel_date DATE,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY(driver_id) REFERENCES drivers(id)
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);