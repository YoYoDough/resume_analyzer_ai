##Going to be the place where Resume is analyzed...
from flask import Flask, request, jsonify
from flask_cors import CORS
from pypdf import PdfReader
import os, openai

load_dotenv()

# Retrieve and configure the openai API key securely
openai.api_key = os.getenv("OPENAI_API_KEY")

if not openai_api_key:
    raise ValueError("No OPENAI_API_KEY found in environment variables.")


app = Flask(__name__)
CORS(app)

def extract_file(file_path):
    # we need to use libraries that help extract text from pdf, doc, and docx files
    reader = PdfReader(file_path)
    full_resume_text = ""

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            full_resume_text += page_text + "\n"
    return full_text

def analyze_text(resume):
    # prompt to analyze resume goes here, we're going to use openai.Complete
    
@app.route('/upload', methods = ["POST"])
def upload_file():
    file = request.files['file']

    resume_text = extract_file(file.name)

    analysis = analyze_text(resume_text)
    
    return jsonify({
        "message": "File uploaded and analyzed successfully",
        "filename": file.filename,
        "analysis": analysis,
    })

if __name__ == "__main__":
    app.run(debug=True)
