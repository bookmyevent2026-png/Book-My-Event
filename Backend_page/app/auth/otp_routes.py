from flask import Blueprint, request, jsonify
from app.Services.otp_service import send_otp, verify_otp, resend_otp,is_verified,clear_verified,send_reset_otp,resend_reset_otp
from app.database import get_db_connection
from werkzeug.security import generate_password_hash

otp_bp = Blueprint("otp", __name__)


@otp_bp.route('/send-otp', methods=['POST'])
def send_otp_route():
    email = request.json.get("email", "").lower().strip()


    if not email:
        return jsonify({"error": "Email required"}), 400

    send_otp(email)
    return jsonify({"message": "OTP sent"})


@otp_bp.route('/resend-otp', methods=['POST'])
def resend_otp_route():
    email = request.json.get("email", "").lower().strip()


    if not email:
        return jsonify({"error": "Email required"}), 400

    resend_otp(email)
    return jsonify({"message": "OTP resent"})


@otp_bp.route('/verify-otp', methods=['POST'])
def verify_otp_route():
    data = request.json
    email = data.get("email", "").lower().strip()

    otp = data.get("otp")

    result = verify_otp(email, otp)

    if result["status"]:
        return jsonify({"message": "Verified"})
    else:
        return jsonify({"error": result["message"]}), 400


# 🔹 CHECK EMAIL EXISTS
def check_email_exists(email):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    return user is not None
def get_user_by_email(email):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT email, role FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()

    cursor.close()
    connection.close()

    return user
# 🔹 SEND OTP
@otp_bp.route("/reset/send-otp", methods=["POST"])
def send_otp_reset():
    data = request.json
    email = data.get("email", "").lower().strip()


    if not email:
        return {"status": False, "message": "Email required"}, 400

    user = get_user_by_email(email)

    # ✅ CHECK EMAIL
    if not user:
        return {"status": False, "message": "Email not registered ❌"}, 404

    # ✅ CHECK ROLE
    if user["role"] == "superuser":
        return {
            "status": False,
            "message": "Superuser password cannot be reset ❌"
        }, 403

    # ✅ SEND OTP
    send_reset_otp(email)

    return {"status": True, "message": "OTP sent successfully"}



# 🔹 RESEND OTP
@otp_bp.route("/reset/resend-otp", methods=["POST"])
def resend_otp_reset():
    data = request.json
    email = data.get("email", "").lower().strip()


    if not email:
        return {"status": False, "message": "Email required"}, 400

    if not check_email_exists(email):
        return {"status": False, "message": "Email not registered ❌"}, 404

    resend_reset_otp(email)

    return {"status": True, "message": "OTP resent successfully"}


# 🔹 VERIFY OTP
@otp_bp.route("/reset/verify-otp", methods=["POST"])
def verify_otp_reset():
    data = request.json
    email = data.get("email", "").lower().strip()

    otp = data.get("otp")

    if not email or not otp:
        return {"status": False, "message": "Email & OTP required"}, 400

    result = verify_otp(email, otp)
    return result


# 🔹 RESET PASSWORD
@otp_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.json
    email = data.get("email", "").lower().strip()

    password = data.get("password")

    if not email or not password:
        return {"status": False, "message": "Email & password required"}, 400

    # ✅ CHECK EMAIL EXISTS
    if not check_email_exists(email):
        return {"status": False, "message": "User not found"}, 404

    # ✅ CHECK OTP VERIFIED
    if not is_verified(email):
        return {"status": False, "message": "OTP not verified"}, 400

    hashed_password = generate_password_hash(password)

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE users SET password=%s WHERE email=%s",
        (hashed_password, email)
    )

    conn.commit()
    cursor.close()
    conn.close()

    clear_verified(email)

    return {"status": True, "message": "Password updated successfully"}