import React from "react";

export default function Transcription({ transcribedText }) {
  return (
    transcribedText && (
      <div className="mt-4 bg-gray-200 p-3 rounded-md">
        <h3 className="font-bold">Raw Response:</h3>
        <p>{transcribedText}</p>
      </div>
    )
  );
}
