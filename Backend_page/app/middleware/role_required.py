from functools import wraps
from flask import request, jsonify
import jwt
from app.config import SECRET_KEY


def role_required(required_role):

    def decorator(func):

        @wraps(func)
        def wrapper(*args, **kwargs):

            auth_header = request.headers.get("Authorization")

            if not auth_header:
                return jsonify({"message": "Authorization header missing"}), 401

            # Expect: Bearer TOKEN
            parts = auth_header.split()

            if len(parts) != 2 or parts[0] != "Bearer":
                return jsonify({"message": "Invalid authorization format"}), 401

            token = parts[1]

            try:
                decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

                user_id = decoded.get("user_id")
                user_role = decoded.get("role")

            except jwt.ExpiredSignatureError:
                return jsonify({"message": "Token expired"}), 401

            except jwt.InvalidTokenError:
                return jsonify({"message": "Invalid token"}), 401

            # Role validation
            if user_role != required_role:
                return jsonify({"message": "Access denied"}), 403

            # attach user info
            request.user_id = user_id
            request.user_role = user_role

            return func(*args, **kwargs)

        return wrapper

    return decorator