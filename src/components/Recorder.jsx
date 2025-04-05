import React, { useState, useRef, useEffect, useCallback } from "react";
import "../styles/Recorder.css";

export default function Recorder({ onTranscription, onReset }) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const startRecording = useCallback(async () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    setIsRecording(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      stopRecording();
      if (onTranscription && typeof onTranscription === "function") {
        onTranscription(transcript);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognitionRef.current.start();
    } catch (error) {
      console.error("Microphone access denied:", error);
      alert("Please allow microphone access.");
      setIsRecording(false);
    }
  }, [onTranscription]);

  
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } 
  };
  useEffect(() => {
    if (isRecording) {
      startRecording();
    }
  }, [isRecording, startRecording]);

    return (    
      <div className="recorder-container">
        <button
          className={`record-btn ${isRecording ? "recording" : ""}`}
          onClick={() => {
            if (onReset) onReset();
            setIsRecording(true)}}
          disabled={isRecording}
        >
          {isRecording ? "Recording..." : "Start Recording"}
        </button>
      </div>
    )};