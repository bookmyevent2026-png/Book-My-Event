import qrcode
import io
import base64
from flask import Blueprint, request, jsonify
from app.database import get_db_connection
from app.Services.otp_service import is_verified, clear_verified
from app.Services.mail_service import send_booking_email

user_bp = Blueprint("user", __name__)


@user_bp.route('/book-event', methods=['POST'])
def book_event():
    data = request.json

    event_id = data.get("event_id")
    name = data.get("name")
    email = data.get("email", "").lower().strip()

    phone = data.get("phone")
    food_preference = data.get("food_preference", "None")

    # 🔥 OTP CHECK
    if not is_verified(email):
        return jsonify({"error": "Please verify OTP first"}), 403

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        print(f"--- Booking Attempt for Event ID: {event_id} ---")
        print(f"Data received: {data}")

        # 🔥 EVENT DETAILS
        cursor.execute("SELECT * FROM event_details_table WHERE id = %s", (event_id,))
        event = cursor.fetchone()

        if not event:
            print(f"[ERROR] Event {event_id} not found")
            return jsonify({"error": "Event not found"}), 404

        print(f"Found event: {event.get('event_name')}")

        # 🔥 INSERT BOOKING
        print("Inserting booking into user_booking_details...")
        cursor.execute("""
            INSERT INTO user_booking_details (event_id, name, email, phone, food_preference, qr_data)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (event_id, name, email, phone, food_preference, "PENDING"))
        booking_id = cursor.lastrowid
        conn.commit()
        print(f"[SUCCESS] Booking record created with ID: {booking_id}")

        # 🔥 GENERATE QR CONTENT
        qr_text = f"Event: {event.get('event_name')}\n"
        qr_text += f"Date: {event.get('start_date')}\n"
        qr_text += f"Food: {food_preference}\n"
        qr_text += f"Verify: https://events.sportalytics.in/validate-booking/{booking_id}"

        # Update qr_text in DB
        cursor.execute("UPDATE user_booking_details SET qr_data = %s WHERE id = %s", (qr_text, booking_id))
        conn.commit()
        print("[SUCCESS] QR data updated in database")

        # 🔥 GENERATE QR CODE IMAGE
        print("Generating QR code image...")
        qr = qrcode.QRCode(version=1, box_size=10, border=4)
        qr.add_data(qr_text)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        qr_base64 = base64.b64encode(buffered.getvalue()).decode()

        # 🔥 CLEAR VERIFIED
        clear_verified(email)

        # 🔥 SEND MAIL
        print(f"Attempting to send booking email to {email}...")
        try:
            send_booking_email(email, name, event, qr_base64, food_preference)
            print("[SUCCESS] Booking email sent successfully")
        except Exception as mail_err:
            print(f"⚠️ Email failed but booking was saved: {mail_err}")
            # We don't return error here because the booking was already saved

        return jsonify({
            "message": "Booking successful",
            "booking_id": booking_id,
            "qr_code": qr_base64,
            "event_details": {
                "name": event.get('event_name'),
                "venue": event.get('venue'),
                "date": str(event.get('start_date')),
                "food": food_preference
            }
        })

    except Exception as e:
        print(f"[ERROR] CRITICAL BOOKING ERROR: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@user_bp.route('/validate-qr/<int:booking_id>', methods=['GET'])
def validate_qr(booking_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Fetch booking and event details
        cursor.execute("""
            SELECT 
                b.*, 
                e.event_name, 
                e.venue, 
                e.start_date,
                e.start_time,
                e.food
            FROM user_booking_details b
            JOIN event_details_table e ON b.event_id = e.id
            WHERE b.id = %s
        """, (booking_id,))
        booking = cursor.fetchone()

        if not booking:
            return jsonify({"error": "Invalid Ticket / Booking not found"}), 404

        status = "success"
        message = "Ticket Verified Successfully"
        
        if booking['is_scanned']:
            status = "already_scanned"
            message = "This ticket has already been used"
        else:
            # Mark as scanned
            cursor.execute("""
                UPDATE user_booking_details 
                SET is_scanned = TRUE, scanned_at = NOW() 
                WHERE id = %s
            """, (booking_id,))
            conn.commit()

        return jsonify({
            "status": status,
            "message": message,
            "details": {
                "visitor_name": booking['name'],
                "event_name": booking['event_name'],
                "venue": booking['venue'],
                "date": str(booking['start_date']),
                "time": str(booking['start_time']),
                "food": booking['food_preference'],
                "include_food": bool(booking['food']),
                "scanned_at": str(booking['scanned_at']) if booking['scanned_at'] else None
            }
        })

    except Exception as e:
        print(f"[ERROR] Validation Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    finally:
        cursor.close()
        conn.close()