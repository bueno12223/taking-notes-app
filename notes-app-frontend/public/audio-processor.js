class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.silenceThreshold = 0.01;
    this.silenceDuration = 16000 * 3;
    this.silenceCounter = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length > 0) {
      const channelData = input[0];

      const pcmData = new Int16Array(channelData.length);
      let isSilent = true;
      for (let i = 0; i < channelData.length; i++) {
        const s = Math.max(-1, Math.min(1, channelData[i]));
        pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        if (Math.abs(channelData[i]) > this.silenceThreshold) {
          isSilent = false;
        }
      }

      this.port.postMessage({
        type: 'audioData',
        pcm: pcmData.buffer
      }, [pcmData.buffer]);

      if (isSilent) {
        this.silenceCounter += channelData.length;
        if (this.silenceCounter >= this.silenceDuration) {
          this.port.postMessage({ type: 'silence' });
          this.silenceCounter = 0;
        }
      } else {
        this.silenceCounter = 0;
      }
    }
    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);
