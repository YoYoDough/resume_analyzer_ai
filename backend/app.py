##Going to be the place where Resume is analyzed...
from flask import Flask, request, jsonify
from flask_cors import CORS
from pypdf import PdfReader
from dotenv import load_dotenv, find_dotenv
import os, openai

# Automatically find and load the .env file from the project root
load_dotenv(find_dotenv())

# Retrieve and configure the openai API key securely
openai.api_key = os.getenv("OPENAI_API_KEY")

if not openai.api_key:
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

    return full_resume_text

def analyze_text(resume):
    # prompt to analyze resume goes here, we're going to use openai.Complete
    prompt = (
        "Analyze the following resume and provide key insights, skills, and suggestions for improvement.\n\n"
        "Also, based on the candidate's skills, experience, and qualifications, provide an estimated salary value in USD as a number on a separate line prefixed with 'Salary Estimate:'.\n\n"
        f"{resume}\n\n"
        "Provide your answer in the following format:\n"
        "Analysis: <your analysis here>\n"
        "Salary Estimate: <your salary estimate here>\n"
    )

    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
        )

        result = response.choices[0].message.content

        # Regex to safely extract Analysis and Salary Estimate
        analysis_match = re.search(r"Analysis:\s*(.*?)(?:\n|$)", result, re.DOTALL)
        salary_match = re.search(r"Salary Estimate:\s*\$?([\d,]+)", result)

        analysis_text = analysis_match.group(1).strip() if analysis_match else "No analysis provided."
        salary_estimate = salary_match.group(1).strip() if salary_match else "N/A"

        return analysis_text, salary_estimate

    except Exception as e:
        print(f"Error analyzing text: {e}")
        return "Error analyzing resume.", "N/A"
    
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
    analysis_text, salary_estimate = analyze_text(resume_text)

    # Clean up the temporary file
    os.remove(file_path)
    

    return jsonify({
        "message": "File uploaded and analyzed successfully.",
        "analysis": analysis_text,
        "filename": file.filename,
        "salary_estimate": salary_estimate
    })

if __name__ == "__main__":
    app.run(debug=True, port = 5000)
