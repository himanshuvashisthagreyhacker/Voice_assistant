import React, { useState, useRef } from "react";
import { detectSilence } from "../utils/utility"; // Import silence detection function
import { apiRequest } from "../utils/apiRequest";


export default function Recorder({ setTranscribedText, setAudioBase64}) {
  const [isRecording, setIsRecording] = useState(false);
  const [tempTranscribedText, setTempTranscribedText] = useState("")
  const recognitionRef = useRef(null);

  const startRecording = async () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    setIsRecording(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    try {
      await navigator.mediaDevices.getUserMedia({
        audio: { noiseSuppression: true, echoCancellation: true }
      });
      console.log("Microphone access granted with noise filtering.");
    } catch (error) {
      console.error("Microphone access denied:", error);
      alert("Please allow microphone access.");
      setIsRecording(false);
      return;
    }

    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setTempTranscribedText(transcript);
      processQuery(transcript); // Call the query processing function
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "network" || event.error === "not-allowed") {
        stopRecording();
      }
    };

    recognitionRef.current.onend = () => {
      console.log("Recognition stopped.");
      setIsRecording(false);
    };

    recognitionRef.current.start();
    detectSilence(0.01, 2000, () => {
      console.log("Silence detected! Stopping recording...");
      stopRecording();
    });
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setTranscribedText(tempTranscribedText)
      setIsRecording(false);
    }
  };
  // **Process Query Function using apiRequest**
  const processQuery = async (text) => {
    if (!text || text.trim() === "") {
      console.error("Error: Query text is empty.");
      return;
    }

    const payload = {
      institute_id: "ABESIT",
      user_name: "string",
      authenticated_module: ["admission", "library", "employee", "fee"],
      query: text
    };

    const data = await apiRequest("process_query", "POST", payload);

    if (data?.raw_response) {
      setTranscribedText(data.raw_response);
      setAudioBase64(data.summarized_response)
    }
  };

  return (
    <button onClick={isRecording ? stopRecording : startRecording} className="px-4 py-2 bg-blue-500 text-white rounded-lg my-2">
      {isRecording ? "Stop Recording" : "Start Recording"}
    </button>
  );
}
