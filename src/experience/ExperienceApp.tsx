import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, FastForward, Volume2, VolumeX } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";
import { phaseCopy } from "./data";
import { MloOS } from "./MloOS";
import { useExperienceStore } from "./store";
import { World } from "./World";
import "./experience.css";

gsap.registerPlugin(ScrollTrigger);

function StoryHud({ muted, setMuted }: { muted: boolean; setMuted: (muted: boolean) => void }) {
  const progress = useExperienceStore((state) => state.progress);
  const phase = useExperienceStore((state) => state.phase);
  const copy = phaseCopy[phase];

  function skipToOs() {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  }

  return (
    <div className="story-hud">
      <header className="experience-header">
        <a className="experience-brand" href="/" aria-label="Return to Mlondolozi.dev">
          <span>MZ</span>
          <div><strong>MLO.OS</strong><small>interactive experience</small></div>
        </a>
        <div className="experience-controls">
          <button onClick={() => setMuted(!muted)} type="button" aria-label={muted ? "Enable ambient audio" : "Mute ambient audio"}>
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button onClick={skipToOs} type="button"><FastForward size={16} /> Skip to OS</button>
        </div>
      </header>

      <aside className="scene-copy" key={phase}>
        <span className="scene-index">{copy.index} / 05</span>
        <p>{copy.title}</p>
        <strong>{copy.detail}</strong>
      </aside>

      <div className="journey-progress" aria-hidden="true">
        <span style={{ transform: `scaleY(${progress})` }} />
        <small>{String(Math.round(progress * 100)).padStart(2, "0")}</small>
      </div>

      <div className={progress > 0.14 ? "scroll-cue hidden" : "scroll-cue"}>
        <ArrowDown size={15} />
        <span>Scroll to enter</span>
      </div>
    </div>
  );
}

function EnvironmentLayer({ compact }: { compact: boolean }) {
  const progress = useExperienceStore((state) => state.progress);
  const fade = 1 - Math.max(0, Math.min(1, (progress - 0.84) / 0.1));

  return (
    <div className="environment-layer" style={{ opacity: fade }}>
      <World compact={compact} />
      <div className="experience-vignette" />
      <div className="experience-noise" />
    </div>
  );
}

function SitTransition() {
  const progress = useExperienceStore((state) => state.progress);
  const fadeOut = Math.max(0, Math.min(1, (progress - 0.675) / 0.035));
  const fadeIn = 1 - Math.max(0, Math.min(1, (progress - 0.735) / 0.04));
  const opacity = Math.min(fadeOut, fadeIn);

  return <div className="sit-transition" aria-hidden="true" style={{ opacity }} />;
}

export function ExperienceApp() {
  const setProgress = useExperienceStore((state) => state.setProgress);
  const [muted, setMuted] = useState(true);
  const [compact, setCompact] = useState(() => window.matchMedia("(max-width: 760px)").matches);

  useEffect(() => {
    document.title = "MLO.OS | An Interactive Mlondolozi Zondi Experience";
    const query = window.matchMedia("(max-width: 760px)");
    const updateCompact = () => setCompact(query.matches);
    query.addEventListener("change", updateCompact);
    return () => query.removeEventListener("change", updateCompact);
  }, []);

  useEffect(() => {
    if (muted) return;

    const audioContext = new AudioContext();
    const master = audioContext.createGain();
    master.gain.value = 0.32;
    master.connect(audioContext.destination);

    const createHum = (frequency: number, volume: number, type: OscillatorType = "sine") => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.value = volume;
      oscillator.connect(gain).connect(master);
      oscillator.start();
      return oscillator;
    };

    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 3, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    let last = 0;
    for (let index = 0; index < noiseData.length; index += 1) {
      const white = Math.random() * 2 - 1;
      last = last * 0.985 + white * 0.015;
      noiseData[index] = last;
    }

    const createAir = (frequency: number, volume: number, type: BiquadFilterType) => {
      const source = audioContext.createBufferSource();
      const filter = audioContext.createBiquadFilter();
      const gain = audioContext.createGain();
      source.buffer = noiseBuffer;
      source.loop = true;
      filter.type = type;
      filter.frequency.value = frequency;
      filter.Q.value = 0.35;
      gain.gain.value = volume;
      source.connect(filter).connect(gain).connect(master);
      source.start();
      return source;
    };

    const fan = createHum(48, 0.022, "sine");
    const monitorHum = createHum(96, 0.006, "sine");
    const hvac = createAir(240, 0.045, "lowpass");
    const city = createAir(1050, 0.012, "bandpass");

    const clickInterval = window.setInterval(() => {
      const now = audioContext.currentTime;
      const click = audioContext.createOscillator();
      const clickGain = audioContext.createGain();
      click.type = "square";
      click.frequency.setValueAtTime(150 + Math.random() * 70, now);
      click.frequency.exponentialRampToValueAtTime(72, now + 0.035);
      clickGain.gain.setValueAtTime(0.004 + Math.random() * 0.004, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      click.connect(clickGain).connect(master);
      click.start(now);
      click.stop(now + 0.045);
    }, 2600);

    return () => {
      window.clearInterval(clickInterval);
      fan.stop();
      monitorHum.stop();
      hvac.stop();
      city.stop();
      void audioContext.close();
    };
  }, [muted]);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = { progress: prefersReducedMotion ? 0.9 : 0 };
    setProgress(state.progress);

    const context = gsap.context(() => {
      gsap.to(state, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".experience-scroll-track",
          start: "top top",
          end: "bottom bottom",
          scrub: prefersReducedMotion ? false : true,
        },
        onUpdate: () => setProgress(state.progress),
      });
    });

    return () => context.revert();
  }, [setProgress]);

  return (
    <main className="experience-app">
      <a className="experience-skip-link" href="#mlo-os-anchor">Skip cinematic journey</a>
      <div className="experience-stage">
        <EnvironmentLayer compact={compact} />
        <SitTransition />
        <StoryHud muted={muted} setMuted={setMuted} />
        <MloOS />
      </div>
      <div className="experience-scroll-track" aria-hidden="true" />
      <div id="mlo-os-anchor" className="mlo-os-anchor" aria-hidden="true" />
      <noscript>This interactive experience requires JavaScript. Visit mlondolozi.dev for the standard portfolio.</noscript>
    </main>
  );
}
