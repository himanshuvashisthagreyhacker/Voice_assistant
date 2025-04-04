import React, { useState, useEffect } from "react";
import Recorder from "./Recorder";
import Transcription from "./Transcription";
import Response from "./Response"; 

export default function Home() {
  const [transcribedText, setTranscribedText] = useState("");
  const [response, setResponse] = useState(null);
  const [parsedResponse, setParsedResponse] = useState(null);
  const [responseTime, setResponseTime] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleTranscription = (text) => {
    setTranscribedText(text);
    setShowInput(true);
  };

  const handleSubmit = () => {
    setShowInput(false);
  };

  useEffect(() => {
    if (response) {
      try {
        let raw = response.raw_response;

        if (typeof raw === "string") {
          const parsedData = JSON.parse(raw);
          setParsedResponse(Array.isArray(parsedData) ? parsedData[0] : parsedData);
        } else {
          setParsedResponse(raw);
        }
      } catch (error) {
        console.error("Error parsing raw_response:", error);
      }
    }
  }, [response]);

  return (
    <div className="flex flex-col items-center p-4">
      <h1
  style={{
    color: "#ffffff",
    background: "linear-gradient(90deg, #007bff, #6610f2)",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "24px",
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    marginBottom: "20px",
  }}
>
  G6 Voice Assistant
</h1>


      {/* Recorder Component */}
      <Recorder onTranscription={handleTranscription} />

      {/* Transcription Box */}
      {showInput && (
        <Transcription
          transcribedText={transcribedText}
          setResponse={setResponse}
          setResponseTime={setResponseTime}
          onSubmit={handleSubmit}
        />
      )}

      {/* Response Component */}
      {response && <Response response={response} parsedResponse={parsedResponse} />}

      {/* Response Time */}
      <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "30vh", // Adjust this for vertical positioning
      }}
    >
      <div
        style={{
          marginTop: "16px",
          padding: "20px",
          border: "2px solid #60a5fa",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #e0f2fe, #dbeafe)",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
          width: "80%",
          maxWidth: "400px",
          textAlign: "center",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "#2563eb",
            marginBottom: "10px",
          }}
        >
          ⏰ Time
        </h2>

        <p
          style={{
            fontSize: "18px",
            color: "#1f2937",
            background: "#ffffff",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "inset 0px 1px 5px rgba(0, 0, 0, 0.05)",
          }}
        >
          {responseTime || "Not received yet"}
        </p>
      </div>
</div>
    </div>
  );
}

