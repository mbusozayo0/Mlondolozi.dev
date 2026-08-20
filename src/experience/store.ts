import { create } from "zustand";

export type StoryPhase = "arrival" | "journey" | "desk" | "boot" | "portfolio";

export type OsSection =
  | "about"
  | "experience"
  | "projects"
  | "labware"
  | "integration"
  | "telemat"
  | "contact";

type ExperienceState = {
  progress: number;
  phase: StoryPhase;
  activeSection: OsSection;
  setProgress: (progress: number) => void;
  setActiveSection: (section: OsSection) => void;
};

function phaseFromProgress(progress: number): StoryPhase {
  if (progress < 0.12) return "arrival";
  if (progress < 0.58) return "journey";
  if (progress < 0.76) return "desk";
  if (progress < 0.9) return "boot";
  return "portfolio";
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  progress: 0,
  phase: "arrival",
  activeSection: "about",
  setProgress: (progress) => {
    const clamped = Math.min(1, Math.max(0, progress));
    set({ progress: clamped, phase: phaseFromProgress(clamped) });
  },
  setActiveSection: (activeSection) => set({ activeSection }),
}));
