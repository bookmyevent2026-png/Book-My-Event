import sys
import os
sys.path.append(os.getcwd())
from app.database import get_db_connection

def fix_booking_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        print("Checking user_booking_details table...")
        
        # Ensure qr_data is TEXT (it usually is, but let's be sure)
        cursor.execute("ALTER TABLE user_booking_details MODIFY COLUMN qr_data TEXT;")
        
        # Check for missing columns
        columns_to_add = [
            ("food_preference", "VARCHAR(50) DEFAULT 'None'"),
            ("is_scanned", "BOOLEAN DEFAULT FALSE"),
            ("scanned_at", "DATETIME")
        ]
        
        for col_name, col_type in columns_to_add:
            cursor.execute(f"SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'user_booking_details' AND COLUMN_NAME = %s", (col_name,))
            if not cursor.fetchone():
                print(f"Adding column {col_name}...")
                cursor.execute(f"ALTER TABLE user_booking_details ADD COLUMN {col_name} {col_type};")
        
        conn.commit()
        print("Successfully verified/updated user_booking_details table.")
    except Exception as e:
        print(f"Error updating booking table: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    fix_booking_table()
