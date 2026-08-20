import {
  Activity,
  Atom,
  Boxes,
  ChevronRight,
  Cpu,
  Github,
  Linkedin,
  Mail,
  Network,
  Radio,
  Terminal,
} from "lucide-react";
import { navigation, sectionContent } from "./data";
import { useExperienceStore, type OsSection } from "./store";

const sectionIcons: Record<OsSection, typeof Atom> = {
  about: Atom,
  experience: Activity,
  projects: Boxes,
  labware: Cpu,
  integration: Network,
  telemat: Radio,
  contact: Mail,
};

export function MloOS() {
  const progress = useExperienceStore((state) => state.progress);
  const activeSection = useExperienceStore((state) => state.activeSection);
  const setActiveSection = useExperienceStore((state) => state.setActiveSection);
  const content = sectionContent[activeSection];
  const visibility = Math.max(0, Math.min(1, (progress - 0.86) / 0.1));

  return (
    <section
      className="mlo-os"
      aria-hidden={visibility < 0.92}
      inert={visibility < 0.92}
      style={{ opacity: visibility, pointerEvents: visibility > 0.92 ? "auto" : "none" }}
    >
      <div className="os-frame">
        <header className="os-topbar">
          <div className="os-brand">
            <span className="os-mark">MZ</span>
            <div>
              <strong>MLO.OS</strong>
              <small>portfolio operating system</small>
            </div>
          </div>
          <div className="os-status">
            <span><i /> SYSTEM READY</span>
            <span>JHB / ZA</span>
            <span>{new Date().getFullYear()}.06</span>
          </div>
        </header>

        <div className="os-layout">
          <nav className="os-nav" aria-label="MLO.OS sections">
            <p>DIRECTORY</p>
            {navigation.map((item) => {
              const Icon = sectionIcons[item.id];
              return (
                <button
                  className={activeSection === item.id ? "active" : ""}
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  type="button"
                >
                  <span>{item.code}</span>
                  <Icon size={17} />
                  <strong>{item.label}</strong>
                  <ChevronRight size={15} />
                </button>
              );
            })}
            <div className="os-console">
              <Terminal size={15} />
              <span>mlo@identity:~$</span>
              <i />
            </div>
          </nav>

          <main className="os-content" key={activeSection}>
            <div className="os-copy">
              <p className="os-eyebrow">{content.eyebrow}</p>
              <h1>{content.title}</h1>
              <p className="os-intro">{content.intro}</p>
            </div>
            <div className="os-card-grid">
              {content.cards.map((card, index) => (
                <article key={card.title} style={{ "--card-delay": `${index * 80}ms` } as React.CSSProperties}>
                  <span>{card.label}</span>
                  <h2>{card.title}</h2>
                  <p>{card.text}</p>
                </article>
              ))}
            </div>
            {activeSection === "contact" && (
              <div className="os-actions">
                <a href="mailto:hello@mlondolozi.dev"><Mail size={17} /> Email</a>
                <a href="https://github.com/mbusozayo0" target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a>
                <a href="https://www.linkedin.com/in/mlondolozi-zondi/" target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn</a>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
