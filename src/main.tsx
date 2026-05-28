import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  Activity,
  Boxes,
  BriefcaseBusiness,
  CloudCog,
  Code2,
  Cpu,
  Database,
  Github,
  Globe2,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  MonitorCog,
  Network,
  Phone,
  Play,
  Radar,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
  ThumbsUp,
  UserRound,
  Waypoints,
  Workflow,
  X,
} from "lucide-react";
import "./styles.css";

type TabId =
  | "profile"
  | "experience"
  | "projects"
  | "devops"
  | "skills"
  | "beyond"
  | "contact";

type Tab = {
  id: TabId;
  label: string;
  icon: typeof UserRound;
  status: string;
};

const tabs: Tab[] = [
  { id: "profile", label: "Profile", icon: UserRound, status: "identity.ready" },
  { id: "experience", label: "Experience", icon: BriefcaseBusiness, status: "enterprise.live" },
  { id: "projects", label: "Projects", icon: Layers3, status: "builds.synced" },
  { id: "devops", label: "DevOps Journey", icon: CloudCog, status: "pipeline.green" },
  { id: "skills", label: "Skills Matrix", icon: Radar, status: "nodes.active" },
  { id: "beyond", label: "Beyond Tech", icon: Sparkles, status: "human.mode" },
  { id: "contact", label: "Contact", icon: MessageCircle, status: "available" },
];

const bootLines = [
  "Initializing Mlondolozi.dev",
  "Loading enterprise systems context",
  "Mounting developer workspace",
  "Syncing DevOps learning path",
  "Building systems. Solving problems. Engineering the future.",
];

const experience = [
  {
    title: "LabWare LIMS Consulting",
    period: "Enterprise systems",
    detail:
      "Configured, supported, and improved laboratory information workflows across complex regulated environments.",
    tags: ["LabWare", "LIMS", "SQL", "Workflows"],
  },
  {
    title: "Implementations & Integrations",
    period: "Systems delivery",
    detail:
      "Worked across requirements, configuration, testing, training, and handover, keeping business value visible throughout.",
    tags: ["UAT", "Data", "APIs", "Documentation"],
  },
  {
    title: "Training & Client Enablement",
    period: "People + platforms",
    detail:
      "Translated technical systems into usable operating habits for teams, stakeholders, and end users.",
    tags: ["Training", "Support", "Leadership", "Adoption"],
  },
  {
    title: "Software Engineering Transition",
    period: "Modern engineering",
    detail:
      "Expanding from enterprise consulting into full-stack software, automation, cloud, and platform engineering.",
    tags: ["React", "Node", "Firebase", "DevOps"],
  },
];

const projects = [
  {
    name: "Telemat IQ",
    type: "Intelligent fleet platform",
    challenge: "Turning telematics signals into operational visibility and decision-ready dashboards.",
    stack: ["React", "Maps", "APIs", "Analytics"],
  },
  {
    name: "3D Portfolio Concept",
    type: "Immersive identity system",
    challenge: "Exploring a spatial interface for presenting engineering ability and creative direction.",
    stack: ["Three.js", "React", "Motion", "UX"],
  },
  {
    name: "React Native Builds",
    type: "Mobile product labs",
    challenge: "Building cross-platform interfaces that connect mobile users to useful workflows.",
    stack: ["React Native", "Firebase", "Auth", "Storage"],
  },
  {
    name: "Automation Systems",
    type: "Workflow acceleration",
    challenge: "Replacing manual repetition with small, dependable tools that save time and reduce errors.",
    stack: ["Node.js", "APIs", "Scripts", "Dashboards"],
  },
  {
    name: "Nodel Partners",
    type: "Partner network platform",
    challenge: "Creating a polished digital presence for partners, collaboration, and business growth.",
    stack: ["React", "Brand UX", "Content", "Responsive UI"],
  },
  {
    name: "DevOps Learning Labs",
    type: "Platform practice",
    challenge: "Building confidence with deployment pipelines, containers, infrastructure, and observability.",
    stack: ["Docker", "GitHub Actions", "Linux", "IaC"],
  },
];

const devopsSteps = [
  ["Linux", "Terminal fluency, services, permissions, networking"],
  ["Docker", "Containerized apps and repeatable local environments"],
  ["CI/CD", "Automated testing, build checks, deployment flow"],
  ["Terraform", "Infrastructure expressed as reviewable code"],
  ["Kubernetes", "Scaling, orchestration, rollout thinking"],
  ["Monitoring", "Logs, metrics, alerts, and operational feedback"],
];

const skillGroups = [
  {
    title: "Frontend",
    icon: Code2,
    skills: ["React", "Tailwind", "JavaScript", "TypeScript", "Three.js"],
  },
  {
    title: "Backend",
    icon: Database,
    skills: ["Node.js", "APIs", "Firebase", "Databases", "Auth"],
  },
  {
    title: "Enterprise",
    icon: Boxes,
    skills: ["LabWare LIMS", "SQL", "Integrations", "Support", "Documentation"],
  },
  {
    title: "DevOps",
    icon: Workflow,
    skills: ["Docker", "GitHub Actions", "Linux", "CI/CD", "Monitoring", "IaC"],
  },
];

function App() {
  const [booted, setBooted] = useBootSequence();
  const [active, setActive] = useState<TabId>("profile");

  return (
    <main className="app-shell">
      <AmbientBackground />
      <AnimatePresence>
        {!booted && <BootScreen onSkip={() => setBooted(true)} />}
      </AnimatePresence>

      <motion.section
        className="workspace"
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: booted ? 1 : 0, scale: booted ? 1 : 0.98, y: booted ? 0 : 18 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <TopBar active={active} />
        <div className="browser-chrome">
          <div className="traffic">
            <span>−</span>
            <span>□</span>
            <span>×</span>
          </div>
          <div className="address-bar">
            <ShieldCheck size={16} />
            <span>https://mlondolozi.dev/{active}</span>
          </div>
          <div className="chrome-actions">
            <Activity size={16} />
            <Cpu size={16} />
          </div>
        </div>

        <div className="workspace-grid">
          <aside className="sidebar">
            <Logo />
            <nav className="tab-list" aria-label="Portfolio sections">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    className={active === tab.id ? "tab active" : "tab"}
                    key={tab.id}
                    onClick={() => setActive(tab.id)}
                    type="button"
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="command-card">
              <div className="mono muted">command.palette</div>
              <div className="command-line">
                <Terminal size={15} />
                <span>deploy --identity</span>
              </div>
            </div>
          </aside>

          <section className="content-panel">
            <StatusRail active={active} />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="tab-content"
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                transition={{ duration: 0.34, ease: "easeOut" }}
              >
                {active === "profile" && <Profile />}
                {active === "experience" && <Experience />}
                {active === "projects" && <Projects />}
                {active === "devops" && <DevOps />}
                {active === "skills" && <Skills />}
                {active === "beyond" && <Beyond />}
                {active === "contact" && <Contact />}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </motion.section>
    </main>
  );
}

function useBootSequence(): [boolean, (value: boolean) => void] {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setBooted(true), 3600);
    return () => window.clearTimeout(timer);
  }, []);

  return [booted, setBooted];
}

function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="grid-plane" />
      <div className="orb teal" />
      <div className="orb blue" />
      <div className="scanline" />
      {Array.from({ length: 24 }).map((_, index) => (
        <span
          className="particle"
          key={index}
          style={{
            left: `${(index * 37) % 100}%`,
            top: `${(index * 53) % 100}%`,
            animationDelay: `${index * 0.18}s`,
          }}
        />
      ))}
    </div>
  );
}

function BootScreen({ onSkip }: { onSkip: () => void }) {
  return (
    <motion.section
      className="boot-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.55 }}
    >
      <div className="boot-terminal">
        <div className="boot-header">
          <Logo compact />
          <button onClick={onSkip} type="button">
            <Play size={14} />
            Enter
          </button>
        </div>
        <div className="boot-lines">
          {bootLines.map((line, index) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.45 }}
            >
              <span className="prompt">$</span> {line}
            </motion.p>
          ))}
        </div>
        <div className="boot-progress">
          <motion.span initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3.2 }} />
        </div>
      </div>
    </motion.section>
  );
}

function TopBar({ active }: { active: TabId }) {
  return (
    <header className="top-bar">
      <div>
        <p className="eyebrow">Consultant + software developer</p>
        <h1>Mlondolozi Zondi</h1>
      </div>
      <div className="signal-row">
        <span className="live-dot" />
        <span>{tabs.find((tab) => tab.id === active)?.status}</span>
      </div>
    </header>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "logo compact" : "logo"}>
      <div className="logo-mark">
        <span>MZ</span>
      </div>
      {!compact && (
        <div>
          <strong>Mlondolozi.dev</strong>
          <span>systems / software / cloud</span>
        </div>
      )}
    </div>
  );
}

function StatusRail({ active }: { active: TabId }) {
  return (
    <div className="status-rail">
      <span>{active}.tsx</span>
      <span>Johannesburg / remote</span>
      <span>impact-oriented</span>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  kicker,
  title,
  children,
}: {
  icon: typeof UserRound;
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="section-title">
      <div className="title-icon">
        <Icon size={22} />
      </div>
      <div>
        <p className="eyebrow">{kicker}</p>
        <h2>{title}</h2>
        <p>{children}</p>
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div className="profile-grid">
      <section className="hero-copy">
        <SectionTitle icon={UserRound} kicker="Identity / profile" title="Enterprise calm meets builder energy.">
          Mlondolozi is a technology consultant growing into a full-stack and DevOps engineer, with a rare bridge
          between regulated enterprise systems and modern product development.
        </SectionTitle>
        <div className="mission-panel">
          <p>
            Mission: build dependable systems that make complex work clearer, faster, and more human. The focus is
            practical software, clean delivery, and engineering choices that can survive real operational pressure.
          </p>
        </div>
        <div className="value-grid">
          {["Grounded", "Ambitious", "System-minded", "Client fluent", "Curious", "Reliable"].map((trait) => (
            <span key={trait}>{trait}</span>
          ))}
        </div>
      </section>
      <aside className="avatar-panel">
        <div className="avatar-frame">
          <div className="avatar-core">MZ</div>
          <div className="orbit one" />
          <div className="orbit two" />
        </div>
        <div className="identity-card">
          <span className="mono">role.current</span>
          <strong>Software Developer / Technology Consultant</strong>
          <p>Transitioning from LIMS specialist to modern platform engineer.</p>
        </div>
      </aside>
    </div>
  );
}

function Experience() {
  return (
    <>
      <SectionTitle icon={BriefcaseBusiness} kicker="Experience / timeline" title="Built in enterprise reality.">
        A dynamic view of consulting, implementation, training, support, integration, and the path into software
        engineering.
      </SectionTitle>
      <div className="timeline">
        {experience.map((item, index) => (
          <motion.article
            className="timeline-item"
            key={item.title}
            whileHover={{ x: 8, borderColor: "rgba(83, 231, 255, 0.55)" }}
          >
            <span className="timeline-index">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <p className="mono">{item.period}</p>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <div className="chip-row">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </>
  );
}

function Projects() {
  return (
    <>
      <SectionTitle icon={Layers3} kicker="Projects / windows" title="Product thinking in motion.">
        Floating project windows show the range: web, mobile, automation, Firebase, APIs, operations, and DevOps labs.
      </SectionTitle>
      <div className="project-grid">
        {projects.map((project, index) => (
          <motion.article
            className="project-window"
            key={project.name}
            whileHover={{ y: -8, rotateX: 4, rotateY: index % 2 ? -3 : 3 }}
          >
            <div className="window-bar">
              <span>−</span>
              <span>□</span>
              <span>×</span>
              <em>{project.type}</em>
            </div>
            <h3>{project.name}</h3>
            <p>{project.challenge}</p>
            <div className="mini-architecture">
              <span />
              <Waypoints size={18} />
              <span />
              <Network size={18} />
              <span />
            </div>
            <div className="chip-row">
              {project.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </>
  );
}

function DevOps() {
  return (
    <div>
      <SectionTitle icon={CloudCog} kicker="DevOps / progression" title="From consultant to platform engineer.">
        A growth map from operating complex enterprise systems toward building, deploying, and automating the platforms
        behind modern products.
      </SectionTitle>
      <div className="pipeline">
        {devopsSteps.map(([name, detail], index) => (
          <motion.div
            className="pipeline-node"
            key={name}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="node-icon">
              {index % 3 === 0 && <Terminal size={20} />}
              {index % 3 === 1 && <CloudCog size={20} />}
              {index % 3 === 2 && <MonitorCog size={20} />}
            </div>
            <strong>{name}</strong>
            <p>{detail}</p>
          </motion.div>
        ))}
      </div>
      <div className="infra-map">
        <div className="dash-card">
          <p className="mono">pipeline.status</p>
          <strong>Build passed</strong>
          <span>tests / image / deploy</span>
        </div>
        <div className="dash-card accent">
          <p className="mono">cluster.view</p>
          <strong>3 services</strong>
          <span>api / web / worker</span>
        </div>
        <div className="dash-card">
          <p className="mono">observability</p>
          <strong>99.9%</strong>
          <span>logs / metrics / alerts</span>
        </div>
      </div>
    </div>
  );
}

function Skills() {
  return (
    <>
      <SectionTitle icon={Radar} kicker="Skills / matrix" title="A system map of capability.">
        Skills are grouped by the kinds of problems they solve: interface, data, enterprise delivery, and operational
        reliability.
      </SectionTitle>
      <div className="skills-map">
        {skillGroups.map((group) => {
          const Icon = group.icon;
          return (
            <motion.article className="skill-cluster" key={group.title} whileHover={{ scale: 1.02 }}>
              <div className="cluster-head">
                <Icon size={22} />
                <h3>{group.title}</h3>
              </div>
              <div className="node-cloud">
                {group.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>
    </>
  );
}

function Beyond() {
  const moments = [
    ["Travel", "Mozambique trip and the kind of perspective that comes from stepping outside routine."],
    ["Speaking", "Career expos, public presence, and translating ambition into encouragement for others."],
    ["Growth", "A personal operating system built around learning, discipline, and future-focused choices."],
    ["Video Editing", "A creative layer for shaping footage, pacing, sound, and story into polished digital moments."],
    ["PC Gaming (Legacy)", "A long-running love for performance, strategy, immersion, and the culture of gaming setups."],
  ];

  return (
    <>
      <SectionTitle icon={Globe2} kicker="Beyond tech / human layer" title="Warmth behind the systems.">
        A portfolio should show capability, but also judgment, taste, and the person clients will actually work with.
      </SectionTitle>
      <div className="life-grid">
        {moments.map(([title, text]) => (
          <article key={title}>
            <MapPin size={19} />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <div className="vision-board">
        <span>consulting</span>
        <span>software craft</span>
        <span>cloud engineering</span>
        <span>travel</span>
        <span>public impact</span>
        <span>financial freedom</span>
      </div>
    </>
  );
}

function Contact() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [formStatusType, setFormStatusType] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function openModal() {
    setIsModalOpen(true);
    setFormStatus("");
    setFormStatusType("idle");
  }

  function closeModal() {
    if (!isSubmitting) {
      setIsModalOpen(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setFormStatusType("error");
      setFormStatus("EmailJS is not configured yet. Please use Call or WhatsApp for now.");
      return;
    }

    setIsSubmitting(true);
    setFormStatusType("idle");
    setFormStatus("Sending your message...");

    try {
      await emailjs.sendForm(serviceId, templateId, form, {
        publicKey,
      });
      form.reset();
      setFormStatusType("success");
      setFormStatus("Submitted. Thanks for reaching out.");
    } catch (error) {
      setFormStatusType("error");
      setFormStatus(
        error instanceof Error
          ? `Message could not be sent through EmailJS. ${error.message} For an immediate response, use Call or WhatsApp.`
          : "Message could not be sent. For an immediate response, use Call or WhatsApp.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="contact-layout" id="contact">
      <section>
        <SectionTitle icon={MessageCircle} kicker="Contact / hire me" title="Let's build something impactful.">
          Available for consulting, development, and technical collaboration across enterprise workflows, modern web
          apps, automation, and DevOps-focused builds.
        </SectionTitle>
        <div className="cta-row">
          <span className="contact-chip" aria-label="Email address">
            <Mail size={18} />
            hello@mlondolozi.dev
          </span>
          <a href="https://www.linkedin.com/in/mlondolozi-zondi/" target="_blank" rel="noreferrer">
            <Linkedin size={18} />
            LinkedIn
          </a>
          <a href="https://github.com/mbusozayo0" target="_blank" rel="noreferrer">
            <Github size={18} />
            GitHub
          </a>
          <a href="tel:+27681402763" aria-label="Call Mlondolozi Zondi">
            <Phone size={18} />
            Call
          </a>
          <a href="https://wa.me/27681402763" target="_blank" rel="noreferrer" aria-label="WhatsApp Mlondolozi Zondi">
            <MessageCircle size={18} />
            WhatsApp
          </a>
        </div>
        <button className="primary-contact-button" type="button" onClick={openModal}>
          <Rocket size={18} />
          Start conversation
        </button>
      </section>
      <aside className="contact-preview">
        <p className="mono">response.mode</p>
        <strong>Let's have a chat.</strong>
        <p>
          Tell me about your idea, project, or problem to solve or just{" "}
          <span className="hire-highlight">Hire Me</span>. Use the form for details, or reach out via Call or WhatsApp.
        </p>
      </aside>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              aria-modal="true"
              className="contact-modal"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              role="dialog"
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              <div className="modal-header">
                <div>
                  <p className="eyebrow">Start conversation</p>
                  <h3>Capture project details</h3>
                </div>
                <button aria-label="Close contact form" onClick={closeModal} type="button">
                  <X size={18} />
                </button>
              </div>
              {formStatusType === "success" ? (
                <div className="submitted-state">
                  <div className="submitted-icon">
                    <ThumbsUp size={34} />
                  </div>
                  <h3>Submitted</h3>
                  <p>{formStatus}</p>
                  <button type="button" onClick={closeModal}>
                    Close
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <input name="to_email" type="hidden" value="hello@mlondolozi.dev" />
                  <input name="site_name" type="hidden" value="Mlondolozi.dev" />
                  <label>
                    Name
                    <input name="from_name" placeholder="Your name" required />
                  </label>
                  <label>
                    Email
                    <input name="from_email" type="email" placeholder="you@example.com" required />
                  </label>
                  <label>
                    Phone
                    <input name="phone" type="tel" placeholder="+27 ..." />
                  </label>
                  <label>
                    Project type
                    <select name="project_type" defaultValue="consulting" required>
                      <option value="consulting">Consulting</option>
                      <option value="development">Software development</option>
                      <option value="devops">DevOps collaboration</option>
                    </select>
                  </label>
                  <label>
                    Message
                    <textarea name="message" placeholder="Tell me what you want to build." required />
                  </label>
                  <button type="submit" disabled={isSubmitting}>
                    <Rocket size={18} />
                    {isSubmitting ? "Sending..." : "Send enquiry"}
                  </button>
                  {formStatus && <p className={`form-status ${formStatusType}`}>{formStatus}</p>}
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
