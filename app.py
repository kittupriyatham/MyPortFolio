from flask import Flask, render_template, send_file, url_for, request, jsonify
import os
import json
import requests as http_requests

app = Flask(__name__)

# ── Load JSONL profile once at startup ──────────────────────────────────────
_PROFILE_PATH = os.path.join(os.path.dirname(__file__), "static", "master_profile.jsonl")

def _build_knowledge_base():
    """Extract all Q&A pairs from the JSONL fine-tuning dataset."""
    kb = []
    try:
        with open(_PROFILE_PATH, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    obj = json.loads(line)
                    msgs = obj.get("messages", [])
                    q = next((m["content"] for m in msgs if m["role"] == "user"), None)
                    a = next((m["content"] for m in msgs if m["role"] == "assistant"), None)
                    if q and a:
                        kb.append(f"Q: {q}\nA: {a}")
                except json.JSONDecodeError:
                    pass
    except FileNotFoundError:
        pass
    return "\n\n".join(kb)

_KNOWLEDGE_BASE = _build_knowledge_base()

# ── Chat API ─────────────────────────────────────────────────────────────────
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    user_message = (data.get("message") or "").strip()
    if not user_message:
        return jsonify({"error": "empty message"}), 400

    gemini_key = os.environ.get("GEMINI_API_KEY", "")
    if not gemini_key:
        return jsonify({"reply": "Chat is not configured yet — API key missing."}), 200

    system_prompt = (
        "You are an AI assistant representing Potluri Krishna Priyatham. "
        "Answer questions about him using ONLY the knowledge base below. "
        "If the answer is not in the knowledge base, say 'I don't have that information.' "
        "Be concise and speak in first person as Potluri Krishna Priyatham.\n\n"
        "KNOWLEDGE BASE:\n"
        f"{_KNOWLEDGE_BASE}"
    )

    payload = {
        "contents": [
            {"role": "user", "parts": [{"text": f"{system_prompt}\n\nUser question: {user_message}"}]}
        ]
    }

    try:
        resp = http_requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}",
            json=payload,
            timeout=15
        )
        resp.raise_for_status()
        reply = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:
        reply = "Sorry, I couldn't process that right now."

    return jsonify({"reply": reply})


@app.route('/')
@app.route('/home')
def home():
    return render_template("index.html")


@app.route('/about')
def about():
    return render_template("about.html")


@app.route('/skills')
def skills():
    return render_template("skills.html")


@app.route('/resume')
def resume():
    return render_template(
        'resume.html',
        download_f=True,
        download_url='resume',
        # resume=resume_fetcher.get_resume_url()
        resume = "../static/pdfs/Potluri_Krishna_Priyatham_Resume.pdf"
    )

@app.route('/video-resume')
def video_resume():
    return render_template('video-resume.html')


@app.route('/achievements')
def achievements():
    return render_template('achievements.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/projects')
def projects():
    return render_template('projects.html')


@app.route('/projects/creo/download')
def download_creo_stl():
    stl_path = r"C:\Users\kittu\projects\MyPortFolio\static\stl files\revolverassembly.stl"
    if not os.path.isfile(stl_path):
        return f"STL file not found at: {stl_path}", 404
    response = send_file(
        stl_path,
        mimetype="application/octet-stream",
        as_attachment=True,
        download_name="revolverassembly.stl"
    )
    response.headers["Content-Type"] = "application/octet-stream"
    response.headers["Content-Disposition"] = "attachment; filename=\"revolverassembly.stl\""
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


@app.route('/projects/creo')
def creo():
    title = "3D Model of Revolver MG 31 DS"
    description = "An interactive 3D view of the Revolver MG 31 DS model."
    model_url = "https://cloud.glovius.com/embed/embedviewgl/1a2ff387-966d-4116-8a35-d249732ae529?canvasHeight=500&canvasWidth=1000"
    download_url = "/static/stl%20files/revolverassembly.stl"
    return render_template('creo.html', title=title, description=description, model_url=model_url, download_url=download_url)


@app.route('/projects/array')
def array():
    return render_template('arraymanipulation.html')


if __name__ == '__main__':
    host  = os.environ.get('HOST', '0.0.0.0')
    port = int(os.environ.get('PORT', 5000))
    app.run(host=host, port=port, debug=True)
