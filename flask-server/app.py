from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image
import os
import uuid
from datetime import datetime
import json
import base64
import cv2
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from textwrap import wrap
import torch

# ML modules
from image_captioner import ImageCaptioner
from description_generator import DescriptionGenerator

# ===============================================
# 🔧 Flask Setup
# ===============================================
app = Flask(__name__)
CORS(app)   # <--- IMPORTANT for React

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit
UPLOAD_DIR = "uploads"
HISTORY_FILE = "data/detection_history.json"

os.makedirs("uploads", exist_ok=True)
os.makedirs("data", exist_ok=True)

# Create history file if missing
if not os.path.exists(HISTORY_FILE):
    with open(HISTORY_FILE, "w") as f:
        json.dump([], f)

ALLOWED_EXT = {"png", "jpg", "jpeg", "gif"}

def allowed_file(name):
    return "." in name and name.rsplit(".", 1)[1].lower() in ALLOWED_EXT


# ===============================================
# 🚀 Load AI Models Once
# ===============================================
print("Loading AI models...")
torch.set_num_threads(1)
captioner = ImageCaptioner()
desc_generator = DescriptionGenerator()
print("Models loaded successfully.")

# ===============================================
# 📌 Helper Functions
# ===============================================
def load_history():
    try:
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_history(history):
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f)

def add_to_history(entry):
    history = load_history()
    history.append(entry)
    save_history(history)

# ===============================================
# 🟢 Health Check Route
# ===============================================
@app.route("/ping")
def ping():
    return jsonify({"status": "Flask Running"})


# ===============================================
# 📥 Upload Route
# ===============================================
@app.route("/upload", methods=["POST"])
def upload_file():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        damage_type = request.form.get("damage_type", "Unknown Damage")
        custom_damage = request.form.get("custom_damage", "")

        if file.filename == "":
            return jsonify({"error": "Empty file selection"}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "Unsupported file format"}), 400

        # Save temporary file
        file_id = str(uuid.uuid4())
        filename = secure_filename(file.filename)
        temp_path = os.path.join(UPLOAD_DIR, f"{file_id}_{filename}")
        file.save(temp_path)

        # Validate image
        try:
            with Image.open(temp_path) as img:
                img.verify()
        except:
            os.remove(temp_path)
            return jsonify({"error": "Invalid or corrupted image"}), 400

        # ML processing
        final_damage = custom_damage if custom_damage else damage_type
        caption = captioner.generate_caption(temp_path)
        description = desc_generator.enhance_description(caption, final_damage)

        # Encode image → base64
        img_cv = cv2.imread(temp_path)
        _, buffer = cv2.imencode(".jpg", img_cv)
        image_b64 = base64.b64encode(buffer).decode("utf-8")

        # Prepare response
        result = {
            "success": True,
            "filename": filename,
            "damage_type": final_damage,
            "image_caption": caption,
            "loss_description": description,
            "image_data": image_b64,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        # Save in history
        add_to_history(result)

        # Delete temp file
        os.remove(temp_path)

        return jsonify(result)

    except Exception as e:
        print("❌ Upload error:", e)
        return jsonify({"error": f"Server error: {str(e)}"}), 500


# ===============================================
# 📄 PDF Generation Route
# ===============================================
@app.route("/download-pdf", methods=["POST"])
def generate_pdf():
    try:
        data = request.get_json()
        description = data.get("description", "")
        damage_type = data.get("damage_type", "")
        image_data = data.get("image_data", "")

        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4

        # Header
        pdf.setFillColorRGB(0, 0.5, 0.8)
        pdf.rect(0, height - 100, width, 100, fill=1)
        pdf.setFillColorRGB(1, 1, 1)
        pdf.setFont("Helvetica-Bold", 20)
        pdf.drawString(50, height - 60, "Insurance Loss Description Report")

        y = height - 140
        pdf.setFillColorRGB(0, 0, 0)
        pdf.setFont("Helvetica", 12)
        pdf.drawString(50, y, f"Damage Type: {damage_type}")
        y -= 20
        pdf.drawString(50, y, f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

        # Description text
        y -= 40
        pdf.setFont("Helvetica-Bold", 14)
        pdf.drawString(50, y, "Detailed Loss Description")
        y -= 25

        wrapped = wrap(description, width=90)
        pdf.setFont("Helvetica", 11)

        for line in wrapped:
            if y < 100:
                pdf.showPage()
                y = height - 50
            pdf.drawString(50, y, line)
            y -= 15

        # Add image
        if image_data:
            y -= 40
            img_bytes = base64.b64decode(image_data)
            img = Image.open(BytesIO(img_bytes))

            max_w, max_h = 300, 200
            iw, ih = img.size
            aspect = iw / ih

            if aspect > max_w / max_h:
                iw = max_w
                ih = iw / aspect
            else:
                ih = max_h
                iw = ih * aspect

            pdf.drawImage(ImageReader(img), 50, y - ih, width=iw, height=ih)

        pdf.save()
        buffer.seek(0)

        response = make_response(buffer.getvalue())
        response.mimetype = "application/pdf"
        response.headers["Content-Disposition"] = "attachment; filename=loss_report.pdf"

        return response

    except Exception as e:
        print("❌ PDF error:", e)
        return jsonify({"error": "PDF generation failed"}), 500


# ===============================================
# 🚀 Run Flask
# ===============================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
