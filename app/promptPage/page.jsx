"use client"
import Image from "next/image";
import Link from "next/link";
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
      setProgress(80) //AI result is a almost set
      console.log(data)
      setAnalysis(data);
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

  const resetFile = () => {
    setFile(null)
    setAnalysis(null)
    setPreviewUrl(null)
    setProgress(0)
    setUploading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-6">
      <Link href = "/" title="Home Page"><Image src = '/robot.png' width = {100} height = {100} alt = "Resume Logo" className = "bg-white-400 mb-4 rounded-lg"></Image></Link>
      <h1 className="text-3xl font-bold mb-4">Upload Your Resume</h1>
      <p className="text-gray-400 mb-6">AI will analyze your resume and provide insights.</p>

      {!previewUrl && <label className="w-96 h-48 flex items-center justify-center border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition">
        <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
        <span className="text-gray-300">Click or Drag & Drop to Upload Resume in PDF Form</span>
      </label>}

      {uploading && (
        <div className="w-96 rounded-md mt-3">
          <h2>Analysing resume...</h2>
          <div
            className="bg-custom-gradient h-4 rounded-md"
            style={{ width: `${progress}%`, transition: "width 1s ease-in-out" }}
          ></div>
        </div>
      )}

      {previewUrl && !analysis && (
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

      

      {!analysis ? 
        <button
          onClick={handleUpload}
          className="mt-6 bg-blue-400 px-6 py-2 rounded-lg text-black font-regular"
          disabled = {uploading}
        >
          Submit for Analysis
        </button> :
        <button 
        onClick = {resetFile}
        className="mt-4 bg-blue-400 px-6 py-2 rounded-lg text-black font-regular"
        disabled = {uploading}>
          Re-Enter File for Analysis
        </button>
      }

      {analysis && (
        <div className = "mt-4 flex flex-col">
          <div className = "flex justify-center items-center"><h2 className = "text-yellow-400 font-bold text-6xl self-center mr-5"> Salary Estimate: ${analysis.analysis.salary_estimate}/year</h2><Image src = "/cash.png" width = {100} height = {100} alt = "Cash Image"/></div>
          <section className = "flex mt-6">
            <div className = "flex flex-col p-12 m-6 rounded border border-white-300">
              <h1 className = "text-white-400 font-bold text-4xl self-center">Key Insights</h1>
              <ul>
                {analysis.analysis.key_insights.map((item, i) => (
                  <li key = {i} className = "analysis text-white-400 mt-6 list-disc">{item}</li>
                ))}
              </ul>
            </div>
            <div className = "flex flex-col p-12 m-6 rounded border border-white-300">
              <h1 className = "text-white-400 font-bold text-4xl self-center">What to Improve</h1>
              <ul>
                {analysis.analysis.improvements.map((item, i) => (
                  <li key = {i} className = "analysis text-white-400 mt-6 list-disc">{item}</li>
                ))}
              </ul>
            </div>
          </section>
          
          
        </div>
        )}
    </div>
  );
};

export default page;