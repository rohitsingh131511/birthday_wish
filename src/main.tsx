import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Bootstrap 5.3 fluid grid + flex utilities (grid-only build keeps it light and
// conflict-free next to Tailwind's utility layer).
import "bootstrap/dist/css/bootstrap-grid.min.css";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
