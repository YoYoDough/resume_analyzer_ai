"use client"
import { useState } from "react";

const page = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  console.log(file)

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url)
    } else {
      alert("Please upload a resume file.");
    }
  };

  // Handle file submission (placeholder function)
  const handleUpload = async () => {
    if (!file) {
      alert("No file selected!");
      return;
    }
    console.log("Uploading:", file.name);
    
    // Here you'd send the file to your backend/AI model
    const formData = new FormData();
    formData.append("resume", file)

    setUploading(true);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Couldn't send resume file...", error)
    } finally {
      setUploading(true)
    }
  };

  //there will also be a value attached to the resume like $120,000/year for a specific field

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Upload Your Resume</h1>
      <p className="text-gray-400 mb-6">AI will analyze your resume and provide insights.</p>

      {!previewUrl && <label className="w-96 h-48 flex items-center justify-center border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition">
        <input type="file" className="hidden" accept=".pdf, .doc, .docx" onChange={handleFileChange} />
        <span className="text-gray-300">Click or Drag & Drop to Upload Resume</span>
      </label>}

      {previewUrl && (
        <div className = "mt-5 w-full flex flex-col items-center">
          <div className = "w-full mt-4 md:w-3/4 lg:w-2/3 xl:w-1/2">
            <h3 className = "text-lg font-bold mb-2">PDF Preview:</h3>
            <iframe
              src={previewUrl}
              className = "w-full h-[60vh] md:h-[70vh] border border-gray-300 rounded-lg"
              title="PDF Preview"
              style={{ overflow: "hidden" }}
            ></iframe>
          </div>
        </div>
      )}

      <button
        onClick={handleUpload}
        className="mt-6 bg-custom-gradient px-6 py-2 rounded-lg text-white font-regular"
      >
        Submit for Analysis
      </button>

      

      {uploading && <p className = "text-grey-200">Analyzing resume...</p>}
      {analysis && <p className = "text-green-400">Feedback: {analysis}</p>}
    </div>
  );
};

export default page;