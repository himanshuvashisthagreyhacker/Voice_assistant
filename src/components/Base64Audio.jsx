import React, { useEffect } from "react";

export default function Base64Audio({ audioBase64 }) {
  useEffect(() => {
    if (audioBase64) {
      downloadAudio(audioBase64);
    }
  }, [audioBase64]); // ✅ No need to include downloadAudio in dependencies

  return <></>;
}

// 🔹 Move downloadAudio outside the component
const downloadAudio = (audioBase64) => {
  const audioBlob = base64ToBlob(audioBase64, "audio/mp3");
  const audioUrl = URL.createObjectURL(audioBlob);
  
  const a = document.createElement("a");
  a.href = audioUrl;
  a.download = "response_audio.mp3";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// 🔹 Move base64ToBlob outside the component
const base64ToBlob = (base64, mimeType) => {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: mimeType });
};
