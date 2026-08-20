import emailjs from "@emailjs/browser";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BriefcaseBusiness, Check, Cloud, Code2, Database, FolderKanban, Github, Linkedin, Mail, MapPin, Menu, MessageCircle, Network, Send, UserRound, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import "../portfolio.css";

type SectionId = "profile" | "experience" | "projects" | "capabilities" | "contact";

const navigation = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "experience", label: "Experience", icon: BriefcaseBusiness },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "capabilities", label: "Capabilities", icon: Code2 },
  { id: "contact", label: "Contact", icon: Mail },
] satisfies { id: SectionId; label: string; icon: typeof UserRound }[];

const summaries = [
  { icon: Database, title: "Enterprise systems", text: "LabWare LIMS, validation, support and controlled change." },
  { icon: Network, title: "Integration", text: "SQL, REST APIs, data flows and dependable interfaces." },
  { icon: Cloud, title: "Software + cloud", text: "React, TypeScript, delivery automation and public builds." },
];

const experience = [
  { period: "2023 — present", title: "LabWare LIMS Consultant", text: "Configure, test, deploy and support laboratory systems across regulated enterprise environments.", tags: ["LabWare", "LIMS", "SQL", "SDLC"] },
  { period: "Enterprise delivery", title: "Validation + application support", text: "Translate requirements into testable configurations, validation evidence, change-impact analysis and post-release support.", tags: ["UAT", "Validation", "Support", "Change"] },
  { period: "Systems connectivity", title: "API + integration support", text: "Build and support interfaces between instruments, applications, databases and the teams responsible for reliable operations.", tags: ["REST APIs", "Interfaces", "Data", "Troubleshooting"] },
];

const projects = [
  { status: "Shipped", title: "Mlondolozi.dev + MLO.OS", text: "A responsive portfolio and a separate spatial experience exploring 3D rendering, motion, state and deployment.", stack: "React · TypeScript · Vite · Three.js", href: "/experience" },
  { status: "Awarded capstone", title: "Government Services App", text: "A municipal self-service mobile application that placed second in the 2022 Boxfusion Graduate Competition.", stack: "React Native · Firebase · REST APIs · Stripe" },
  { status: "Product venture", title: "Telemat IQ", text: "An emerging fleet platform turning location and vehicle signals into operational visibility and decision-ready workflows.", stack: "React · Maps · APIs · Analytics" },
  { status: "Next proof build", title: "LIMS Integration Case Study", text: "A sanitised simulator for API contracts, data validation, error handling, audit trails and support runbooks.", stack: "APIs · SQL · Validation · Observability" },
];

const capabilities = [
  ["Enterprise delivery", "LabWare LIMS, application support, SDLC, UAT, validation and controlled change"],
  ["Integration + data", "SQL, REST APIs, interfaces, data mapping, troubleshooting and documentation"],
  ["Product engineering", "React, TypeScript, JavaScript, React Native, Firebase and responsive UI"],
  ["Cloud + DevOps — developing", "Linux, Docker, GitHub Actions, CI/CD, Terraform and observability"],
];

export default function LegacyPortfolio() {
  const [active, setActive] = useState<SectionId>("profile");
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const selectSection = (section: SectionId) => { setActive(section); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return <main className="portfolio-shell">
    <header className="portfolio-topbar">
      <button className="brand-button" onClick={() => selectSection("profile")} type="button"><span className="brand-mark" aria-hidden="true">MZ</span><span>Mlondolozi Zondi</span></button>
      <div className="topbar-location"><MapPin size={16} /> Johannesburg / Remote</div>
      <button className="menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
    </header>
    <div className="portfolio-layout">
      <aside className={menuOpen ? "portfolio-sidebar open" : "portfolio-sidebar"}>
        <nav aria-label="Portfolio sections">{navigation.map((item) => { const Icon = item.icon; return <button className={active === item.id ? "nav-item active" : "nav-item"} key={item.id} onClick={() => selectSection(item.id)} type="button"><Icon size={18} /><span>{item.label}</span></button>; })}</nav>
        <div className="sidebar-footer"><span>Built with React + TypeScript</span><a href="https://github.com/mbusozayo0" target="_blank" rel="noreferrer"><Github size={17} /> View source</a></div>
      </aside>
      <section className="portfolio-content"><AnimatePresence mode="wait"><motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
        {active === "profile" ? <Profile onContact={() => setContactOpen(true)} onProjects={() => selectSection("projects")} /> : null}
        {active === "experience" ? <Experience /> : null}
        {active === "projects" ? <Projects /> : null}
        {active === "capabilities" ? <Capabilities /> : null}
        {active === "contact" ? <Contact onContact={() => setContactOpen(true)} /> : null}
      </motion.div></AnimatePresence></section>
    </div>
    <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
  </main>;
}

function Profile({ onContact, onProjects }: { onContact: () => void; onProjects: () => void }) {
  return <div className="profile-view">
    <section className="hero-grid"><div className="hero-copy">
      <h1>Mlondolozi Zondi</h1><p className="role-title">Enterprise systems + integration engineer</p><div className="accent-rule" />
      <h2>Enterprise reliability meets modern engineering.</h2>
      <p className="hero-intro">I bring 3+ years of hands-on experience with LabWare LIMS, validation, application support, SQL and API integration. I’m expanding that foundation through public builds in React, TypeScript, cloud and DevOps.</p>
      <div className="hero-actions"><button className="primary-action" type="button" onClick={onContact}><MessageCircle size={18} /> Start a conversation</button><button className="secondary-action" type="button" onClick={onProjects}><FolderKanban size={18} /> View projects</button></div>
    </div><CodeEvidence /></section>
    <section className="capability-strip" aria-label="Core capability summary">{summaries.map((item) => { const Icon = item.icon; return <article key={item.title}><Icon /><div><h3>{item.title}</h3><p>{item.text}</p></div></article>; })}</section>
    <section className="proof-section"><div className="section-heading"><div><h2>Proof of work</h2><p>Selected work across enterprise systems, integration and modern software.</p></div><button type="button" onClick={onProjects}>View all projects <ArrowUpRight size={17} /></button></div><div className="proof-grid">{projects.slice(0, 3).map((project) => <ProjectCard project={project} key={project.title} />)}</div></section>
  </div>;
}

function CodeEvidence() {
  return <aside className="code-evidence" aria-label="Code and work evidence"><div className="code-header"><span>system-integration.ts</span><span>TS</span></div><pre aria-label="TypeScript integration example"><code><span className="code-muted">01</span> <span className="code-pink">export async function</span> syncSamples() {'{'}{"\n"}<span className="code-muted">02</span>   <span className="code-blue">const</span> samples = <span className="code-pink">await</span> lims.getSamples();{"\n"}<span className="code-muted">03</span>   <span className="code-pink">for</span> (<span className="code-blue">const</span> sample <span className="code-pink">of</span> samples) {'{'}{"\n"}<span className="code-muted">04</span>     <span className="code-pink">await</span> validate(sample);{"\n"}<span className="code-muted">05</span>     <span className="code-pink">await</span> repository.save(sample);{"\n"}<span className="code-muted">06</span>   {'}'}{"\n"}<span className="code-muted">07</span> {'}'}</code></pre><div className="code-footer"><span>Reliable data flows. Clear contracts.</span><span>TypeScript</span></div></aside>;
}

function PageHeader({ title, intro }: { title: string; intro: string }) { return <header className="page-header"><h1>{title}</h1><p>{intro}</p></header>; }
function Experience() { return <><PageHeader title="Experience" intro="A production foundation in regulated enterprise systems, validation, support and integration." /><div className="timeline-list">{experience.map((item, index) => <article key={item.title}><span className="timeline-number">{String(index + 1).padStart(2, "0")}</span><div><p className="item-meta">{item.period}</p><h2>{item.title}</h2><p>{item.text}</p><div className="tag-list">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></article>)}</div></>; }
function Projects() { return <><PageHeader title="Projects" intro="Shipped work, awarded work and transparent next steps—each labelled for what it is." /><div className="project-list">{projects.map((project) => <ProjectCard project={project} key={project.title} />)}</div></>; }
function ProjectCard({ project }: { project: (typeof projects)[number] }) { const content = <><p className="item-meta">{project.status}</p><h3>{project.title}</h3><p>{project.text}</p><span className="project-stack">{project.stack}</span></>; return project.href ? <a className="project-card" href={project.href}>{content}<ArrowUpRight className="project-arrow" /></a> : <article className="project-card">{content}</article>; }
function Capabilities() { return <><PageHeader title="Capabilities" intro="Clear separation between professional enterprise depth, development projects and an active cloud learning track." /><div className="capability-list">{capabilities.map(([title, detail], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h2>{title}</h2><p>{detail}</p></article>)}</div></>; }
function Contact({ onContact }: { onContact: () => void }) { return <div className="contact-page"><PageHeader title="Let’s build something useful." intro="Open to systems validation, enterprise application support, integration, junior full-stack, cloud and DevOps opportunities." /><div className="contact-options"><button type="button" onClick={onContact}><Send /> Send an enquiry <ArrowUpRight /></button><a href="mailto:hello@mlondolozi.dev"><Mail /> hello@mlondolozi.dev</a><a href="https://www.linkedin.com/in/mlondolozi-zondi/" target="_blank" rel="noreferrer"><Linkedin /> LinkedIn</a><a href="https://github.com/mbusozayo0" target="_blank" rel="noreferrer"><Github /> GitHub</a></div></div>; }

function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle"); const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = event.currentTarget; if (!form.reportValidity()) return; const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID; const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID; const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY; if (!serviceId || !templateId || !publicKey) { setStatus("error"); setMessage("Email delivery is not configured yet. Please email hello@mlondolozi.dev directly."); return; } setStatus("sending"); setMessage(""); try { await emailjs.sendForm(serviceId, templateId, form, { publicKey }); form.reset(); setStatus("success"); setMessage("Thanks—your message has been sent."); } catch { setStatus("error"); setMessage("The message could not be sent. Please email hello@mlondolozi.dev directly."); } }
  return <AnimatePresence>{open ? <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><motion.div className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}><div className="modal-title"><div><p>Start a conversation</p><h2 id="contact-title">Tell me what you’re working on.</h2></div><button type="button" onClick={onClose} aria-label="Close contact form"><X /></button></div>{status === "success" ? <div className="success-state"><Check /><h3>Message sent</h3><p>{message}</p><button type="button" onClick={onClose}>Close</button></div> : <form onSubmit={submit}><label>Name<input name="from_name" required autoComplete="name" /></label><label>Email<input name="from_email" type="email" required autoComplete="email" /></label><label>Opportunity type<select name="project_type" defaultValue="career"><option value="career">Career opportunity</option><option value="systems">Systems / integration</option><option value="development">Software development</option><option value="cloud">Cloud / DevOps</option></select></label><label>Message<textarea name="message" required rows={5} /></label><input type="hidden" name="to_email" value="hello@mlondolozi.dev" /><button className="submit-button" type="submit" disabled={status === "sending"}><Send size={17} /> {status === "sending" ? "Sending…" : "Send enquiry"}</button>{message ? <p className="form-message" role="status">{message}</p> : null}</form>}</motion.div></motion.div> : null}</AnimatePresence>;
}
