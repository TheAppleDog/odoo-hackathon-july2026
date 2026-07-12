import mysql.connector
from config import *

def get_connection():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )

def get_dashboard_stats():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) AS total FROM vehicles")
    vehicles = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) AS total FROM drivers")
    drivers = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) AS total FROM trips")
    trips = cursor.fetchone()["total"]

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM vehicles
        WHERE status='Maintenance'
    """)
    maintenance = cursor.fetchone()["total"]

    cursor.close()
    conn.close()

    return {
        "active_vehicles": vehicles,
        "drivers": drivers,
        "active_trips": trips,
        "maintenance_vehicles": maintenance
    }

def get_all_vehicles():

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM vehicles")

    vehicles = cursor.fetchall()

    cursor.close()

    conn.close()

    return vehicles
def add_vehicle(data):

    conn = get_connection()
    cursor = conn.cursor()

    sql = """
    INSERT INTO vehicles
    (
        registration_number,
        vehicle_name,
        vehicle_type,
        capacity,
        fuel_type,
        odometer,
        purchase_date,
        status
    )

    VALUES(%s,%s,%s,%s,%s,%s,%s,%s)
    """

    cursor.execute(sql, data)

    conn.commit()

    cursor.close()

    conn.close()