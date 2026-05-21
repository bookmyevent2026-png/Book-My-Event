import os
import re
from flask import request, jsonify
from flask_cors import cross_origin
from app.chatbot import chatbot_bp
from app.database import get_db_connection

try:
    import google.generativeai as genai
    from dotenv import load_dotenv
    load_dotenv()
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
except ImportError:
    GEMINI_API_KEY = None


# ─── Intent detection ──────────────────────────────────────────────────────────

INTENT_PATTERNS = {
    "greeting":      r"\b(hello|hi|hey|good\s*(morning|afternoon|evening)|howdy|sup)\b",
    "farewell":      r"\b(bye|goodbye|see\s*you|exit|quit|thanks?\s*bye)\b",
    "thanks":        r"\b(thank(s| you)|appreciate|cheers)\b",
    "help":          r"\b(help|what can you|capabilities|what do you do)\b",
    "all_events":    r"\b(all|every|list|show|total|how many)\b.*\bevents?\b|\bevents?\b.*\b(all|list|total|count|how many)\b",
    "upcoming":      r"\b(upcoming|next|future|scheduled|coming)\b.*\bevents?\b|\bevents?\b.*\b(upcoming|coming|next)\b",
    "past_events":   r"\b(past|previous|completed|finished|old|earlier)\b.*\bevents?\b",
    "free_events":   r"\b(free|no.?charge|no.?cost|zero.?cost|complimentary)\b.*\bevents?\b|\bevents?\b.*\bfree\b",
    "paid_events":   r"\b(paid|pay|cost|fee|charge|price|pricing|how much|ticket.?price|ticket.?cost)\b",
    "capacity":      r"\b(capacity|seats?|space|how many people|attendee.?limit|max.?attendee)\b",
    "venue":         r"\b(venue|location|place|where|address|reach|direction|map)\b",
    "timing":        r"\b(time|timing|schedule|when|start.?time|end.?time|duration|hours?)\b",
    "booking":       r"\b(book|register|registration|booking|sign.?up|enroll|booking.?date|booking.?start|booking.?end)\b",
    "category":      r"\b(categor(y|ies)|type.?of.?event|event.?type|genre)\b",
    "music":         r"\b(music|concert|rahman|ar.?rahman|live.?music|performance)\b",
    "education":     r"\b(education|basketball|tournament|sports?|anna.?universit)\b",
    "technology":    r"\b(tech(nology)?|symposium|symposia|seminar|technical|innovation)\b",
    "business":      r"\b(business|car|expo|honda|automobile|exhibition)\b",
    "amenities":     r"\b(amenities|amenity|facilit(y|ies)|includ(ed|es)|what.?inside|features?)\b",
    "pass":          r"\b(pass(es)?|pass.?type|single.?pass|group.?pass)\b",
    "visibility":    r"\b(visib(le|ility)|public|private|open.?to.?all|restricted)\b",
    "faq":           r"\b(faq|question|frequently|common.?question)\b",
}

def detect_intent(message: str) -> list:
    """Return all matching intents for a message."""
    m = message.lower().strip()
    return [intent for intent, pattern in INTENT_PATTERNS.items() if re.search(pattern, m)]


# ─── DB context builder (smarter) ─────────────────────────────────────────────

def fetch_db_context(user_message: str, cursor) -> str:
    intents = detect_intent(user_message)
    context = []

    if not intents:
        # Generic fallback: return all events
        cursor.execute(
            "SELECT event_name, start_date, start_time, venue, category "
            "FROM event_details_table WHERE status = 'APPROVED' ORDER BY start_date ASC"
        )
        rows = cursor.fetchall()
        if rows:
            context.append("Here are the current approved events:")
            for i, r in enumerate(rows, 1):
                context.append(
                    f"\n{i}. {r['event_name']}\n"
                    f"   - Category: {r['category']}\n"
                    f"   - Date: {r['start_date']}  |  Time: {r['start_time']}\n"
                    f"   - Venue: {r['venue']}"
                )
        else:
            return "No events found at this time."
        return "\n".join(context)

    # ── Greeting / farewell / thanks ──────────────────────────────────────────
    if "greeting" in intents:
        return (
            "Hello! I'm EventBot 👋 — your event management assistant. "
            "I can help you with events, tickets, venues, schedules, and more. "
            "What would you like to know?"
        )

    if "farewell" in intents:
        return "Goodbye! Feel free to return whenever you need event information. Have a great day! 👋"

    if "thanks" in intents:
        return "You're welcome! 😊 Is there anything else I can help you with?"

    if "help" in intents:
        return (
            "I can help you with:\n"
            "• 📅 Upcoming & past events\n"
            "• 🎫 Ticket types & pricing\n"
            "• 📍 Venue & address details\n"
            "• 👥 Event capacity\n"
            "• ⏰ Schedules & timings\n"
            "• 🏷 Categories (Music, Technology, Business, Education)\n"
            "• ✨ Amenities & facilities\n"
            "• 🎟 Pass types & booking dates\n"
            "• 👁 Public / Private events"
        )

    # ── All / upcoming / past events ─────────────────────────────────────────
    if any(i in intents for i in ["all_events", "upcoming", "past_events"]):
        if "past_events" in intents:
            cursor.execute("""
                SELECT e.event_name, b.booking_start_date
                FROM event_booking_details b
                JOIN event_details_table e ON b.event_id = e.id
                WHERE b.booking_start_date < CURDATE() AND e.status = 'APPROVED'
                ORDER BY b.booking_start_date DESC
            """)
            rows = cursor.fetchall()
            if rows:
                context.append("Past events:")
                for i, r in enumerate(rows, 1):
                    context.append(f"\n{i}. {r['event_name']}\n   - Booking started: {r['booking_start_date']}")
            else:
                return "There are no past events on record."
        
        elif "upcoming" in intents:
            cursor.execute("""
                SELECT e.event_name, b.booking_start_date 
                FROM event_booking_details b 
                JOIN event_details_table e ON b.event_id = e.id 
                WHERE b.booking_start_date >= CURDATE() AND e.status = 'APPROVED'
                ORDER BY b.booking_start_date ASC
            """)
            rows = cursor.fetchall()
            if rows:
                context.append("Here are the current and upcoming events:")
                for i, r in enumerate(rows, 1):
                    context.append(f"\n{i}. {r['event_name']}\n   - Booking starts: {r['booking_start_date']}")
            else:
                return "No upcoming events found."
        
        else: # all_events
            cursor.execute(
                "SELECT event_name FROM event_details_table WHERE status = 'APPROVED' ORDER BY event_name ASC"
            )
            rows = cursor.fetchall()
            if rows:
                context.append(f"Here is the list of all approved events:")
                for i, r in enumerate(rows, 1):
                    context.append(f"{i}. {r['event_name']}")
            else:
                return "No approved events found."

    # ── Free events ───────────────────────────────────────────────────────────
    if "free_events" in intents:
        cursor.execute("""
            SELECT e.event_name, e.start_date, e.venue, b.charge_type
            FROM event_booking_details b
            JOIN event_details_table e ON b.event_id = e.id
            WHERE e.status = 'APPROVED' AND LOWER(b.charge_type) = 'free'
        """)
        rows = cursor.fetchall()
        if rows:
            context.append(f"\n✅ Free entry events ({len(rows)}):")
            for i, r in enumerate(rows, 1):
                context.append(f"\n{i}. {r['event_name']}\n   - Date: {r['start_date']}\n   - Venue: {r['venue']}")
        else:
            context.append("\nNo free events found at this time.")

    # ── Pricing / ticket info ─────────────────────────────────────────────────
    if "paid_events" in intents and "free_events" not in intents:
        cursor.execute("""
            SELECT e.event_name, b.charge_type, b.pass_type, b.entry_type, b.currency
            FROM event_booking_details b
            JOIN event_details_table e ON b.event_id = e.id
            WHERE e.status = 'APPROVED'
        """)
        rows = cursor.fetchall()
        if rows:
            context.append("\n🎫 Ticket & pricing details:")
            for i, r in enumerate(rows, 1):
                charge = r['charge_type'] or 'Unknown'
                curr = f"  ({r['currency']})" if r.get('currency') else ""
                context.append(
                    f"\n{i}. {r['event_name']}\n"
                    f"   - Charge: {charge}{curr}\n"
                    f"   - Pass: {r['pass_type']}  |  Entry: {r['entry_type']}"
                )

    # ── Capacity ──────────────────────────────────────────────────────────────
    if "capacity" in intents:
        cursor.execute("""
            SELECT e.event_name, b.capacity
            FROM event_booking_details b
            JOIN event_details_table e ON b.event_id = e.id
            WHERE e.status = 'APPROVED' AND b.booking_start_date >= CURDATE()
            ORDER BY b.capacity DESC
        """)
        rows = cursor.fetchall()
        if rows:
            context.append("\n👥 Capacity details for upcoming events:")
            for i, r in enumerate(rows, 1):
                cap = f"{int(r['capacity']):,}" if r['capacity'] else "N/A"
                context.append(f"\n{i}. {r['event_name']}\n   - Capacity: {cap} people")

    # ── Venue / Location ──────────────────────────────────────────────────────
    if "venue" in intents:
        cursor.execute(
            "SELECT event_name, venue, address FROM event_details_table WHERE status = 'APPROVED'"
        )
        rows = cursor.fetchall()
        if rows:
            context.append("\n📍 Venue details:")
            for i, r in enumerate(rows, 1):
                context.append(f"\n{i}. {r['event_name']}\n   - Venue: {r['venue']}\n   - Address: {r['address']}")

    # ── Timing / Schedule ─────────────────────────────────────────────────────
    if "timing" in intents:
        cursor.execute(
            "SELECT event_name, start_date, start_time, end_time "
            "FROM event_details_table WHERE status = 'APPROVED' ORDER BY start_date ASC"
        )
        rows = cursor.fetchall()
        if rows:
            context.append("\n⏰ Event schedules:")
            for i, r in enumerate(rows, 1):
                context.append(
                    f"\n{i}. {r['event_name']}\n"
                    f"   - Date: {r['start_date']}\n"
                    f"   - Time: {r['start_time']} – {r['end_time']}"
                )

    # ── Booking dates ─────────────────────────────────────────────────────────
    if "booking" in intents:
        cursor.execute("""
            SELECT e.event_name, b.booking_start_date, b.booking_end_date, b.max_pass
            FROM event_booking_details b
            JOIN event_details_table e ON b.event_id = e.id
            WHERE e.status = 'APPROVED'
        """)
        rows = cursor.fetchall()
        if rows:
            context.append("\n📆 Booking windows:")
            for i, r in enumerate(rows, 1):
                max_p = f"  |  Max passes: {r['max_pass']}" if r.get('max_pass') else ""
                context.append(
                    f"\n{i}. {r['event_name']}\n"
                    f"   - Opens: {r['booking_start_date']}\n"
                    f"   - Closes: {r['booking_end_date']}{max_p}"
                )

    # ── Pass types ────────────────────────────────────────────────────────────
    if "pass" in intents:
        cursor.execute("""
            SELECT e.event_name, b.pass_type, b.entry_type, b.max_pass
            FROM event_booking_details b
            JOIN event_details_table e ON b.event_id = e.id
            WHERE e.status = 'APPROVED'
        """)
        rows = cursor.fetchall()
        if rows:
            context.append("\n🎟 Pass details:")
            for i, r in enumerate(rows, 1):
                max_p = f"  |  Max: {r['max_pass']}" if r.get('max_pass') else ""
                context.append(
                    f"\n{i}. {r['event_name']}\n"
                    f"   - Pass: {r['pass_type']}{max_p}\n"
                    f"   - Entry: {r['entry_type']}"
                )

    # ── Amenities ─────────────────────────────────────────────────────────────
    if "amenities" in intents:
        cursor.execute(
            "SELECT event_name, amenities FROM event_details_table WHERE status = 'APPROVED'"
        )
        rows = cursor.fetchall()
        if rows:
            context.append("\n✨ Event amenities:")
            for i, r in enumerate(rows, 1):
                context.append(f"\n{i}. {r['event_name']}\n   - {r['amenities']}")

    # ── Category ──────────────────────────────────────────────────────────────
    if "category" in intents:
        cursor.execute(
            "SELECT event_name, category FROM event_details_table WHERE status = 'APPROVED' ORDER BY category"
        )
        rows = cursor.fetchall()
        if rows:
            cats = list(dict.fromkeys(r['category'] for r in rows))
            context.append(f"\n🏷 Event categories ({', '.join(cats)}):")
            for i, r in enumerate(rows, 1):
                context.append(f"\n{i}. {r['event_name']}\n   - Category: {r['category']}")

    # ── Specific category lookups ─────────────────────────────────────────────
    for cat_intent in ["music", "education", "technology", "business"]:
        if cat_intent in intents:
            cat_name = {
                "music": "Music", "education": "Education",
                "technology": "Technology", "business": "Business",
            }[cat_intent]
            cursor.execute(
                "SELECT event_name, start_date, start_time, venue, amenities "
                "FROM event_details_table WHERE status = 'APPROVED' AND category = %s",
                (cat_name,)
            )
            rows = cursor.fetchall()
            if rows:
                context.append(f"\n🔎 {cat_name} events:")
                for i, r in enumerate(rows, 1):
                    context.append(
                        f"\n{i}. {r['event_name']}\n"
                        f"   - Date: {r['start_date']}  |  Time: {r['start_time']}\n"
                        f"   - Venue: {r['venue']}\n"
                        f"   - Amenities: {r['amenities']}"
                    )

    # ── Visibility ────────────────────────────────────────────────────────────
    if "visibility" in intents:
        m = user_message.lower()
        if "public" in m:
            q = "SELECT event_name, visibility FROM event_details_table WHERE status='APPROVED' AND LOWER(visibility)='public'"
            label = "Public events"
        elif "private" in m:
            q = "SELECT event_name, visibility FROM event_details_table WHERE status='APPROVED' AND LOWER(visibility)='private'"
            label = "Private events"
        else:
            q = "SELECT event_name, visibility FROM event_details_table WHERE status='APPROVED'"
            label = "Event visibility"
        cursor.execute(q)
        rows = cursor.fetchall()
        if rows:
            context.append(f"\n👁 {label}:")
            for i, r in enumerate(rows, 1):
                context.append(f"\n{i}. {r['event_name']}\n   - Visibility: {r['visibility']}")

    # ── FAQ lookup ────────────────────────────────────────────────────────────
    if "faq" in intents or (not context):
        words = [w for w in re.findall(r'\b\w{4,}\b', user_message.lower()) if w not in
                 {"what","when","where","which","show","tell","give","list","find","about","have","that","this","with","from"}]
        if words:
            faq_clauses = " OR ".join(["question LIKE %s OR answer LIKE %s"] * len(words))
            params = []
            for w in words:
                params.extend([f"%{w}%", f"%{w}%"])
            cursor.execute(f"SELECT question, answer FROM faq WHERE {faq_clauses} LIMIT 5", tuple(params))
            faqs = cursor.fetchall()
            if faqs:
                context.append("\n💬 Related FAQs:")
                for f in faqs:
                    context.append(f"\n- Q: {f['question']}\n  A: {f['answer']}")

    if not context:
        return (
            "I couldn't find specific information for that query. "
            "Try asking about events, tickets, venues, timings, capacity, or amenities."
        )

    return "\n".join(context)


# ─── AI formatting via Gemini ──────────────────────────────────────────────────

SYSTEM_PROMPT = """You are EventBot, a friendly and professional assistant for an Event Management platform.

STRICT RULES:
1. Respond in a warm, helpful, conversational tone.
2. Format responses clearly using bullet points or numbered lists.
3. Never repeat data twice or show raw database text.
4. Highlight important values (dates, prices, venues) clearly.
5. If the data says "Free", emphasize that positively.
6. Keep responses concise — max 200 words.
7. End with a helpful follow-up suggestion if relevant.
8. If no data is available, say: "I don't have that information right now. Try asking about events, tickets, or venues."
9. Never fabricate data not present in the provided database context.
"""

def query_gemini(message: str, db_results: str) -> str:
    try:
        model = genai.GenerativeModel(
            "gemini-pro",
            # system_instruction=SYSTEM_PROMPT, # Note: older versions of genai might not support system_instruction in constructor
        )
        # Using simple concatenated prompt if system_instruction is not supported in this way
        prompt = f"{SYSTEM_PROMPT}\n\nDatabase context:\n{db_results}\n\nUser question: {message}\n\nProvide a clean, friendly, structured answer based only on the data above."
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Gemini error: {e}")
        return db_results  # Graceful fallback


# ─── Chat endpoint ─────────────────────────────────────────────────────────────

@chatbot_bp.route('/chat', methods=['POST', 'OPTIONS'])
@cross_origin()
def chat():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"error": "Message is required"}), 400

    user_message = data['message'].strip()
    if not user_message:
        return jsonify({"error": "Message cannot be empty"}), 400

    user_id = data.get('user_id', None)

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    try:
        print(f"-> Chat API received: {user_message} (User: {user_id})")
        db_results = fetch_db_context(user_message, cursor)

        if GEMINI_API_KEY and GEMINI_API_KEY != "your_key_here":
            bot_response = query_gemini(user_message, db_results)
        else:
            bot_response = db_results

        print("-> Saving to chat_history table...")
        cursor.execute(
            "INSERT INTO chat_history (user_id, message, response) VALUES (%s, %s, %s)",
            (str(user_id) if user_id else "Guest", user_message, bot_response)
        )
        db.commit()
        print("-> Success: Chat record saved.")

    except Exception as e:
        print("!!! Chatbot error:", str(e))
        return jsonify({"error": "Something went wrong. Please try again."}), 500
    finally:
        cursor.close()
        db.close()

    return jsonify({
        "reply": bot_response,
        "intents": detect_intent(user_message),  # optional: for debugging
    }), 200