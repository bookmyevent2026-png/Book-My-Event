from app.database import get_db_connection

try:
    db = get_db_connection()
    print("Connection successful!")
    cursor = db.cursor()
    cursor.execute("SELECT DATABASE()")
    print("Database:", cursor.fetchone())
    db.close()
except Exception as e:
    print("Connection failed:", e)
