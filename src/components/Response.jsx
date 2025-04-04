import React, { useEffect, useState } from "react";

export default function Response({ response }) {
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [finalResponse, setFinalResponse] = useState("");

  useEffect(() => {
    if (response && response.summarized_response) {
      const newAudio = new Audio(`data:audio/mp3;base64,${response.summarized_response}`);
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);
    }
  }, [response]);

  useEffect(() => {
    if (response && response.raw_response) {
      const rawText = response.raw_response.toLowerCase();
      setShowInput(rawText.includes("student") || rawText.includes("employee"));
      setFinalResponse(""); // reset previous response
    }
  }, [response]);

  const handleToggleAudio = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setFinalResponse(`You entered: ${inputValue}`);
      setInputValue("");
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f3f4f6, #e0e7ff)",
        border: "2px solid #6366f1",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        padding: "20px",
        width: "100%",
        maxWidth: "600px",
        margin: "30px auto",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#4f46e5" }}>
        📢 Response
      </h2>

      <div
        style={{
          background: "#ffffff",
          padding: "12px",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "500",
          color: "#333",
          margin: "10px 0",
          boxShadow: "inset 0px 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        {response?.raw_response || "Waiting for response..."}
      </div>

      {audio && (
        <button
          onClick={handleToggleAudio}
          style={{
            background: isPlaying
              ? "linear-gradient(90deg, #ef4444, #dc2626)"
              : "linear-gradient(90deg, #22c55e, #16a34a)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            marginBottom: "10px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          {isPlaying ? "⏸️ Pause Audio" : "▶️ Play Audio"}
        </button>
      )}

      {showInput && (
        <>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter details..."
            style={{
              marginTop: "12px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #4f46e5",
              width: "100%",
              fontSize: "16px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          />
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: "#3b82f6",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              marginTop: "10px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </>
      )}

      {finalResponse && (
        <div
          style={{
            marginTop: "20px",
            background: "#dcfce7",
            padding: "10px",
            borderRadius: "8px",
            color: "#166534",
            fontWeight: "500",
          }}
        >
          ✅ {finalResponse}
        </div>
      )}
    </div>
  );
}
