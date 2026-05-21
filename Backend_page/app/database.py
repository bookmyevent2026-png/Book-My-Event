import mysql.connector

def get_db_connection(db_name="event_db"):
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Dhinesh@2002",
        database=db_name
    )
