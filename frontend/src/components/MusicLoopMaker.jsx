import React, { useEffect, useRef, useState } from 'react';

const LANES = ['Kick', 'Snare', 'Hat', 'Bass'];
const PRESETS = {
  'Southern Rock Rap': {
    Kick: [0, 6, 8, 11], Snare: [4, 12],
    Hat: [0, 2, 4, 6, 8, 10, 12, 14], Bass: [0, 3, 6, 8, 11, 14]
  },
  'Country Rock': {
    Kick: [0, 8, 10], Snare: [4, 12],
    Hat: [0, 2, 4, 6, 8, 10, 12, 14], Bass: [0, 4, 8, 12]
  },
  'Electronic': {
    Kick: [0, 4, 8, 12], Snare: [4, 12],
    Hat: [0, 2, 4, 6, 8, 10, 12, 14], Bass: [0, 3, 7, 8, 11, 15]
  }
};

function makePattern(style, seed) {
  const pattern = Object.fromEntries(
    LANES.map(lane => [lane, Array.from({ length: 16 }, (_, step) => PRESETS[style][lane].includes(step))])
  );
  // Deterministic small variations; the same seed produces the same loop.
  let random = (seed >>> 0) || 1;
  function next() {
    random ^= random << 13; random ^= random >>> 17; random ^= random << 5;
    return (random >>> 0) / 4294967296;
  }
  for (const step of [3, 7, 11, 15]) {
    if (next() > 0.5) pattern.Hat[step] = true;
    if (next() > 0.75) pattern.Bass[step] = !pattern.Bass[step];
  }
  return pattern;
}

function noise(context, time, length, strength, cutoff = 3000) {
  const frames = Math.ceil(context.sampleRate * length);
  const buffer = context.createBuffer(1, frames, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
  const src = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  src.buffer = buffer; filter.type = 'highpass'; filter.frequency.value = cutoff;
  gain.gain.setValueAtTime(strength, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + length);
  src.connect(filter); filter.connect(gain); gain.connect(context.destination);
  src.start(time); src.stop(time + length);
}

function tone(context, time, kind, hz, volume, length) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = kind;
  oscillator.frequency.setValueAtTime(hz, time);
  if (kind === 'sine') oscillator.frequency.exponentialRampToValueAtTime(46, time + length);
  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + length);
  oscillator.connect(gain); gain.connect(context.destination);
  oscillator.start(time); oscillator.stop(time + length);
}

function schedule(context, pattern, bpm, start) {
  const stepSeconds = 60 / bpm / 4;
  const bassNotes = [55, 65.4, 73.42, 82.41, 55, 65.4, 49, 73.42];
  for (let step = 0; step < 64; step++) {
    const position = step % 16;
    const time = start + stepSeconds * step;
    if (pattern.Kick[position]) tone(context, time, 'sine', 125, 0.9, 0.17);
    if (pattern.Snare[position]) noise(context, time, 0.13, 0.3, 1200);
    if (pattern.Hat[position]) noise(context, time, 0.055, 0.10, 6000);
    if (pattern.Bass[position]) tone(context, time, 'triangle', bassNotes[Math.floor(step / 4) % 8], 0.28, stepSeconds * 1.75);
  }
  return stepSeconds * 64;
}

function audioToWave(buffer) {
  const pcm = buffer.getChannelData(0);
  const file = new ArrayBuffer(44 + pcm.length * 2);
  const view = new DataView(file);
  const ascii = (at, str) => { for (let i = 0; i < str.length; i++) view.setUint8(at + i, str.charCodeAt(i)); };
  ascii(0, 'RIFF'); view.setUint32(4, 36 + pcm.length * 2, true);
  ascii(8, 'WAVE'); ascii(12, 'fmt '); view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * 2, true);
  view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  ascii(36, 'data'); view.setUint32(40, pcm.length * 2, true);
  for (let i = 0; i < pcm.length; i++) {
    const sample = Math.max(-1, Math.min(1, pcm[i]));
    view.setInt16(44 + i * 2, Math.round(sample * 32767), true);
  }
  return new Blob([file], { type: 'audio/wav' });
}

export default function MusicLoopMaker() {
  const [style, setStyle] = useState('Southern Rock Rap');
  const [bpm, setBpm] = useState(95);
  const [seed, setSeed] = useState(1);
  const [pattern, setPattern] = useState(() => makePattern('Southern Rock Rap', 1));
  const [status, setStatus] = useState('Ready to create');
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const stop = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    if (audioRef.current) audioRef.current.close().catch(() => {});
    audioRef.current = null;
    setPlaying(false);
  };
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (audioRef.current) audioRef.current.close().catch(() => {});
  }, []);

  const regenerate = (newStyle = style) => {
    stop();
    const newSeed = seed + 1;
    setSeed(newSeed);
    setPattern(makePattern(newStyle, newSeed));
    setStatus('New 16-step pattern generated');
  };

  const play = async () => {
    stop();
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) throw new Error('This browser does not support Web Audio.');
      const context = new Audio();
      audioRef.current = context;
      await context.resume();
      const duration = schedule(context, pattern, bpm, context.currentTime + 0.1);
      setPlaying(true); setStatus('Playing four bars');
      timerRef.current = setTimeout(() => { stop(); setStatus('Playback complete'); }, (duration + 0.4) * 1000);
    } catch (error) { stop(); setStatus(error.message); }
  };

  const exportWave = async () => {
    setStatus('Rendering WAV...');
    try {
      if (!window.OfflineAudioContext) throw new Error('Offline WAV export is unsupported in this browser.');
      const duration = 16 * 60 / bpm + 0.5;
      const context = new window.OfflineAudioContext(1, Math.ceil(44100 * duration), 44100);
      schedule(context, pattern, bpm, 0.02);
      const rendered = await context.startRendering();
      const url = URL.createObjectURL(audioToWave(rendered));
      const link = document.createElement('a');
      link.href = url; link.download = 'SKYNZ-' + style.toLowerCase().replace(/\s+/g, '-') + '-' + bpm + 'bpm.wav';
      document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setStatus('WAV exported locally');
    } catch (error) { setStatus(error.message); }
  };

  return (
    <section aria-label="Music generator" className="space-y-5">
      <div className="flex flex-wrap gap-4 items-end">
        <label className="text-sm text-gray-200">Genre
          <select value={style} onChange={e => { setStyle(e.target.value); regenerate(e.target.value); }}
            className="block mt-2 rounded-lg bg-gray-950 border border-purple-500 p-3 text-white">
            {Object.keys(PRESETS).map(name => <option key={name}>{name}</option>)}
          </select>
        </label>
        <label className="text-sm text-gray-200">Tempo: {bpm} BPM
          <input aria-label="Tempo" type="range" min="65" max="160" value={bpm}
            onChange={e => setBpm(Number(e.target.value))} className="block mt-3 w-48" />
        </label>
        <button type="button" onClick={() => regenerate()} className="rounded-lg bg-purple-600 hover:bg-purple-500 text-white px-5 py-3 font-semibold">Generate variation</button>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[620px] space-y-3">
          {LANES.map(lane => (
            <div key={lane} className="grid items-center gap-1" style={{ gridTemplateColumns: '80px repeat(16, minmax(24px, 1fr))' }}>
              <span className="text-sm text-gray-300">{lane}</span>
              {pattern[lane].map((active, step) => (
                <button key={step} type="button" aria-label={lane + ' step ' + (step + 1)}
                  aria-pressed={active}
                  onClick={() => setPattern(previous => ({
                    ...previous, [lane]: previous[lane].map((current, index) => index === step ? !current : current)
                  }))}
                  className={'h-9 rounded border ' + (active ? 'bg-fuchsia-500 border-fuchsia-300' : 'bg-gray-900 border-gray-700') + (step % 4 === 0 ? ' ml-1' : '')}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={playing} onClick={play} className="bg-emerald-700 disabled:opacity-50 text-white rounded-lg px-5 py-3 font-semibold">Play 4 bars</button>
        <button type="button" onClick={() => { stop(); setStatus('Stopped'); }} className="bg-gray-800 text-white rounded-lg px-5 py-3">Stop</button>
        <button type="button" onClick={exportWave} className="bg-purple-700 hover:bg-purple-600 text-white rounded-lg px-5 py-3 font-semibold">Export WAV</button>
      </div>
      <p aria-live="polite" className="text-cyan-300 text-sm">{status}</p>
      <p className="text-gray-400 text-sm">
        Working browser-based beat creator. Audio renders on your computer and downloads as WAV. This is algorithmic generation; connection to a full AI song model is a separate module.
      </p>
    </section>
  );
}
