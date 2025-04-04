import React, { useState, useEffect, useRef } from "react";
import { apiRequest } from "../utils/apiRequest";
import "../styles/Transcription.css";

export default function Transcription({ transcribedText, setResponse, setPayload, setResponseTime }) {
  const [editedText, setEditedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const submitTimeoutRef = useRef(null);

  useEffect(() => {    
    if (transcribedText) {
      setEditedText(transcribedText);
    }
  }, [transcribedText]);

  const handleTextChange = (text) => {
    setEditedText(text);

    // Clear any previous timeout
    if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);

    // Set a new timeout to submit the form after 2 seconds
    submitTimeoutRef.current = setTimeout(() => {
      handleSubmit();
    }, 1000);
  };

  const handleSubmit = async () => {
    if (!editedText.trim()) {
      alert("Cannot submit an empty response.");
      return;
    }

    const payload = {
      institute_id: "ABESIT",
      user_name: "string",
      authenticated_module: ["admission", "library", "employee", "fee"],
      query: editedText,
    };

    setLoading(true);
    setError(null);
    // setPayload(payload); // Pass payload to Home.jsx

    try {
      console.log("Submitting:", payload);
      const startTime = Date.now();
      const data = await apiRequest("process_query", "POST", payload);
      const endTime = Date.now();

      console.log("Response from server:", data);
      setResponse(data);
      setResponseTime(`${(endTime - startTime) / 1000}s`); // Calculate response time

    } catch (error) {
      console.error("Submission failed:", error);
      setError("Failed to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transcription-container">
      <input
        className="transcription-input"
        value={editedText}
        onChange={(e) => handleTextChange(e.target.value)}
      />
      <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>

      {loading && <p className="loading-text">Processing your request...</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
