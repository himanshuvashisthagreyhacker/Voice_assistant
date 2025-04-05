import React, { useEffect, useState } from "react";
import ClarificationComponent from "./ClarificationComponent";

export default function Response({ response, autoSubmit, setPreviousQuery, setResponse, transcribedText }) {
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);


  useEffect(() => {
    if (response?.summarized_response) {
      if (audio) {
        audio.pause();
        audio.currentTime = 0; // Reset playback position
      }
      const newAudio = new Audio(`data:audio/mp3;base64,${response.summarized_response}`);
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
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


  return (
    <div className="response-container">
      {audio && (
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
