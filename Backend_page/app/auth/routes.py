from flask import Blueprint, request, jsonify
from app.database import get_db_connection
import jwt
import datetime
from app.config import SECRET_KEY
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint("auth", __name__)

# REGISTER
@auth_bp.route("/api/register", methods=["POST"])
def register():
    data = request.json
    print(data)

    name = data["name"]
    email = data["email"]
    password = data["password"]
    role = data.get("role")

    allowed_roles = ["organizer", "exhibitor"]

    if role not in allowed_roles:
        return jsonify({"message": "Invalid role"}), 400

    db = get_db_connection()
    cursor = db.cursor()

    # check email first
    cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
    existing = cursor.fetchone()

    if existing:
        cursor.close()
        db.close()
        return jsonify({"message": "Email already registered"}), 400

    # 🔐 hash password
    hashed_password = generate_password_hash(password)

    # insert user
    cursor.execute(
        "INSERT INTO users(name,email,password,role) VALUES(%s,%s,%s,%s)",
        (name, email, hashed_password, role)
    )
    db.commit()

    cursor.close()
    db.close()

    return jsonify({"message": "User registered successfully"})
# LOGIN
@auth_bp.route("/api/login", methods=["POST"])
def login():
    db = None
    cursor = None

    try:
        data = request.json
        print("Login",data)

        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not email or not password:
            return jsonify({"message": "Email and password required"}), 400

        db = get_db_connection()
        cursor = db.cursor()

        cursor.execute(
            "SELECT id, name, email, password, role, profile_image FROM users WHERE email=%s",
            (email,)
        )

        user = cursor.fetchone()
        print("after", user)

        if user is None:
            return jsonify({"message": "Email Id is not registered"}), 401

        user_id, name, email_db, hashed_password, role, profile_image = user

        if not check_password_hash(hashed_password, password):
            return jsonify({"message": "Invalid password"}), 401

        token = jwt.encode(
            {
                "user_id": user_id,
                "role": role
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        return jsonify({
            "message": "Login successful",
            "token": token,
            "name": name,
            "email": email_db,
            "role": role,
            "User_id": user_id,
            "profile_image": profile_image
        }), 200

    except Exception as e:
        print("Login Error:", e)
        return jsonify({
            "message": "Server error",
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()
