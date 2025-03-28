import React, { useState, useRef } from "react";
import { detectSilence } from "../utils/utility";
import { apiRequest } from "../utils/apiRequest";

export default function Recorder({ setAudioURL, setTranscribedText }) {
  const [isRecording, setIsRecording] = useState(false);
  const [rawResponse, setRawResponse] = useState("");
  const [showEditor, setShowEditor] = useState(false);
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
      setRawResponse(transcript); // Set transcribed text directly into rawResponse
      setShowEditor(true); // Show the editor for editing the transcribed text
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
      setIsRecording(false);
    }
  };

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
      setRawResponse(data.raw_response);
      setShowEditor(true);
    }
  };

  const submitEditedResponse = async () => {
    const payload = { updated_response: rawResponse };
    await apiRequest("submit_response", "POST", payload);
    alert("Response submitted successfully!");
  };

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording} className="px-4 py-2 bg-blue-500 text-white rounded-lg my-2">
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {showEditor && (
        <div>
          <textarea
            value={rawResponse}
            onChange={(e) => setRawResponse(e.target.value)}
            className="w-full p-2 border rounded-md"
            style={{ outline: "none", minHeight: "100px" }}
          />
          <button onClick={submitEditedResponse} className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg">
            Submit Edited Response
          </button>
        </div>
      )}
    </div>
  );
}
