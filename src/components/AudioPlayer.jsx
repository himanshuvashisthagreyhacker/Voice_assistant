import React, { useEffect, useRef } from "react";

export default function AudioPlayer({ audioURL, audioBase64 }) {
  const audioRef = useRef(new Audio()); // Create an Audio instance

  useEffect(() => {
    if (audioBase64) {
      playBase64Audio(audioBase64);
    } else if (audioURL) {
      playAudioFromURL(audioURL);
    }
  }, [audioBase64, audioURL]);

  // **Play Base64 Audio**
  const playBase64Audio = (base64String) => {
    const audioBlob = new Blob(
      [Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0))],
      { type: "audio/mp3" }
    );
    const generatedURL = URL.createObjectURL(audioBlob);
    playAudioFromURL(generatedURL);
  };

  // **Play Audio from a URL**
  const playAudioFromURL = (url) => {
    if (audioRef.current) {
      audioRef.current.pause(); // Stop any currently playing audio
      audioRef.current.src = url; // Update audio source
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  // **Stop Audio Playback**
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset to start
    }
  };

  return (
    <div>
      {audioRef.current && !audioRef.current.paused && (
        <button onClick={stopAudio} className="px-4 py-2 bg-red-500 text-white rounded-lg">
          Stop Audio
        </button>
      )}
    </div>
  );
}
