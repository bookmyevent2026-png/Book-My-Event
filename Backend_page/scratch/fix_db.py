import sys
import os
sys.path.append(os.getcwd())
from app.database import get_db_connection

def fix_profile_image_column():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        print("Upgrading photo columns to LONGTEXT...")
        cursor.execute("ALTER TABLE users MODIFY COLUMN profile_image LONGTEXT;")
        cursor.execute("ALTER TABLE event_guests MODIFY COLUMN image LONGTEXT;")
        cursor.execute("ALTER TABLE messages_greetings_table MODIFY COLUMN image_path LONGTEXT;")
        conn.commit()
        print("Successfully upgraded all photo columns.")
    except Exception as e:
        print(f"Error upgrading column: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    fix_profile_image_column()
