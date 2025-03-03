##Going to be the place where Resume is analyzed...
from flask import Flask, request, jsonify
from flask_cors import CORS
from pypdf import PdfReader
from dotenv import load_dotenv, find_dotenv
from openai import OpenAI
import re
import os
import json
import time

# Automatically find and load the .env file from the project root
load_dotenv(find_dotenv())


# Retrieve and configure the openai API key securely
ai_api_key = os.getenv("OPENAI_API_KEY")
endpoint = "https://models.inference.ai.azure.com"
model_name = "gpt-4o"

if not ai_api_key:
    raise ValueError("No OPENAI_API_KEY found in environment variables.")

client = OpenAI(
    base_url = endpoint,
    api_key = ai_api_key,
)

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

    return full_resume_text

import json

def analyze_text(resume, retries=3, delay=2):
    prompt = (
        "Analyze the following resume and return a structured JSON object with three fields: "
        "`key_insights`, `improvements`, and `salary_estimate`.\n\n"
        "Format:\n"
        "{\n"
        '  "key_insights": ["<bullet point 1>", "<bullet point 2>", "..."],\n'
        '  "improvements": ["<bullet point 1>", "<bullet point 2>", "..."],\n'
        '  "salary_estimate": "<numeric value>"\n'
        "}\n\n"
        f"Resume:\n{resume}\n\n"
        "Return only the JSON object, without any explanation or formatting."
    )

    for attempt in range(1, retries + 1):
        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                temperature=1.0,
                top_p=1.0,
                max_tokens=800,
                messages=[{"role": "user", "content": prompt}],
            )

            result = response.choices[0].message.content.strip()

            if not result:  
                raise ValueError("OpenAI returned an empty response")

            structured_response = json.loads(result)  # Parse JSON response
            return structured_response  # Return valid response if successful

        except json.JSONDecodeError as e:
            print(f"JSON Error on attempt {attempt}: {e}")
        except Exception as e:
            print(f"Error on attempt {attempt}: {e}")

        # If we reach here, retry after a short delay
        if attempt < retries:
            print(f"Retrying in {delay} seconds...")
            time.sleep(delay)
    
    return {"error": "OpenAI failed after multiple attempts."}
    
@app.route('/upload', methods = ["POST"])
def upload_file():
    if "resume" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    # Save the uploaded file temporarily
    file_path = os.path.join("uploads", file.filename)
    os.makedirs("uploads", exist_ok=True)
    file.save(file_path)

    # Extract text from the file
    resume_text = extract_file(file_path)

    # Analyze the resume text with OpenAI
    structured_response = analyze_text(resume_text, retries=3, delay=2)

    # Clean up the temporary file
    os.remove(file_path)
    
    return jsonify({
        "message": "File uploaded and analyzed successfully.",
        "filename": file.filename,
        "analysis": structured_response
    })

if __name__ == "__main__":
    app.run(debug=True, port = 5000)
