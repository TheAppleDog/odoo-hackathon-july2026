from database.database import get_connection


def main() -> None:
    try:
        conn = get_connection()
        print("✅ Database Connected Successfully!")
        conn.close()
    except Exception as e:
        print("❌", e)


if __name__ == "__main__":
    main()

