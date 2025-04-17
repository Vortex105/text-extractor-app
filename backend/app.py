from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
import os
from dotenv import load_dotenv

load_dotenv()

eng_path = os.getenv("TRAINEDDATA_PATH")
os.environ["TESSDATA_PREFIX"] = eng_path
from werkzeug.utils import secure_filename
from docx import Document
from PIL import Image


import pytesseract

tesseract_path = os.getenv("TESSERACT_PATH")
pytesseract.pytesseract.tesseract_cmd = tesseract_path

app = Flask(__name__)
CORS(app)

# Folder to save uploaded PDFs
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(filepath)

    try:
        if filename.endswith(".pdf"):
            text = extract_text_from_pdf(filepath)
        elif filename.endswith(".docx"):
            text = extract_text_from_docx(filepath)
        elif filename.endswith((".png", ".jpg", ".jpeg")):
            text = extract_text_from_image(filepath)
        else:
            os.remove(filepath)
            return jsonify({"error": "Unsupported file type"}), 400

        os.remove(filepath)
        return jsonify({"text": text})
    except Exception as e:
        return jsonify({"error": f"Failed to extract text: {str(e)}"}), 500


def extract_text_from_pdf(path):
    doc = fitz.open(path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text


def extract_text_from_docx(path):
    doc = Document(path)
    return "\n".join([para.text for para in doc.paragraphs])


def extract_text_from_image(path):
    try:
        img = Image.open(path)
        img = img.convert("RGB")
        text = pytesseract.image_to_string(img)
        return text
    except Exception as e:
        print(f"OCR Error {e}")
        raise Exception(f"OCR failed: {e}")


if __name__ == "__main__":
    app.run(debug=True)
