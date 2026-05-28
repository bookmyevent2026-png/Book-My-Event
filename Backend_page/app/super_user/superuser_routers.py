from flask import Blueprint, request, jsonify,send_from_directory
import os
from app.database import get_db_connection
from werkzeug.security import generate_password_hash
from datetime import timedelta
superuser_bp = Blueprint("superuser", __name__)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.abspath(os.path.join(BASE_DIR, "..", "uploads"))



def create_default_superuser():
    db=None
    cursor=None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        name = "superuser"
        email = "bookmyevent2026@gmail.com"
        password = "admin@#$123"

        # 🔐 Hash password
        hashed_password = generate_password_hash(password)

        # ✅ Check if exists
        cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
        existing = cursor.fetchone()

        if existing:
            print("[OK] SuperUser already exists")
        else:
            cursor.execute("""
                INSERT INTO users (name, email, password, role)
                VALUES (%s, %s, %s, %s)
            """, (name, email, hashed_password, "superuser"))

            db.commit()
            print("[OK] SuperUser auto-created")

    except Exception as e:
        print("[ERROR] Error creating superuser:", e)

    finally:
        cursor.close()
        db.close()

@superuser_bp.route('/uploads/<path:filename>')
def uploaded_file(filename):
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except Exception as e:
        print("FILE ERROR:", e)
        return jsonify({"error": "File not found"}), 404

#  Helper: format time
def format_time(td):
    if isinstance(td, timedelta):
        total_seconds = int(td.total_seconds())
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        return f"{hours:02}:{minutes:02}"
    return str(td) if td else None

# ✅ MAIN API
@superuser_bp.route("/get-events", methods=["GET"])
def get_events():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT 
                e.id, 
                e.event_name, 
                e.status,
                e.category,
                e.start_date, 
                e.start_time,
                e.end_date,
                e.end_time,
                e.venue,
                
                 
                e.address,
                e.created_by,
                b.capacity,
                b.charge_type,
                f.file_path,
                f.file_type AS banner_type
            FROM event_details_table e
            LEFT JOIN event_booking_details b 
                ON e.id = b.event_id
            LEFT JOIN event_files f 
                ON e.id = f.event_id AND f.file_type = 'banner'
            ORDER BY e.id DESC
        """)

        data = cursor.fetchall()

        events_dict = {}

        for row in data:
            # =========================
            # ✅ FORMAT DATE
            # =========================
            if row.get("start_date"):
                row["start_date"] = row["start_date"].strftime("%Y-%m-%d")
            if row.get("end_date"):
                row["end_date"] = row["end_date"].strftime("%Y-%m-%d")

            # =========================
            # ✅ FORMAT TIME
            # =========================
            row["start_time"] = format_time(row.get("start_time"))
            row["end_time"] = format_time(row.get("end_time"))

            # =========================
            # ✅ FIX IMAGE URL (CRITICAL)
            # =========================
            banner_url = None
            if row.get("file_path"):
                file_path = row["file_path"].replace("\\", "/")
                
                # Extract relative path (photos/img.jpg) even if path is absolute
                if "/uploads/" in file_path:
                    relative_path = file_path.split("/uploads/")[-1]
                else:
                    relative_path = os.path.basename(file_path)

                base_url = request.host_url.rstrip("/")
                banner_url = f"{base_url}/superuser/uploads/{relative_path}"
            
            event_id = row["id"]
            if event_id not in events_dict:
                row["banner_url"] = banner_url
                row["images"] = []
                if banner_url:
                    row["images"].append({"url": banner_url, "banner_type": row["banner_type"]})
                events_dict[event_id] = row
            else:
                if banner_url:
                    if not any(img["url"] == banner_url for img in events_dict[event_id]["images"]):
                        events_dict[event_id]["images"].append({"url": banner_url, "banner_type": row["banner_type"]})

            # Remove raw path (clean response)
            row.pop("file_path", None)

        cursor.close()
        conn.close()

        return jsonify({
            "status": "success",
            "events": list(events_dict.values())
        }), 200

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@superuser_bp.route("/event-full-details/<int:event_id>")
def full_event(event_id):
    try:
        print("Eventid", event_id)

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT e.*, 
                   u.name as organizer_name, 
                   u.email as organizer_email,
                   u.address as organizer_address,
                   u.mobile as organizer_phone,
                   u.city as organizer_city,
                   u.state as organizer_state,
                   u.organization_name as organizer_company
            FROM event_details_table e
            LEFT JOIN users u ON e.user_id = u.id
            WHERE e.id=%s
        """, (event_id,))
        event = cursor.fetchone()

        cursor.execute("SELECT * FROM event_booking_details WHERE event_id=%s", (event_id,))
        booking = cursor.fetchone()

        cursor.execute("SELECT * FROM event_stalls WHERE event_id=%s", (event_id,))
        stalls = cursor.fetchall()

        cursor.execute("SELECT * FROM event_files WHERE event_id=%s", (event_id,))
        docs = cursor.fetchall()

        cursor.execute("SELECT * FROM event_terms WHERE event_id=%s", (event_id,))
        terms = cursor.fetchall()

        cursor.execute("SELECT * FROM event_vendors WHERE event_id=%s", (event_id,))
        vendors = cursor.fetchall()

        cursor.execute("SELECT * FROM event_sponsors WHERE event_id=%s", (event_id,))
        sponsors = cursor.fetchall()

        cursor.execute("SELECT * FROM event_guests WHERE event_id=%s", (event_id,))
        guests = cursor.fetchall()

        cursor.execute("SELECT * FROM event_food_items WHERE event_id=%s", (event_id,))
        food_items = cursor.fetchall()

        cursor.execute("SELECT * FROM event_vehicle_details WHERE event_id=%s", (event_id,))
        vehicle_details = cursor.fetchall()

        cursor.execute("SELECT * FROM event_vehicle_addons WHERE event_id=%s", (event_id,))
        vehicle_addons = cursor.fetchall()

        cursor.execute("SELECT * FROM stall_amenities WHERE event_id=%s", (event_id,))
        amenities = cursor.fetchall()

        # =========================
        # ✅ FIX TIME FIELDS
        # =========================
        def fix_time(data):
            if isinstance(data, dict):
                for k, v in data.items():
                    if isinstance(v, timedelta):
                        total_seconds = int(v.total_seconds())
                        hours = total_seconds // 3600
                        minutes = (total_seconds % 3600) // 60
                        data[k] = f"{hours:02}:{minutes:02}"
            return data

        # Apply fix
        event = fix_time(event)
        booking = fix_time(booking)

        # Inject event status into booking if booking exists
        if booking and event:
            booking["status"] = event.get("status", "PENDING")

        for s in stalls:
            fix_time(s)

        for d in docs:
            fix_time(d)
            if d.get("file_path"):
                file_path = d["file_path"].replace("\\", "/")
                if "/uploads/" in file_path:
                    relative_path = file_path.split("/uploads/")[-1]
                else:
                    relative_path = os.path.basename(file_path)
                
                base_url = request.host_url.rstrip("/")
                d["file_url"] = f"{base_url}/superuser/uploads/{relative_path}"
                d.pop("file_path", None)
            else:
                d["file_url"] = None

        for t in terms:
            fix_time(t)

        for v in vendors:
            fix_time(v)

        # Identify banner and type for the frontend
        banner_file = next((d for d in docs if d.get('file_type') == 'banner'), None)
        if banner_file:
            event['banner_url'] = banner_file.get('file_url')
            event['banner_type'] = banner_file.get('file_type')
        else:
            event['banner_url'] = None
            event['banner_type'] = None

        cursor.close()
        conn.close()

        return jsonify({
            "eventDetails": event,
            "organizer": {
                "name": event.get("organizer_name"),
                "company_name": event.get("organizer_company"),
                "email": event.get("organizer_email"),
                "address": f"{event.get('organizer_address') or ''} {event.get('organizer_city') or ''} {event.get('organizer_state') or ''}".strip(),
                "phone": event.get("organizer_phone")
            },
            "booking": booking,
            "layout": {"stalls": stalls, "amenities": amenities},
            "documents": {"docs": docs},
            "terms": terms,
            "vendors": vendors,
            "sponsors": sponsors,
            "guests": guests,
            "food_items": food_items,
            "vehicle_details": vehicle_details,
            "vehicle_addons": vehicle_addons
        })

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
@superuser_bp.route("/update-status/<int:event_id>", methods=["PUT"])
def update_status(event_id):
    data = request.json
    status = data.get("status")

    conn = get_db_connection()
    cursor = conn.cursor()

    if status == "APPROVED":
        cursor.execute("""
            UPDATE event_details_table
            SET status=%s, approved_at=NOW(), rejected_at=NULL
            WHERE id=%s
        """, (status, event_id))

    elif status == "REJECTED":
        cursor.execute("""
            UPDATE event_details_table
            SET status=%s, rejected_at=NOW(), approved_at=NULL
            WHERE id=%s
        """, (status, event_id))

    elif status == "PENDING":   # ✅ ADD THIS
        cursor.execute("""
            UPDATE event_details_table
            SET status=%s, approved_at=NULL, rejected_at=NULL
            WHERE id=%s
        """, (status, event_id))

    else:
        return jsonify({"error": "Invalid status"}), 400

    conn.commit()

    return jsonify({"success": True})