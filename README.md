# 🧠 Text Extractor App

A fast OCR-powered web app that extracts text from multiple file formats. Whether it’s a scanned image, a PDF, a Word doc, or even a plain text file — just upload and extract with ease.

---

## 🚀 Features

- 🖼️ OCR text extraction from **images** (JPG, PNG)
- 📄 Extract text from **PDF documents**
- 📜 Upload and read **.txt files**
- 📝 Extract content from **.docx files** (Microsoft Word)
- ⚡ Built with **Flask** backend + **TailwindCSS** frontend

---

## 🛠️ Local Setup Instructions

1. **Clone this repository**

   ```bash
   git clone https://github.com/Vortex105/text-extractor-app.git
   cd text-extractor-app
   ```

2. **Set up a virtual environment**

   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   ```

3. **Install required packages**

   ```bash
   pip install -r requirements.txt
   ```

4. **Install Tesseract-OCR**

   - Download it from: [Tesseract Windows Installer](https://github.com/tesseract-ocr/tesseract)
   - After installation, update the path in your backend script (`app.py` or similar):

     ```python
     pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
     ```

   - Also ensure the required `.traineddata` files (like `eng.traineddata`) are in the `tessdata` directory.

---

## 📂 File Support

| File Type               | Processing Method             |
| ----------------------- | ----------------------------- |
| `.png`, `.jpg`, `.jpeg` | OCR with Tesseract            |
| `.pdf`                  | Text extracted via PyMuPDF    |
| `.txt`                  | Direct read from file         |
| `.docx`                 | Processed using `python-docx` |

---

## ❗ Caution with Paths

System-specific paths (like the Tesseract executable or uploaded file paths) may break in different environments. Use an env file and relative paths where possible. For deployment, always test your app on the target OS and update the Tesseract path accordingly.

---

## 👨‍💻 Author

Built with ☕, 💻, ♥, and way too many bugs by [Seseshe](https://github.com/Vortex105)

---

## 📃 License

MIT License — use it however you want. Just don’t sell it to your grandma.
