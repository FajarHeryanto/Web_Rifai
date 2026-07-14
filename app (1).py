import json
import os
import re
from datetime import datetime, timezone

from flask import Flask, render_template, request, jsonify

from data import PROFILE, STATS, PROJECTS, SKILLS, EXPERIENCE

app = Flask(__name__)

MESSAGES_FILE = os.path.join(os.path.dirname(__file__), "data", "messages.json")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _load_messages():
    if not os.path.exists(MESSAGES_FILE):
        return []
    try:
        with open(MESSAGES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return []


def _save_message(entry):
    messages = _load_messages()
    messages.append(entry)
    os.makedirs(os.path.dirname(MESSAGES_FILE), exist_ok=True)
    with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
        json.dump(messages, f, ensure_ascii=False, indent=2)


@app.route("/")
def index():
    return render_template(
        "index.html",
        profile=PROFILE,
        stats=STATS,
        projects=PROJECTS,
        skills=SKILLS,
        experience=EXPERIENCE,
        year=datetime.now().year,
    )


@app.route("/contact", methods=["POST"])
def contact():
    payload = request.get_json(silent=True) or request.form

    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip()
    message = (payload.get("message") or "").strip()

    errors = {}
    if not name or len(name) < 2:
        errors["name"] = "Enter a name with at least 2 characters."
    if not email or not EMAIL_RE.match(email):
        errors["email"] = "Enter a valid email address."
    if not message or len(message) < 10:
        errors["message"] = "Message must be at least 10 characters."

    if errors:
        return jsonify({"ok": False, "errors": errors}), 400

    entry = {
        "name": name,
        "email": email,
        "message": message,
        "submitted_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }
    _save_message(entry)

    # Decorative deterministic-looking receipt id for the confirmation UI.
    # This is NOT a real blockchain transaction.
    tx_hash = "0x" + os.urandom(16).hex()

    return jsonify({"ok": True, "tx_hash": tx_hash})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
