import React, { useEffect, useState, useRef } from "react";
import ClarificationComponent from "./ClarificationComponent";

export default function Response({ response, autoSubmit, setPreviousQuery, setResponse, transcribedText }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (response?.summarized_response) {
      // Stop and cleanup previous audio if any
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Create new audio object
      const newAudio = new Audio(`data:audio/mp3;base64,${response.summarized_response}`);
      audioRef.current = newAudio;

      newAudio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Audio play error:", err);
        setIsPlaying(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [response]);

  const handleToggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Audio resume error:", err);
      });
    }
  };

  return (
    <div className="response-container">
      {audioRef.current && (
        <button onClick={handleToggleAudio} className="audio-btn">
          {isPlaying ? "⏸️ Pause Audio" : "▶️ Play Audio"}
        </button>
      )}
      <h2>📢 Response</h2>

      <div className="response-box">{response?.raw_response || "Waiting for response..."}</div>

      {response?.payload && (
        <div className="payload-box">
          <h3>Payload</h3>
          <pre>{JSON.stringify(response.payload, null, 2)}</pre>
        </div>
      )}

      {(response?.ambiguity || response?.fallback) && (
        <ClarificationComponent
          ambiguityText={response.ambiguity || response.fallback}
          responseType={response.ambiguity ? "ambiguity" : "fallback"}
          transcribedText={transcribedText}
          setPreviousQuery={() => setPreviousQuery(response.raw_response)}
          response={response}
          setResponse={setResponse}
          autoSubmit={autoSubmit}
        />
      )}
    </div>
  );
}
