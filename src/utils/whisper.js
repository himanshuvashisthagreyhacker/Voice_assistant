import { pipeline } from "@xenova/transformers";

let transcriber;

async function loadTranscriber() {
  transcriber = await pipeline("automatic-speech-recognition", "Xenova/whisper-small.en");
}

loadTranscriber(); // Initialize on load

export async function transcribe(audioBlob) {
  try {
    if (!transcriber) {
      await loadTranscriber();
    }
    const audioBuffer = await audioBlob.arrayBuffer();
    const text = await transcriber(audioBuffer);
    return text.text;
  } catch (error) {
    console.error("Error in transcription:", error);
    return null;
  }
}
