import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";

const isExperience =
  window.location.pathname.startsWith("/experience") ||
  window.location.hostname.startsWith("experience.");

const Page = isExperience
  ? lazy(() => import("./experience/ExperienceApp").then((module) => ({ default: module.ExperienceApp })))
  : lazy(() => import("./legacy/LegacyPortfolio"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense
      fallback={
        <div
          style={{
            display: "grid",
            minHeight: "100vh",
            placeItems: "center",
            color: "#bdeff5",
            background: "#030506",
            fontFamily: "monospace",
            letterSpacing: "0.12em",
          }}
        >
          INITIALIZING...
        </div>
      }
    >
      <Page />
    </Suspense>
  </StrictMode>,
);
