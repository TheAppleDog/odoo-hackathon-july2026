from flask import Flask, render_template, request, redirect, url_for, flash, session

app = Flask(__name__)
app.secret_key = "change_this_secret_key"

# Mock user credentials for initial project foundation
VALID_EMAIL = "user@transitops.com"
VALID_PASSWORD = "Transit2026"

# Sample in-memory vehicle data for the module
# NOTE: This project currently runs fully in-memory (no DB setup),
# so Module 3 is implemented with in-memory structures.
vehicles_data = [

    {
        "registration": "MH01AB1234",
        "name": "Tata Ace",
        "type": "Mini Truck",
        "capacity": "1200 kg",
        "fuel_type": "Diesel",
        "odometer": 45520,
        "purchase_date": "2022-03-15",
        "status": "Active",
        "driver_name": "Rahul",
        "trip_id": "TR102",
    },
    {
        "registration": "GJ05CD7890",
        "name": "Eicher Pro",
        "type": "Truck",
        "capacity": "16000 kg",
        "fuel_type": "Diesel",
        "odometer": 82310,
        "purchase_date": "2021-08-07",
        "status": "On Trip",
        "driver_name": "Rahul",
        "trip_id": "TR102",
    },
    {
        "registration": "MH12XY5678",
        "name": "Ashok Leyland",
        "type": "Truck",
        "capacity": "18000 kg",
        "fuel_type": "Diesel",
        "odometer": 102430,
        "purchase_date": "2020-11-02",
        "status": "Maintenance",
        "driver_name": "Rahul",
        "trip_id": "TR102",
    },
    {
        "registration": "GJ01PQ1111",
        "name": "Mahindra Bolero",
        "type": "Pickup",
        "capacity": "900 kg",
        "fuel_type": "Diesel",
        "odometer": 36890,
        "purchase_date": "2023-01-19",
        "status": "Active",
        "driver_name": "Rahul",
        "trip_id": "TR102",
    },
    {
        "registration": "MH14KL2222",
        "name": "BharatBenz",
        "type": "Trailer",
        "capacity": "24000 kg",
        "fuel_type": "Diesel",
        "odometer": 145000,
        "purchase_date": "2022-06-28",
        "status": "Active",
        "driver_name": "Rahul",
        "trip_id": "TR102",
    },
    {
        "registration": "GJ18UV3333",
        "name": "Tata Intra",
        "type": "Pickup",
        "capacity": "1000 kg",
        "fuel_type": "CNG",
        "odometer": 27500,
        "purchase_date": "2019-09-14",
        "status": "Inactive",
        "driver_name": "Rahul",
        "trip_id": "TR102",
    },
    {
        "registration": "MH20RS4444",
        "name": "Force Traveller",
        "type": "Van",
        "capacity": "1800 kg",
        "fuel_type": "Diesel",
        "odometer": 63800,
        "purchase_date": "2018-04-22",
        "status": "Active",
        "driver_name": "Rahul",
        "trip_id": "TR102",
    },
    {
        "registration": "GJ06LM5555",
        "name": "Tata Prima",
        "type": "Truck",
        "capacity": "20000 kg",
        "fuel_type": "Diesel",
        "odometer": 118500,
        "purchase_date": "2024-02-03",
        "status": "On Trip",
        "driver_name": "Rahul",
        "trip_id": "TR102",
    },
]




@app.route("/", methods=["GET", "POST"])
def login():
    """Display the login page and handle basic login validation."""
    if request.method == "POST":
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        remember = request.form.get("remember") == "on"

        if email == VALID_EMAIL and password == VALID_PASSWORD:
            flash("Login successful. Redirecting to dashboard...", "success")
            return redirect(url_for("dashboard"))

        flash("Invalid email or password. Please try again.", "danger")

    return render_template("login.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route("/profile")
def profile():
    return render_template("profile.html", active_page="profile")


@app.route("/settings")
def settings():
    return render_template("settings.html", active_page="settings")


@app.route("/dashboard")
def dashboard():
    """Render the dashboard layout after login."""
    kpis = {
        "active_vehicles": 124,
        "drivers": 87,
        "active_trips": 56,
        "maintenance_vehicles": 9,
    }

    activities = [
        {"time": "08:15 AM", "text": "Route 12 started from Central Hub."},
        {"time": "09:00 AM", "text": "Driver roster updated for downtown shift."},
        {"time": "09:30 AM", "text": "Vehicle #42 sent maintenance alert."},
        {"time": "10:05 AM", "text": "New trip created for airport shuttle."},
    ]

    return render_template("dashboard.html", kpis=kpis, activities=activities, active_page="dashboard")

@app.route("/vehicles")
def vehicles():
    """Render the vehicle management page with sample data."""
    vehicle_types = sorted({v.get("type", "").strip() for v in vehicles_data if v.get("type", "").strip()})

    return render_template(
        "vehicles.html",
        vehicles=vehicles_data,
        vehicle_types=vehicle_types,
        active_page="vehicles",
    )


@app.route("/save_vehicle", methods=["POST"])
def save_vehicle():
    """Handle Add/Edit vehicle requests in memory without a database."""
    mode = request.form.get("mode")
    registration = request.form.get("registration", "").strip()
    name = request.form.get("name", "").strip()
    vehicle_type = request.form.get("type", "").strip()
    capacity = request.form.get("capacity", "").strip()
    fuel_type = request.form.get("fuel_type", "").strip()
    odometer = request.form.get("odometer", "").strip()
    purchase_date = request.form.get("purchase_date", "").strip()
    status = request.form.get("status", "Active").strip()
    original_registration = request.form.get("original_registration", "").strip()

    # Server-side validation (no database)
    if not registration:
        flash("Registration Number is required.", "danger")
        return redirect(url_for("vehicles"))

    if not name:
        flash("Vehicle Name is required.", "danger")
        return redirect(url_for("vehicles"))

    try:
        capacity_num = float(capacity)
    except ValueError:
        flash("Capacity must be numeric.", "danger")
        return redirect(url_for("vehicles"))

    try:
        odometer_num = float(odometer)
    except ValueError:
        flash("Odometer must be numeric.", "danger")
        return redirect(url_for("vehicles"))

    valid_statuses = {"Active", "On Trip", "Maintenance", "Inactive"}
    if status not in valid_statuses:
        flash("Invalid status.", "danger")
        return redirect(url_for("vehicles"))

    # Validate registration uniqueness on add
    if mode == "add" and any(v["registration"] == registration for v in vehicles_data):
        flash("Registration Number must be unique.", "danger")
        return redirect(url_for("vehicles"))

    # Normalize stored numeric values as strings for table display (keeping lightweight in-memory)
    capacity_store = str(capacity_num).rstrip(".0") if str(capacity_num).endswith(".0") else str(capacity_num)
    odometer_store = int(odometer_num) if float(odometer_num).is_integer() else odometer_num

    if mode == "edit":
        # If changing registration, ensure uniqueness
        if registration != original_registration and any(v["registration"] == registration for v in vehicles_data):
            flash("Registration Number must be unique.", "danger")
            return redirect(url_for("vehicles"))

        for vehicle in vehicles_data:
            if vehicle["registration"] == original_registration:
                vehicle["registration"] = registration
                vehicle["name"] = name
                vehicle["type"] = vehicle_type
                vehicle["capacity"] = capacity_store
                vehicle["fuel_type"] = fuel_type
                vehicle["odometer"] = odometer_store
                vehicle["purchase_date"] = purchase_date
                vehicle["status"] = status
                break

        flash("Vehicle updated successfully.", "success")
        return redirect(url_for("vehicles"))

    vehicles_data.append({
        "registration": registration,
        "name": name,
        "type": vehicle_type,
        "capacity": capacity_store,
        "fuel_type": fuel_type,
        "odometer": odometer_store,
        "purchase_date": purchase_date,
        "status": status,
        "driver_name": "Rahul",
        "trip_id": "TR102",
    })
    flash("Vehicle added successfully.", "success")
    return redirect(url_for("vehicles"))


@app.route("/delete_vehicle", methods=["POST"])
def delete_vehicle():
    """Delete a vehicle by registration number from in-memory list."""
    registration = request.form.get("registration", "").strip()
    global vehicles_data
    vehicles_data = [v for v in vehicles_data if v["registration"] != registration]
    flash("Vehicle deleted successfully.", "success")
    return redirect(url_for("vehicles"))

# ----------------------
# Driver Management (Module 3)
# Implemented in-memory (no DB setup required per request)
# ----------------------
drivers_data = [

    {
        "full_name": "Rahul Sharma",
        "phone": "9000000001",
        "email": "rahul.sharma@example.com",
        "license_number": "LIC-MH-1001",
        "license_expiry": "2027-12-31",
        "assigned_vehicle_registration": "MH01AB1234",
        "experience": "5 years",
        "status": "Available",
        "availability": "Available",
        "address": "Pune, MH",
    },
    {
        "full_name": "Priya Patel",
        "phone": "9000000002",
        "email": "priya.patel@example.com",
        "license_number": "LIC-GJ-2001",
        "license_expiry": "2026-08-15",
        "assigned_vehicle_registration": "GJ05CD7890",
        "experience": "3 years",
        "status": "On Trip",
        "availability": "On Trip",
        "address": "Ahmedabad, GJ",
    },
    {
        "full_name": "Amit Singh",
        "phone": "9000000003",
        "email": "amit.singh@example.com",
        "license_number": "LIC-MH-3001",
        "license_expiry": "2025-10-01",
        "assigned_vehicle_registration": "MH12XY5678",
        "experience": "7 years",
        "status": "Leave",
        "availability": "Leave",
        "address": "Nagpur, MH",
    },
    {
        "full_name": "Neha Verma",
        "phone": "9000000004",
        "email": "neha.verma@example.com",
        "license_number": "LIC-GJ-4001",
        "license_expiry": "2028-02-20",
        "assigned_vehicle_registration": "GJ01PQ1111",
        "experience": "2 years",
        "status": "Available",
        "availability": "Available",
        "address": "Surat, GJ",
    },
    {
        "full_name": "Arjun Joshi",
        "phone": "9000000005",
        "email": "arjun.joshi@example.com",
        "license_number": "LIC-MH-5001",
        "license_expiry": "2026-05-05",
        "assigned_vehicle_registration": "MH14KL2222",
        "experience": "4 years",
        "status": "Inactive",
        "availability": "Inactive",
        "address": "Mumbai, MH",
    },
    {
        "full_name": "Riya Shah",
        "phone": "9000000006",
        "email": "riya.shah@example.com",
        "license_number": "LIC-GJ-6001",
        "license_expiry": "2027-03-12",
        "assigned_vehicle_registration": "GJ18UV3333",
        "experience": "6 years",
        "status": "Available",
        "availability": "Available",
        "address": "Vadodara, GJ",
    },
    {
        "full_name": "Karan Mehta",
        "phone": "9000000007",
        "email": "karan.mehta@example.com",
        "license_number": "LIC-MH-7001",
        "license_expiry": "2029-01-30",
        "assigned_vehicle_registration": "MH20RS4444",
        "experience": "8 years",
        "status": "Available",
        "availability": "Available",
        "address": "Bengaluru, KA",
    },
    {
        "full_name": "Sahil Jain",
        "phone": "9000000008",
        "email": "sahil.jain@example.com",
        "license_number": "LIC-GJ-8001",
        "license_expiry": "2026-11-11",
        "assigned_vehicle_registration": "GJ06LM5555",
        "experience": "1 year",
        "status": "On Trip",
        "availability": "On Trip",
        "address": "Rajkot, GJ",
    },
]


def _get_vehicle_by_registration(registration: str):
    for v in vehicles_data:
        if v.get("registration") == registration:
            return v
    return None


def _sync_driver_vehicle_assignment(driver: dict, previous_vehicle_registration: str | None = None):
    """Keep in-memory status/assignment consistent.

    - If driver.availability/status is On Trip => set vehicle.status to On Trip
    - If driver.availability/status is Available => set vehicle.status to Active
    """
    current_reg = driver.get("assigned_vehicle_registration")

    # Clear previous vehicle association status if it was different
    if previous_vehicle_registration and previous_vehicle_registration != current_reg:
        prev_vehicle = _get_vehicle_by_registration(previous_vehicle_registration)
        if prev_vehicle and prev_vehicle.get("driver_name") == driver.get("full_name"):
            # best-effort: revert vehicle status if it was on trip due to this driver
            if prev_vehicle.get("status") == "On Trip":
                prev_vehicle["status"] = "Active"

    vehicle = _get_vehicle_by_registration(current_reg) if current_reg else None
    if not vehicle:
        return

    # Update vehicle<->driver linkage
    vehicle["driver_name"] = driver.get("full_name")
    vehicle["trip_id"] = vehicle.get("trip_id") or "TR102"

    # Status synchronization
    driver_avail = (driver.get("availability") or driver.get("status") or "Available").strip()
    if driver_avail == "On Trip" or driver.get("status") == "On Trip":
        vehicle["status"] = "On Trip"
        driver["status"] = "On Trip"
        driver["availability"] = "On Trip"
    elif driver_avail in ("Available", "Active"):
        vehicle["status"] = "Active"
        driver["status"] = "Available"
        driver["availability"] = "Available"
    elif driver_avail == "Leave":
        driver["status"] = "Leave"
        driver["availability"] = "Leave"
    elif driver_avail == "Inactive":
        driver["status"] = "Inactive"
        driver["availability"] = "Inactive"


trips_data = [

    {
        "trip_id": "TR100",
        "pickup_location": "Central Hub",
        "destination": "Airport Terminal 2",
        "driver_name": "Rahul Sharma",
        "vehicle_registration": "MH01AB1234",
        "departure_date": "2026-07-12",
        "departure_time": "08:30",
        "expected_arrival": "2026-07-12 11:05",
        "distance_km": 142,
        "status": "On Trip",
        "route": "Central Hub → Airport Terminal 2",
    },
    {
        "trip_id": "TR101",
        "pickup_location": "North Depot",
        "destination": "City Warehouse",
        "driver_name": "Priya Patel",
        "vehicle_registration": "GJ05CD7890",
        "departure_date": "2026-07-13",
        "departure_time": "09:15",
        "expected_arrival": "2026-07-13 12:10",
        "distance_km": 96,
        "status": "Scheduled",
        "route": "North Depot → City Warehouse",
    },
    {
        "trip_id": "TR102",
        "pickup_location": "East Logistics Park",
        "destination": "Port Gate 1",
        "driver_name": "Amit Singh",
        "vehicle_registration": "MH12XY5678",
        "departure_date": "2026-07-12",
        "departure_time": "06:45",
        "expected_arrival": "2026-07-12 10:20",
        "distance_km": 118,
        "status": "Completed",
        "route": "East Logistics Park → Port Gate 1",
    },
    {
        "trip_id": "TR103",
        "pickup_location": "Western Checkpoint",
        "destination": "Industrial Estate",
        "driver_name": "Neha Verma",
        "vehicle_registration": "GJ01PQ1111",
        "departure_date": "2026-07-12",
        "departure_time": "14:10",
        "expected_arrival": "2026-07-12 18:00",
        "distance_km": 155,
        "status": "On Trip",
        "route": "Western Checkpoint → Industrial Estate",
    },
    {
        "trip_id": "TR104",
        "pickup_location": "South Bus Stand",
        "destination": "Medical Supplies Hub",
        "driver_name": "Arjun Joshi",
        "vehicle_registration": "MH14KL2222",
        "departure_date": "2026-07-14",
        "departure_time": "07:20",
        "expected_arrival": "2026-07-14 09:40",
        "distance_km": 73,
        "status": "Scheduled",
        "route": "South Bus Stand → Medical Supplies Hub",
    },
    {
        "trip_id": "TR105",
        "pickup_location": "Central Hub",
        "destination": "Warehouse North",
        "driver_name": "Riya Shah",
        "vehicle_registration": "GJ18UV3333",
        "departure_date": "2026-07-12",
        "departure_time": "12:25",
        "expected_arrival": "2026-07-12 15:05",
        "distance_km": 84,
        "status": "Completed",
        "route": "Central Hub → Warehouse North",
    },
    {
        "trip_id": "TR106",
        "pickup_location": "Rajkot Ring Road",
        "destination": "City Warehouse",
        "driver_name": "Sahil Jain",
        "vehicle_registration": "GJ06LM5555",
        "departure_date": "2026-07-12",
        "departure_time": "16:40",
        "expected_arrival": "2026-07-12 19:30",
        "distance_km": 121,
        "status": "Cancelled",
        "route": "Rajkot Ring Road → City Warehouse",
    },
    {
        "trip_id": "TR107",
        "pickup_location": "Bengaluru Satellite Depot",
        "destination": "IT Park Loading Bay",
        "driver_name": "Karan Mehta",
        "vehicle_registration": "MH20RS4444",
        "departure_date": "2026-07-15",
        "departure_time": "10:05",
        "expected_arrival": "2026-07-15 13:35",
        "distance_km": 167,
        "status": "Scheduled",
        "route": "Bengaluru Satellite Depot → IT Park Loading Bay",
    },
]

@app.route("/drivers")
def drivers():
    vehicle_registrations = [v.get("registration") for v in vehicles_data]
    return render_template(
        "drivers.html",
        drivers=drivers_data,
        vehicles=vehicles_data,
        vehicle_registrations=vehicle_registrations,
        active_page="drivers",
    )


@app.route("/save_driver", methods=["POST"])
def save_driver():
    mode = request.form.get("mode")

    full_name = request.form.get("full_name", "").strip()
    phone = request.form.get("phone", "").strip()
    email = request.form.get("email", "").strip()
    license_number = request.form.get("license_number", "").strip()
    license_expiry = request.form.get("license_expiry", "").strip()
    assigned_vehicle_registration = request.form.get("assigned_vehicle_registration", "").strip()
    experience = request.form.get("experience", "").strip()
    status = request.form.get("status", "Available").strip()
    availability = request.form.get("availability", status).strip()
    address = request.form.get("address", "").strip()

    original_license = request.form.get("original_license_number", "").strip()

    valid_statuses = {"Available", "On Trip", "Leave", "Inactive"}
    if status not in valid_statuses:
        flash("Invalid driver status.", "danger")
        return redirect(url_for("drivers"))

    if not full_name:
        flash("Driver name is required.", "danger")
        return redirect(url_for("drivers"))
    if not phone:
        flash("Phone is required.", "danger")
        return redirect(url_for("drivers"))
    if not email:
        flash("Email is required.", "danger")
        return redirect(url_for("drivers"))
    if not license_number:
        flash("License number is required.", "danger")
        return redirect(url_for("drivers"))

    # Ensure assigned vehicle exists (best-effort)
    if assigned_vehicle_registration and not _get_vehicle_by_registration(assigned_vehicle_registration):
        flash("Assigned vehicle not found.", "danger")
        return redirect(url_for("drivers"))

    if mode == "add" and any(d.get("license_number") == license_number for d in drivers_data):
        flash("License number must be unique.", "danger")
        return redirect(url_for("drivers"))

    if mode == "edit":
        previous_vehicle = None
        for d in drivers_data:
            if d.get("license_number") == original_license:
                previous_vehicle = d.get("assigned_vehicle_registration")
                d.update(
                    {
                        "full_name": full_name,
                        "phone": phone,
                        "email": email,
                        "license_number": license_number,
                        "license_expiry": license_expiry,
                        "assigned_vehicle_registration": assigned_vehicle_registration,
                        "experience": experience,
                        "status": status,
                        "availability": availability,
                        "address": address,
                    }
                )
                break

        # best-effort: update linked vehicle status based on driver availability
        for d in drivers_data:
            if d.get("license_number") == license_number:
                _sync_driver_vehicle_assignment(d, previous_vehicle)
                break

        flash("Driver updated successfully.", "success")
        return redirect(url_for("drivers"))

    # add
    driver = {
        "full_name": full_name,
        "phone": phone,
        "email": email,
        "license_number": license_number,
        "license_expiry": license_expiry,
        "assigned_vehicle_registration": assigned_vehicle_registration,
        "experience": experience,
        "status": status,
        "availability": availability,
        "address": address,
    }

    drivers_data.append(driver)
    _sync_driver_vehicle_assignment(driver, previous_vehicle_registration=None)

    flash("Driver added successfully.", "success")
    return redirect(url_for("drivers"))


@app.route("/delete_driver", methods=["POST"])
def delete_driver():
    license_number = request.form.get("license_number", "").strip()
    global drivers_data
    drivers_data = [d for d in drivers_data if d.get("license_number") != license_number]
    flash("Driver deleted successfully.", "success")
    return redirect(url_for("drivers"))


@app.route("/trips")
def trips():
    """Trip management page (in-memory module, no DB)."""
    global trips_data

    # Routes for filter dropdown
    routes = sorted({t.get("route", "").strip() for t in trips_data if t.get("route", "").strip()})

    # KPIs (simple business logic based on date + status)
    today_date = __import__("datetime").date.today()

    def parse_departure_date(iso):
        # expecting YYYY-MM-DD
        try:
            return __import__("datetime").date.fromisoformat(iso)
        except Exception:
            return None

    trips_today = sum(1 for t in trips_data if parse_departure_date(t.get("departure_date")) == today_date and t.get("status") != "Cancelled")
    scheduled = sum(1 for t in trips_data if t.get("status") == "Scheduled")
    on_trip = sum(1 for t in trips_data if t.get("status") == "On Trip")
    completed = sum(1 for t in trips_data if t.get("status") == "Completed")

    # Expand driver name + vehicle registration directly from stored fields
    # Ensure required keys exist for template.
    normalized = []
    for t in trips_data:
        driver_name = t.get("driver_name")
        vehicle_reg = t.get("vehicle_registration")
        normalized.append(
            {
                "trip_id": t.get("trip_id"),
                "pickup_location": t.get("pickup_location"),
                "destination": t.get("destination"),
                "driver_name": driver_name,
                "vehicle_registration": vehicle_reg,
                "route": t.get("route"),
                "departure_date": t.get("departure_date"),
                "departure_time": t.get("departure_time"),
                "expected_arrival": t.get("expected_arrival"),
                "distance_km": t.get("distance_km"),
                "status": t.get("status"),
            }
        )

    return render_template(
        "trips.html",
        trips=normalized,
        routes=routes,
        drivers=drivers_data,
        vehicles=vehicles_data,
        kpis={
            "trips_today": trips_today,
            "scheduled": scheduled,
            "on_trip": on_trip,
            "completed": completed,
        },
        active_page="trips",
    )


@app.route("/save_trip", methods=["POST"])
def save_trip():
    """Add/edit trip in memory."""
    global trips_data

    mode = request.form.get("mode")
    original_trip_id = request.form.get("original_trip_id", "").strip()

    trip_id = request.form.get("trip_id", "").strip()
    pickup_location = request.form.get("pickup_location", "").strip()
    destination = request.form.get("destination", "").strip()
    driver_name = request.form.get("driver", "").strip()
    vehicle_registration = request.form.get("vehicle", "").strip()
    departure_date = request.form.get("departure_date", "").strip()
    departure_time = request.form.get("departure_time", "").strip()
    expected_arrival_raw = request.form.get("expected_arrival", "").strip()
    distance_km = request.form.get("distance_km", "").strip()
    status = request.form.get("status", "Scheduled").strip()

    valid_status = {"Scheduled", "On Trip", "Completed", "Cancelled"}
    if status not in valid_status:
        flash("Invalid trip status.", "danger")
        return redirect(url_for("trips"))

    if not trip_id or not pickup_location or not destination or not driver_name or not vehicle_registration:
        flash("Required fields are missing.", "danger")
        return redirect(url_for("trips"))

    try:
        distance_km_num = int(float(distance_km))
        if distance_km_num <= 0:
            raise ValueError()
    except Exception:
        flash("Distance must be a positive number.", "danger")
        return redirect(url_for("trips"))

    # Build route from pickup->destination (simple for now)
    route = f"{pickup_location} → {destination}"

    # Validate driver/vehicle existence (best-effort)
    driver_ok = any(d.get("full_name") == driver_name for d in drivers_data)
    vehicle_ok = any(v.get("registration") == vehicle_registration for v in vehicles_data)
    if not driver_ok:
        flash("Selected driver not found.", "danger")
        return redirect(url_for("trips"))
    if not vehicle_ok:
        flash("Selected vehicle not found.", "danger")
        return redirect(url_for("trips"))

    # Normalize expected arrival for display and for datetime-local input compatibility.
    # datetime-local returns "YYYY-MM-DDTHH:MM". We store as that raw string.
    expected_arrival = expected_arrival_raw.replace("T", " ") if "T" in expected_arrival_raw else expected_arrival_raw

    if mode == "edit":
        for t in trips_data:
            if t.get("trip_id") == original_trip_id:
                t.update(
                    {
                        "trip_id": trip_id,
                        "pickup_location": pickup_location,
                        "destination": destination,
                        "driver_name": driver_name,
                        "vehicle_registration": vehicle_registration,
                        "departure_date": departure_date,
                        "departure_time": departure_time,
                        "expected_arrival": expected_arrival,
                        "distance_km": distance_km_num,
                        "status": status,
                        "route": route,
                    }
                )
                flash("Trip updated successfully.", "success")
                return redirect(url_for("trips"))
        flash("Trip to edit not found.", "danger")
        return redirect(url_for("trips"))

    # add mode
    if any(t.get("trip_id") == trip_id for t in trips_data):
        flash("Trip ID must be unique.", "danger")
        return redirect(url_for("trips"))

    trips_data.append(
        {
            "trip_id": trip_id,
            "pickup_location": pickup_location,
            "destination": destination,
            "driver_name": driver_name,
            "vehicle_registration": vehicle_registration,
            "departure_date": departure_date,
            "departure_time": departure_time,
            "expected_arrival": expected_arrival,
            "distance_km": distance_km_num,
            "status": status,
            "route": route,
        }
    )

    flash("Trip created successfully.", "success")
    return redirect(url_for("trips"))


@app.route("/delete_trip", methods=["POST"])
def delete_trip():
    global trips_data
    trip_id = request.form.get("trip_id", "").strip()
    trips_data = [t for t in trips_data if t.get("trip_id") != trip_id]
    flash("Trip deleted successfully.", "success")
    return redirect(url_for("trips"))


if __name__ == "__main__":
    app.run(debug=True)


