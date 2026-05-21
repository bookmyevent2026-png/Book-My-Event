from flask import Blueprint, request, jsonify
from pyexpat.errors import messages

from app.database import get_db_connection
from werkzeug.utils import secure_filename
import os

exhibitor_bp = Blueprint("exhibitor", __name__)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.abspath(os.path.join(BASE_DIR, "..", "uploads"))
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

from flask import send_from_directory

@exhibitor_bp.route('/uploads/<path:filename>')
def uploaded_file(filename):
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except Exception as e:
        print("FILE ERROR:", e)
        return jsonify({"error": "File not found"}), 404


@exhibitor_bp.route('/api/book-stall', methods=['POST'])
def book_stall():
    try:

        data = request.form

        event_id = data.get("event_id")

        email = data.get("email")

        conn = get_db_connection()
        cursor = conn.cursor()

        # ✅ CHECK BEFORE INSERT
        cursor.execute("""
                    SELECT id FROM Exhibitor_stall_bookings
                    WHERE email = %s AND event_id = %s
                """, (email, event_id))

        existing = cursor.fetchone()

        if existing:
            return jsonify({
                "success": False,
                "message": "You have already booked this event!"
            }), 400

        data = request.form
        print("Data Booking stall",data)

        event_id = data.get("event_id")
        user_id = data.get("user_id")
        eventname = data.get("eventName")
        print("User ID:", user_id)

        title = data.get("title")
        first_name = data.get("firstName")
        last_name = data.get("lastName")
        email = data.get("email")
        mobile = data.get("mobile")

        designation = data.get("designation")
        company_name = data.get("companyName")

        country = data.get("country")
        state = data.get("state")
        city = data.get("city")
        address = data.get("address")
        pin_code = data.get("pinCode")

        stall_area = data.get("stallArea")
        products = data.get("products")
        messages = data.get("message")

        # ✅ File Upload
        visiting_card_file = request.files.get("visitingCard")
        visiting_card_path = None

        if visiting_card_file:
            filename = secure_filename(visiting_card_file.filename)
            visiting_card_path = os.path.join(UPLOAD_FOLDER, filename)
            visiting_card_file.save(visiting_card_path)
            print(f"[SUCCESS] Visiting Card saved to: {visiting_card_path}")

        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
        INSERT INTO Exhibitor_stall_bookings (
            user_id, event_id, eventName,
            title, first_name, last_name, email, mobile,
            designation, company_name,
            country, state, city, address, pin_code,
            stall_area, products, messages, visiting_card
        )
        VALUES (
            %s, %s, %s,
            %s, %s, %s, %s, %s,
            %s, %s,
            %s, %s, %s, %s, %s,
            %s, %s, %s, %s
        )
        """

        values = (
            user_id,
            event_id,
            eventname,
            title,
            first_name,
            last_name,
            email,
            mobile,
            designation,
            company_name,
            country,
            state,
            city,
            address,
            pin_code,
            stall_area,
            products,
            messages,
            visiting_card_path
        )

        cursor.execute(query, values)
        conn.commit()

        return jsonify({
            "success": True,
            "message": "Stall booked successfully!"
        })

    except Exception as e:
        print(e)
        return jsonify({
            "success": False,
            "message": "Error booking stall"
        }), 500

    finally:
        cursor.close()
        conn.close()
# ================= GET ALL BOOKINGS =================
@exhibitor_bp.route('/api/my-bookings/<int:user_id>', methods=['GET'])
def get_my_bookings(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT b.*, e.event_name
        FROM Exhibitor_stall_bookings b
        JOIN event_details_table e ON b.event_id = e.id
        WHERE b.user_id = %s
        ORDER BY b.created_at DESC
        """

        cursor.execute(query, (user_id,))
        data = cursor.fetchall()
        
        base_url = request.host_url.rstrip("/")
        for row in data:
            if row.get("visiting_card"):
                file_path = row["visiting_card"].replace("\\", "/")
                
                if "/uploads/" in file_path:
                    relative_path = file_path.split("/uploads/")[-1]
                else:
                    relative_path = os.path.basename(file_path)

                base_url = request.host_url.rstrip("/")
                row["visiting_card_url"] = f"{base_url}/exhibitor/uploads/{relative_path}"
            else:
                row["visiting_card_url"] = None

        cursor.close()
        conn.close()

        return jsonify({"success": True, "data": data})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


# ================= GET SINGLE =================
@exhibitor_bp.route('/api/booking/<int:id>', methods=['GET'])
def get_single_booking(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT b.*, e.event_name
        FROM Exhibitor_stall_bookings b
        JOIN event_details_table e ON b.event_id = e.id
        WHERE b.id = %s
        """

        cursor.execute(query, (id,))
        data = cursor.fetchone()

        if data and data.get("visiting_card"):
            file_path = data["visiting_card"].replace("\\", "/")
            
            if "/uploads/" in file_path:
                relative_path = file_path.split("/uploads/")[-1]
            else:
                relative_path = os.path.basename(file_path)

            base_url = request.host_url.rstrip("/")
            data["visiting_card_url"] = f"{base_url}/exhibitor/uploads/{relative_path}"
        elif data:
            data["visiting_card_url"] = None

        cursor.close()
        conn.close()

        return jsonify({"success": True, "data": data})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


# ================= UPDATE =================
@exhibitor_bp.route('/api/update-booking/<int:id>', methods=['PUT'])
def update_booking(id):
    try:
        data = request.json

        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
        UPDATE Exhibitor_stall_bookings SET
            title=%s,
            first_name=%s,
            last_name=%s,
            email=%s,
            mobile=%s,
            designation=%s,
            company_name=%s,
            country=%s,
            state=%s,
            city=%s,
            address=%s,
            pin_code=%s,
            stall_area=%s,
            products=%s
        WHERE id=%s
        """

        values = (
            data.get("title"),
            data.get("first_name"),
            data.get("last_name"),
            data.get("email"),
            data.get("mobile"),
            data.get("designation"),
            data.get("company_name"),
            data.get("country"),
            data.get("state"),
            data.get("city"),
            data.get("address"),
            data.get("pin_code"),
            data.get("stall_area"),
            data.get("products"),
            id
        )

        cursor.execute(query, values)
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"success": True, "message": "Updated successfully"})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})