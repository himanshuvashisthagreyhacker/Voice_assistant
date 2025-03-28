import React, { useState } from "react";
import Recorder from "./Recorder";
import AudioPlayer from "./AudioPlayer";
import Transcription from "./Transcription";
import Base64Audio from "./Base64Audio";

export default function Home() {
  const [audioURL, setAudioURL] = useState(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [audioBase64, setAudioBase64] = useState(null);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold">G6 Voice Assistant</h1>
      <Recorder setAudioURL={setAudioURL} setTranscribedText={setTranscribedText} setAudioBase64={setAudioBase64} />
      <AudioPlayer audioURL={audioURL} audioBase64={audioBase64}/>
      <Transcription transcribedText={transcribedText} />
      {/* <Base64Audio  /> */}
    </div>
  );
}
