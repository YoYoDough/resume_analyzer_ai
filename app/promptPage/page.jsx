"use client"
import { useState } from "react";

const page = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [progress, setProgress] = useState(0);
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
    setProgress(20)

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      })
      setProgress(50) //halfway waiting for AI response

      const data = await response.json();
      const structuredAnalysis = parseAnalysis(data.analysis);
      console.log("Parsed Analysis:", structuredAnalysis);  // Debugging line
      setProgress(80) //AI result is a almost set
      console.log(data)
      setAnalysis({
        ...data,
        structuredAnalysis,
      });
    } catch (error) {
      console.error("Couldn't send resume file...", error)
    } finally {
      setProgress(100) //AI result should be displayed at this point
      setTimeout(() => {
        setUploading(false);
        setProgress(0); // Reset after loading completes
      }, 1000);
    }
  };

  //there will also be a value attached to the resume like $120,000/year for a specific field
  console.log(analysis)

  const parseAnalysis = (text) => {
    if (!text) return { insights: [], strengths: [], improvements: [], suggestions: [], salary: "" };

    console.log("Parsing Text:", text); // Debugging

    const structuredData = {
      keyInsights: [],
      improvements: [],
    };

    const sections = text.split(/\n\n/); // Split by double line breaks

    sections.forEach((section) => {
      const lowerSection = section.toLowerCase();

      if (lowerSection.includes("key insights")) {
        structuredData.keyInsights = extractList(section);
      } else if (lowerSection.includes("areas for improvement") || lowerSection.includes("what to improve on")) {
        structuredData.improvements = extractList(section);
      }
    });
  
    return structuredData;
  };
  
  const extractList = (section) => {
    return section
      .split("\n")
      .filter((line) => line.match(/^\d+\./) || line.match(/^[-•]/)) // Matches both "1." and "-"
      .map((line) => line.replace(/^\d+\.\s*|^[-•]\s*/, "").trim());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Upload Your Resume</h1>
      <p className="text-gray-400 mb-6">AI will analyze your resume and provide insights.</p>

      {!previewUrl && <label className="w-96 h-48 flex items-center justify-center border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition">
        <input type="file" className="hidden" accept=".pdf, .doc, .docx" onChange={handleFileChange} />
        <span className="text-gray-300">Click or Drag & Drop to Upload Resume</span>
      </label>}

      {previewUrl && (
        <div className = "mt-3 w-full flex flex-col items-center">
          <div className = "w-full mt-4 md:w-3/4 lg:w-2/3 xl:w-1/2">
            <h3 className = "text-lg font-bold mb-2">PDF Preview:</h3>
            <iframe
              src={previewUrl}
              className = "w-full h-[40vh] md:h-[70vh] border border-gray-300 rounded-lg"
              title="PDF Preview"
              style={{ overflow: "hidden" }}
            ></iframe>
          </div>
        </div>
      )}

      {uploading && (
        <div className="w-96 bg-gray-300 rounded-md mt-3">
          <div
            className="bg-green-500 h-10 rounded-md"
            style={{ width: `${progress}%`, transition: "width 1s ease-in-out" }}
          ></div>
        </div>
      )}

      <button
        onClick={handleUpload}
        className="mt-6 bg-custom-gradient px-6 py-2 rounded-lg text-white font-regular"
        disabled = {uploading}
      >
        Submit for Analysis
      </button>

      

      {uploading && <p className = "text-grey-200">Analyzing resume...</p>}
      {analysis && (
        <div className = "mt-4 flex flex-col">
          <h2 className = "text-yellow-400 font-bold text-6xl self-center"> Salary Estimate: ${analysis.salary_estimate}/year</h2>
          <p className = "analysis text-white-400 mt-6">{analysis.key_insights}</p>
          <p className = "analysis text-white-400 mt-6">{analysis.improvements}</p>
        </div>
        )}
    </div>
  );
};

export default page;