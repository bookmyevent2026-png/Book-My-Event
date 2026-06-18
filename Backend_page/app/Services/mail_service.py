import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
import os
import base64
from datetime import datetime, timedelta

SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
SMTP_USERNAME = os.getenv("EMAIL_USER", "bookmyevent2026@gmail.com")
SMTP_PASSWORD = os.getenv("EMAIL_PASS", "cujb rsli ihts oewf")

def send_email(to_email, subject, message, is_html=False, qr_base64=None):
    if qr_base64:
        msg = MIMEMultipart('related')
        msg_alternative = MIMEMultipart('alternative')
        msg.attach(msg_alternative)
        
        if is_html:
            part = MIMEText(message, 'html')
        else:
            part = MIMEText(message, 'plain')
        msg_alternative.attach(part)
        
        # Attach QR Code
        qr_data = base64.b64decode(qr_base64)
        img = MIMEImage(qr_data)
        img.add_header('Content-ID', '<qrcode>')
        msg.attach(img)
    else:
        if is_html:
            msg = MIMEText(message, "html")
        else:
            msg = MIMEText(message, "plain")

    msg['Subject'] = subject
    msg['From'] = SMTP_USERNAME
    msg['To'] = to_email

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)

        print(f"[SUCCESS] Email sent to {to_email}")

    except Exception as e:
        print(f"[ERROR] Email error: {e}")
        raise e

def send_otp_email(email, otp):
    subject = "Your OTP for Event Booking"
    message = f"""<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px; }}
        .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }}
        .header {{ background-color: #2563eb; color: #ffffff; padding: 30px 20px; text-align: center; }}
        .header h1 {{ margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px; }}
        .body {{ padding: 30px; color: #333333; }}
        .greeting {{ font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #1e293b; }}
        .message-text {{ font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 25px; }}
        .otp-container {{ text-align: center; margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1; }}
        .otp-code {{ font-size: 36px; font-weight: 700; color: #2563eb; letter-spacing: 4px; margin: 0; }}
        .validity {{ font-size: 13px; color: #ef4444; font-weight: 600; margin-top: 10px; }}
        .security-section {{ background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 30px; border-radius: 4px; }}
        .security-title {{ font-size: 14px; font-weight: 600; color: #b45309; margin-bottom: 8px; margin-top: 0; }}
        .security-list {{ margin: 0; padding-left: 20px; font-size: 13px; color: #92400e; }}
        .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; background-color: #f8fafc; border-top: 1px solid #e2e8f0; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Book My Event</h1>
        </div>
        <div class="body">
            <div class="greeting">Hello,</div>
            <div class="message-text">
                Thank you for choosing Book My Event. Please use the following One-Time Password (OTP) to verify your request.
            </div>
            
            <div class="otp-container">
                <p class="otp-code">{otp}</p>
                <p class="validity">This OTP is valid for 5 minutes.</p>
            </div>
            
            <div class="security-section">
                <p class="security-title">For your security:</p>
                <ul class="security-list">
                    <li>Do not share this OTP with anyone.</li>
                    <li>Our team will never ask you for your OTP.</li>
                </ul>
            </div>
            
            <div style="margin-top: 30px; font-size: 14px; color: #64748b;">
                If you did not initiate this request, please ignore this email.
            </div>
        </div>
        <div class="footer">
            &copy; 2026 Book My Event. All rights reserved.
        </div>
    </div>
</body>
</html>"""
    send_email(email, subject, message, is_html=True)

def send_otp_email_reset(email, otp):
    subject = "🔐 Password Reset OTP"

    message = f"""<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px; }}
        .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }}
        .header {{ background-color: #2563eb; color: #ffffff; padding: 30px 20px; text-align: center; }}
        .header h1 {{ margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px; }}
        .body {{ padding: 30px; color: #333333; }}
        .greeting {{ font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #1e293b; }}
        .message-text {{ font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 25px; }}
        .otp-container {{ text-align: center; margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1; }}
        .otp-code {{ font-size: 36px; font-weight: 700; color: #2563eb; letter-spacing: 4px; margin: 0; }}
        .validity {{ font-size: 13px; color: #ef4444; font-weight: 600; margin-top: 10px; }}
        .security-section {{ background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 30px; border-radius: 4px; }}
        .security-title {{ font-size: 14px; font-weight: 600; color: #b45309; margin-bottom: 8px; margin-top: 0; }}
        .security-list {{ margin: 0; padding-left: 20px; font-size: 13px; color: #92400e; }}
        .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; background-color: #f8fafc; border-top: 1px solid #e2e8f0; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="body">
            <div class="greeting">Hello,</div>
            <div class="message-text">
                We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed.
            </div>
            
            <div class="otp-container">
                <p class="otp-code">{otp}</p>
                <p class="validity">This OTP is valid for 5 minutes.</p>
            </div>
            
            <div class="security-section">
                <p class="security-title">For your security:</p>
                <ul class="security-list">
                    <li>Do not share this OTP with anyone.</li>
                    <li>Our team will never ask you for your OTP.</li>
                </ul>
            </div>
            
            <div style="margin-top: 30px; font-size: 14px; color: #64748b;">
                If you did not initiate this request, please ignore this email. Your password will remain unchanged.
            </div>
        </div>
        <div class="footer">
            &copy; 2026 Book My Event. All rights reserved.
        </div>
    </div>
</body>
</html>"""

    send_email(email, subject, message, is_html=True)

# =========================================
# 🟢 BOOKING EMAIL FUNCTION (ONLY BOOKING)
# =========================================
def send_booking_email(email, name, event, qr_base64=None, food_preference="Veg"):
    """Send a professional HTML booking confirmation email with QR code"""
    subject = f"Booking Confirmed: {event.get('event_name', 'Event')}"

    # Format the start date to DD/MM/YYYY
    raw_date = event.get('start_date', 'N/A')
    formatted_date = raw_date
    if isinstance(raw_date, str):
        try:
            formatted_date = datetime.strptime(raw_date, "%Y-%m-%d").strftime("%d/%m/%Y")
        except ValueError:
            pass
            
    # Format Time to 12-hour format
    raw_time = event.get('start_time')
    formatted_time = "N/A"
    if raw_time:
        try:
            if isinstance(raw_time, timedelta):
                total_seconds = int(raw_time.total_seconds())
                hours = total_seconds // 3600
                minutes = (total_seconds % 3600) // 60
                time_obj = datetime.strptime(f"{hours}:{minutes}", "%H:%M")
                formatted_time = time_obj.strftime("%I:%M %p")
            elif isinstance(raw_time, str):
                time_obj = datetime.strptime(raw_time, "%H:%M:%S") if raw_time.count(':') == 2 else datetime.strptime(raw_time, "%H:%M")
                formatted_time = time_obj.strftime("%I:%M %p")
            else:
                formatted_time = raw_time.strftime("%I:%M %p")
        except Exception:
            formatted_time = str(raw_time)

    # Update template to include QR and Food Preference
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }}
            .email-container {{
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                overflow: hidden;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
            }}
            .header h1 {{
                margin: 0;
                font-size: 28px;
                font-weight: 600;
            }}
            .body {{
                padding: 40px 30px;
            }}
            .greeting {{
                font-size: 16px;
                margin-bottom: 30px;
                color: #333;
            }}
            .section {{
                margin-bottom: 30px;
                border-bottom: 1px solid #eee;
                padding-bottom: 20px;
            }}
            .section:last-child {{
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }}
            .section-title {{
                font-size: 13px;
                font-weight: 700;
                color: #667eea;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 15px;
            }}
            .event-name {{
                font-size: 22px;
                font-weight: 600;
                color: #333;
                margin-bottom: 10px;
            }}
            .info-row {{
                display: flex;
                margin-bottom: 12px;
                font-size: 14px;
            }}
            .info-label {{
                font-weight: 600;
                color: #667eea;
                width: 100px;
                min-width: 100px;
            }}
            .info-value {{
                color: #555;
                flex: 1;
            }}
            .qr-section {{
                text-align: center;
                background-color: #f9f9f9;
                padding: 30px;
                border-radius: 8px;
                margin-top: 20px;
            }}
            .qr-image {{
                width: 200px;
                height: 200px;
                margin-bottom: 15px;
            }}
            .food-tag {{
                display: inline-block;
                background-color: {"#e6fffa" if food_preference == "Veg" else "#fff5f5"};
                color: {"#2c7a7b" if food_preference == "Veg" else "#c53030"};
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
            }}
            .footer {{
                background-color: #f5f5f5;
                padding: 20px 30px;
                text-align: center;
                font-size: 12px;
                color: #999;
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>Ticket Confirmed!</h1>
                <p>Order #BM-{''.join(filter(str.isdigit, str(event.get('event_code', '000'))))}</p>
            </div>

            <div class="body">
                <div class="greeting">
                    <p>Hi {name},</p>
                    <p>Your spot is secured! Please find your digital ticket below. Show this QR code at the entrance for quick check-in.</p>
                </div>

                <div class="qr-section">
                    <div class="section-title">Digital Entry Pass</div>
                    <img src="cid:qrcode" class="qr-image" alt="QR Ticket">
                    <p style="font-size: 12px; color: #666;">Scan at the venue for entry</p>
                </div>

                <div class="section" style="margin-top: 30px;">
                    <div class="section-title">Event Details</div>
                    <div class="event-name">{event.get('event_name', 'N/A')}</div>
                    
                    <div class="info-row">
                        <div class="info-label">Date:</div>
                        <div class="info-value"><strong>{formatted_date}</strong></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Time:</div>
                        <div class="info-value"><strong>{formatted_time}</strong></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Venue:</div>
                        <div class="info-value">{event.get('venue', '')}{f", {event.get('address')}" if event.get('address') else ""}</div>
                    </div>
                    {f'''<div class="info-row">
                        <div class="info-label">Food:</div>
                        <div class="info-value"><span class="food-tag">{food_preference}</span></div>
                    </div>''' if event.get('food') else ''}
                </div>

                <div class="section">
                    <div class="section-title">Instructions</div>
                    <ul style="font-size: 14px; color: #555; padding-left: 20px;">
                        <li>Please arrive 15 minutes before the start time.</li>
                        <li>Carry a valid ID proof along with this digital ticket.</li>
                        <li>This QR code is valid for one-time entry only.</li>
                    </ul>
                </div>
            </div>

            <div class="footer">
                <p>If you have any questions, please contact our support team.</p>
                <p>&copy; 2026 Book my Event. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """

    send_email(email, subject, html_message, is_html=True, qr_base64=qr_base64)