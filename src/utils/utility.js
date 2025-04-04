export const detectSilence = (threshold, timeout, onSilence) => {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);

    source.connect(analyser);
    analyser.fftSize = 512;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let silenceStart = Date.now();

    const checkSilence = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b) / bufferLength;

      if (avg < threshold) {
        if (Date.now() - silenceStart > timeout) {
          onSilence();
          stream.getTracks().forEach((track) => track.stop());
        }
      } else {
        silenceStart = Date.now();
      }

      requestAnimationFrame(checkSilence);
    };

    checkSilence();
  });
};
