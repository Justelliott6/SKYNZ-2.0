import React, { useEffect, useRef, useState } from 'react';

const MODES = ['Neon rings', 'Equalizer', 'Pulse'];
const COLORS = {
  Violet: ['#ac53ff', '#fe57d3'],
  Cyan: ['#2ee8e1', '#41aaff'],
  Sunset: ['#ff9344', '#fd457d']
};

export default function VideoVisualizer() {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const captureRef = useRef(null);
  const recorderRef = useRef(null);
  const animationRef = useRef(null);
  const backgroundRef = useRef(null);
  const imageURLRef = useRef('');
  const audioURLRef = useRef('');
  const settingsRef = useRef({});
  const [audioFile, setAudioFile] = useState('');
  const [mode, setMode] = useState(MODES[0]);
  const [color, setColor] = useState('Violet');
  const [title, setTitle] = useState('MY SKYNZ VIDEO');
  const [status, setStatus] = useState('Choose music to begin');
  const [recording, setRecording] = useState(false);
  settingsRef.current = { mode, color, title };

  useEffect(() => {
    let frame = 0;
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const width = canvas.width, height = canvas.height;
      const { mode: effect, color: palette, title: heading } = settingsRef.current;
      const [primary, secondary] = COLORS[palette] || COLORS.Violet;
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#0d0820'); gradient.addColorStop(1, '#050510');
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
      if (backgroundRef.current && backgroundRef.current.complete) {
        const img = backgroundRef.current;
        const scale = Math.max(width / img.width, height / img.height);
        ctx.globalAlpha = 0.38;
        ctx.drawImage(img, (width - img.width * scale) / 2, (height - img.height * scale) / 2, img.width * scale, img.height * scale);
        ctx.globalAlpha = 1;
      }

      let strength = 0.12;
      let spectrum = null;
      if (analyserRef.current) {
        spectrum = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(spectrum);
        strength = Math.max(0.12, spectrum.slice(0, 48).reduce((sum, value) => sum + value, 0) / (48 * 255));
      } else {
        strength += 0.05 * Math.sin(frame / 20);
      }
      const centerX = width / 2, centerY = height / 2;
      ctx.lineWidth = 5;
      if (effect === 'Neon rings') {
        for (let i = 0; i < 6; i++) {
          ctx.strokeStyle = i % 2 ? primary : secondary;
          ctx.globalAlpha = 0.85 - i * 0.10;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 80 + i * 34 + strength * 95, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      } else if (effect === 'Equalizer') {
        const count = 48, barWidth = width / (count * 1.6);
        for (let i = 0; i < count; i++) {
          const level = spectrum ? spectrum[Math.floor(i * spectrum.length / count)] / 255 : (0.3 + 0.3 * Math.sin(frame / 12 + i));
          ctx.fillStyle = i % 2 ? primary : secondary;
          ctx.fillRect((i + 0.25) * width / count, height - 80 - level * height * 0.57, barWidth, level * height * 0.57);
        }
      } else {
        const radius = 115 + strength * 130;
        const glow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius);
        glow.addColorStop(0, secondary + 'df'); glow.addColorStop(1, primary + '00');
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); ctx.fill();
      }

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center'; ctx.font = 'bold 44px Arial, sans-serif';
      ctx.shadowColor = '#000000'; ctx.shadowBlur = 12;
      ctx.fillText((heading || 'SKYNZ').slice(0, 38), centerX, height - 45);
      ctx.shadowBlur = 0;
      ctx.fillStyle = primary; ctx.font = 'bold 23px Arial, sans-serif';
      ctx.fillText('SKYNZ · YOUR PAGE. YOUR VIBE. YOUR STAGE.', centerX, 46);
      frame++;
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animationRef.current); };
  }, []);

  useEffect(() => () => {
    try { recorderRef.current?.stop(); } catch {}
    audioContextRef.current?.close().catch(() => {});
    if (audioURLRef.current) URL.revokeObjectURL(audioURLRef.current);
    if (imageURLRef.current) URL.revokeObjectURL(imageURLRef.current);
  }, []);

  const chooseAudio = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (audioURLRef.current) URL.revokeObjectURL(audioURLRef.current);
    audioURLRef.current = URL.createObjectURL(file);
    if (audioRef.current) audioRef.current.src = audioURLRef.current;
    setAudioFile(file.name);
    setStatus('Music ready: ' + file.name);
  };

  const chooseImage = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imageURLRef.current) URL.revokeObjectURL(imageURLRef.current);
    imageURLRef.current = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => { backgroundRef.current = image; };
    image.src = imageURLRef.current;
  };

  const prepareAudio = async () => {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) throw new Error('Web Audio is unavailable in this browser.');
    if (!audioContextRef.current) {
      const context = new Audio();
      const source = context.createMediaElementSource(audioRef.current);
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      const capture = context.createMediaStreamDestination();
      source.connect(analyser);
      analyser.connect(context.destination);
      analyser.connect(capture);
      audioContextRef.current = context;
      analyserRef.current = analyser;
      captureRef.current = capture;
    }
    await audioContextRef.current.resume();
  };

  const preview = async () => {
    if (!audioFile) return setStatus('Choose an audio file first.');
    try {
      await prepareAudio();
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setStatus('Playing preview');
    } catch (error) { setStatus(error.message); }
  };

  const finishRecording = () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    audioRef.current?.pause();
    setRecording(false);
  };

  const exportVideo = async () => {
    if (!audioFile) return setStatus('Choose a song to export a video.');
    if (!window.MediaRecorder || !canvasRef.current?.captureStream) {
      return setStatus('This browser cannot export WebM. Try Chrome.');
    }
    try {
      await prepareAudio();
      const video = canvasRef.current.captureStream(30);
      const stream = new MediaStream([...video.getVideoTracks(), ...captureRef.current.stream.getAudioTracks()]);
      const type = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']
        .find(candidate => MediaRecorder.isTypeSupported(candidate));
      if (!type) throw new Error('WebM recording is unsupported in this browser.');
      const recorder = new MediaRecorder(stream, { mimeType: type });
      const chunks = [];
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        const url = URL.createObjectURL(new Blob(chunks, { type }));
        const link = document.createElement('a');
        link.href = url; link.download = 'SKYNZ-music-video.webm';
        document.body.append(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        setStatus('Video exported as WebM on this PC');
        setRecording(false);
      };
      recorderRef.current = recorder;
      audioRef.current.currentTime = 0;
      recorder.start(250);
      try { await audioRef.current.play(); }
      catch (error) { recorder.stop(); throw error; }
      setRecording(true);
      setStatus('Recording music video — let the song play or select Stop');
    } catch (error) { setRecording(false); setStatus(error.message); }
  };

  return (
    <section aria-label="Music video maker" className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <label className="text-sm text-gray-200">Music file
          <input type="file" accept="audio/*" onChange={chooseAudio} className="block mt-2 text-sm text-gray-200 max-w-full" />
        </label>
        <label className="text-sm text-gray-200">Optional background picture
          <input type="file" accept="image/*" onChange={chooseImage} className="block mt-2 text-sm text-gray-200 max-w-full" />
        </label>
        <label className="text-sm text-gray-200">Video title
          <input value={title} maxLength={38} onChange={e => setTitle(e.target.value)}
            className="block mt-2 w-full rounded-lg bg-black border border-purple-600 px-3 py-2 text-white"/>
        </label>
        <label className="text-sm text-gray-200">Visual effect
          <select value={mode} onChange={e => setMode(e.target.value)}
            className="block mt-2 w-full rounded-lg bg-black border border-purple-600 px-3 py-2 text-white">
            {MODES.map(option => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label className="text-sm text-gray-200">Color theme
          <select value={color} onChange={e => setColor(e.target.value)}
            className="block mt-2 w-full rounded-lg bg-black border border-purple-600 px-3 py-2 text-white">
            {Object.keys(COLORS).map(option => <option key={option}>{option}</option>)}
          </select>
        </label>
      </div>
      <canvas ref={canvasRef} width="960" height="540" aria-label="Live music video preview"
        className="w-full rounded-xl border border-purple-500/50 bg-black" />
      <audio ref={audioRef} controls onEnded={finishRecording} className="w-full" aria-label="Music playback"/>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={preview} className="rounded-lg bg-purple-700 text-white px-5 py-3 font-semibold">Play preview</button>
        <button type="button" onClick={exportVideo} disabled={recording} className="rounded-lg bg-emerald-700 disabled:opacity-50 text-white px-5 py-3 font-semibold">Export WebM video</button>
        <button type="button" onClick={() => { finishRecording(); setStatus('Stopped'); }} className="rounded-lg bg-gray-800 text-white px-5 py-3">Stop</button>
      </div>
      <p aria-live="polite" className="text-cyan-300 text-sm">{status}</p>
      <p className="text-gray-400 text-sm">
        Working local music visualizer and WebM exporter. Files remain in your browser. Native Velorn/ComfyStudio editing is a separate desktop integration, not embedded here yet.
      </p>
    </section>
  );
}
