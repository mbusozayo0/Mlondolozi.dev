import type { OsSection, StoryPhase } from "./store";

export const phaseCopy: Record<StoryPhase, { index: string; title: string; detail: string }> = {
  arrival: {
    index: "01",
    title: "Arrival",
    detail: "A quiet room. A body of work waiting to be discovered.",
  },
  journey: {
    index: "02",
    title: "Signals in the dark",
    detail: "Mathematics became systems. Systems became software.",
  },
  desk: {
    index: "03",
    title: "The workstation",
    detail: "Where consulting experience becomes product thinking.",
  },
  boot: {
    index: "04",
    title: "MLO.OS",
    detail: "Identity kernel online. Mounting the portfolio interface.",
  },
  portfolio: {
    index: "05",
    title: "System ready",
    detail: "Explore the work, the experience, and the next build.",
  },
};

export const navigation: { id: OsSection; label: string; code: string }[] = [
  { id: "about", label: "About", code: "01" },
  { id: "experience", label: "Experience", code: "02" },
  { id: "projects", label: "Projects", code: "03" },
  { id: "labware", label: "LabWare", code: "04" },
  { id: "integration", label: "Integration", code: "05" },
  { id: "telemat", label: "Telemat IQ", code: "06" },
  { id: "contact", label: "Contact", code: "07" },
];

export const sectionContent: Record<
  OsSection,
  { eyebrow: string; title: string; intro: string; cards: { label: string; title: string; text: string }[] }
> = {
  about: {
    eyebrow: "identity.profile",
    title: "I connect enterprise reliability to modern engineering.",
    intro:
      "Mathematics-trained and enterprise-tested, with 3+ years across LIMS configuration, validation, support, integration, and delivery - now expanding through public software and cloud projects.",
    cards: [
      { label: "Foundation", title: "Mathematics", text: "Structure, abstraction, and an instinct for finding the model beneath the noise." },
      { label: "Professional base", title: "Enterprise systems", text: "Regulated workflows, validation, application support, integrations, SQL, and full-SDLC delivery." },
      { label: "Growth direction", title: "Software + cloud", text: "React, TypeScript, Linux, containers, CI/CD, infrastructure, and observability through hands-on builds." },
    ],
  },
  experience: {
    eyebrow: "career.timeline",
    title: "Built in enterprise reality.",
    intro:
      "My career foundation is regulated laboratory systems, application support, validation, and integration; the next layer is full-stack and cloud engineering.",
    cards: [
      { label: "01 / systems", title: "LabWare LIMS consultant", text: "3+ years across configuration, testing, deployment, support, and documentation." },
      { label: "02 / connective tissue", title: "Validation + integration", text: "SQL, APIs, data flows, change impact, and controls that help systems cooperate reliably." },
      { label: "03 / builder", title: "Software + cloud track", text: "Public projects and labs shaped by experience with real operational pressure." },
    ],
  },
  projects: {
    eyebrow: "builds.index",
    title: "Proof, progress, and the next build.",
    intro:
      "A transparent portfolio of shipped projects, awarded academic work, active labs, and the next case study to build.",
    cards: [
      { label: "Shipped", title: "Mlondolozi.dev + MLO.OS", text: "React, TypeScript, Vite, animation, 3D rendering, SEO, and deployment configuration." },
      { label: "Awarded", title: "Government Services App", text: "React Native, Firebase, REST APIs, Stripe, and 2nd place in the Boxfusion Graduate Competition." },
      { label: "Next proof", title: "LIMS integration case study", text: "A planned simulator covering API contracts, validation, error handling, audit trails, and support runbooks." },
    ],
  },
  labware: {
    eyebrow: "enterprise.lims",
    title: "Laboratory systems, made usable.",
    intro:
      "LabWare experience gave me a grounded view of software: it must work for people, survive complexity, and respect the process around it.",
    cards: [
      { label: "Configure", title: "Workflows", text: "Translate laboratory processes into understandable, maintainable system behavior." },
      { label: "Enable", title: "Training & support", text: "Help teams adopt systems confidently and solve issues calmly." },
      { label: "Improve", title: "Continuous refinement", text: "Find friction, clarify requirements, and make operations more dependable." },
    ],
  },
  integration: {
    eyebrow: "systems.connect",
    title: "The value often lives between systems.",
    intro:
      "Integration support combines data mapping, validation, troubleshooting, documentation, and operational judgment where platforms meet.",
    cards: [
      { label: "Data", title: "SQL & mapping", text: "Model, transform, validate, and move information with intent." },
      { label: "Interfaces", title: "APIs & services", text: "Support clear contracts between products, teams, instruments, and workflows." },
      { label: "Reliability", title: "Supportability", text: "Design for testing, diagnosis, recovery, documentation, and the people supporting production." },
    ],
  },
  telemat: {
    eyebrow: "venture.active",
    title: "Telemat IQ",
    intro:
      "An emerging intelligent fleet platform turning location and vehicle data into decision-ready operational visibility.",
    cards: [
      { label: "Signal", title: "GPS hardware", text: "Capture movement, events, and asset health from the field." },
      { label: "Intelligence", title: "Fleet analytics", text: "Transform raw telemetry into meaningful operational patterns." },
      { label: "Outcome", title: "Better decisions", text: "Give operators a clearer, faster view of what needs attention." },
    ],
  },
  contact: {
    eyebrow: "connection.open",
    title: "Build the next useful thing.",
    intro:
      "Open to computer system validation, enterprise application support, API and integration support, junior full-stack, cloud, and DevOps opportunities.",
    cards: [
      { label: "Email", title: "hello@mlondolozi.dev", text: "The best route for project detail and consulting enquiries." },
      { label: "Location", title: "Johannesburg / Remote", text: "Working across South Africa and distributed teams." },
      { label: "Status", title: "Open to the next role", text: "Ready to bring enterprise depth into a broader engineering environment." },
    ],
  },
};
