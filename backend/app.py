import json
import logging
import re

import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

from config import AI_API_KEY, GEMINI_API_URL

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


app = Flask(__name__)
CORS(app)


def extract_questions(response_text):
    """Convert a model response into a clean list of questions."""
    if not response_text:
        return []

    response_text = response_text.strip()
    if response_text.startswith("```json"):
        response_text = response_text[7:]
    elif response_text.startswith("```"):
        response_text = response_text[3:]
    if response_text.endswith("```"):
        response_text = response_text[:-3]
    response_text = response_text.strip()

    parsed_questions = []

    try:
        decoded = json.loads(response_text)
        if isinstance(decoded, list):
            parsed_questions = [str(item).strip()
                                for item in decoded if str(item).strip()]
    except json.JSONDecodeError:
        pass

    if parsed_questions:
        return parsed_questions[:3]

    questions = []
    for line in response_text.splitlines():
        cleaned_line = re.sub(r"^\s*(?:\d+[\.)]|[-*•])\s*", "", line).strip()
        if cleaned_line.endswith("?"):
            questions.append(cleaned_line)

    if questions:
        return questions[:3]

    fallback_questions = re.findall(r"[^?\n]+\?", response_text)
    return [question.strip() for question in fallback_questions[:3]]


@app.route("/generate-questions", methods=["POST"])
def generate_questions():
    data = request.get_json(silent=True) or {}
    job_title = str(data.get("jobTitle", "")).strip()

    if not job_title:
        return jsonify({"error": "'jobTitle' is required."}), 400

    if not AI_API_KEY:
        return jsonify({"error": "AI_API_KEY is not configured."}), 500

    prompt = f"You are an expert interviewer. Generate exactly 3 interview questions for the job role: {job_title}. Return the response strictly as a JSON array of strings containing exactly 3 questions. Do not include markdown formatting or any other text."
    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}],
            }
        ]
    }

    try:
        response = requests.post(
            f"{GEMINI_API_URL}?key={AI_API_KEY}",
            json=payload,
            timeout=30,
        )
        logger.debug(f"Response status: {response.status_code}")
        logger.debug(f"Response body: {response.text}")
        response.raise_for_status()
        response_data = response.json()
        candidates = response_data.get("candidates", [])
        first_candidate = candidates[0] if candidates else {}
        content = first_candidate.get("content", {})
        parts = content.get("parts", [])
        response_text = "\n".join(
            part.get("text", "") for part in parts if isinstance(part, dict)
        ).strip()
        questions = extract_questions(response_text)

        if not questions:
            return jsonify({"error": "The AI response could not be parsed."}), 502

        return jsonify({"questions": questions[:3]})
    except requests.RequestException as e:
        logger.error(f"API request failed: {e}", exc_info=True)
        return jsonify({"error": "Failed to call the AI API."}), 502
    except (ValueError, KeyError, IndexError) as e:
        logger.error(f"Response parsing failed: {e}", exc_info=True)
        return jsonify({"error": "Unexpected AI API response format."}), 502


@app.get("/")
def health_check():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True)
