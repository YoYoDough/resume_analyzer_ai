##Going to be the place where Resume is analyzed...
from flask import Flask, request, jsonify
from flask_cors import CORS
import os, openai

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods = ["POST"])
def upload_file():
    return jsonify({
        "message": "File uploaded and analyzed successfully",
        "filename": file.filename,
        "analysis": analysis,
    })
