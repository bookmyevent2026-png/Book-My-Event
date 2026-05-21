import random
import time
from app.Services.mail_service import send_otp_email,send_otp_email_reset

otp_store = {}
verified_users = set()

OTP_EXPIRATION_SECONDS = 300  # 5 minutes


def generate_otp():
    return str(random.randint(100000, 999999))


def send_otp(email):
    email = email.lower().strip()

    otp = generate_otp()
    expiration = time.time() + OTP_EXPIRATION_SECONDS

    otp_store[email] = (otp, expiration)

    send_otp_email(email, otp)
    return True


def send_reset_otp(email):
    email = email.lower().strip()

    otp = generate_otp()
    expiration = time.time() + OTP_EXPIRATION_SECONDS

    otp_store[email] = (otp, expiration)

    send_otp_email_reset(email, otp)
    return True


def resend_otp(email):
    return send_otp(email)

def resend_reset_otp(email):

    return send_reset_otp(email)


def verify_otp(email, user_otp):
    email = email.lower().strip()

    if email not in otp_store:
        return {"status": False, "message": "No OTP found"}

    stored_otp, expiration = otp_store[email]


    if time.time() > expiration:
        del otp_store[email]
        return {"status": False, "message": "OTP expired"}

        # ✅ FIXED COMPARISON
    if str(user_otp).strip() != str(stored_otp).strip():
        return {"status": False, "message": "Invalid OTP"}

    verified_users.add(email)
    del otp_store[email]

    return {"status": True, "message": "OTP verified"}


def is_verified(email):
    email = email.lower().strip()

    return email in verified_users


def clear_verified(email):
    email = email.lower().strip()

    if email in verified_users:
        verified_users.remove(email)