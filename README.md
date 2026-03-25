# Avida Security: Annotation Workspace 🎯

A high-performance, web-based video and image annotation tool built for security analysts. Designed to generate strict, ML-ready telemetry data with zero-latency canvas rendering.

<img width="1436" height="804" alt="image" src="https://github.com/user-attachments/assets/660f117c-d7d8-4ef6-8b78-2655c6a6c2e7" />


##  Quick Start (How to Run Locally)

### Option A: Containerized (Docker / Podman) - _Recommended_

The project includes an optimized multi-stage `Dockerfile` (Node builder -> Nginx Alpine).

**The Business Value:** "Works on my machine" is a junior excuse. This delivers an immutable, deployable artifact that guarantees environment parity across your infrastructure.

```bash
# Build the image
docker build -t avida-workspace .

# Run the container (Available at http://localhost:8080)
docker run -p 8080:80 avida-workspace
```

### Option B: Local Node Environment

```bash
# Strict installation of lockfile dependencies
npm ci

# Start the Vite development server
npm run dev
```

---

##  Key Business-Value Features

1. **Relative Coordinate Math (ML Data Integrity):** Bounding boxes are stored as percentages, ensuring annotations scale perfectly if ML models train on downscaled footage.(Assuming the fact Avida will be integrating with AI models in the future )
2. **Power-User Ergonomics:** Analysts hate moving their mouse to a toolbar 500 times a day. Universal hotkeys (`Space` for playback, `V` for Select, `Cmd+Z` for Undo, `1/2/3` for threat states) drastically reduce annotation time and eliminate mouse fatigue.
3. **High-Performance Rendering:** Speed is critical when analysts are reviewing hours of 4K footage. By decoupling state management (Zustand) from a single-element HTML5 Canvas (React-Konva), the app bypasses DOM-node rendering lag, guaranteeing buttery-smooth 60fps performance even with 50+ active annotations.
4. **Group Manipulation:** Custom drag-math allows batch moving of multiple selected nodes simultaneously with a single O(1) history state update.
5. **Continuous Integration (CI/CD):** A `.github/workflows/main.yml` pipeline runs `npm run lint` and `npm run build` on every push. It proves a DevOps mindset and ensures code merges safely into a production pipeline before deployment.
6. **Minimalist UI, High-Fidelity UX:** A cluttered dashboard causes cognitive overload. I designed a deliberately minimal, tactical UI that hides deep functional complexity. The UI is simple, but the UX handles advanced workflows—like multi-node batch translation, invisible bounding-box correction for paths, and dynamic state-scaling—entirely invisibly to the operator.

---

##  The "Ingestion Contract" (Data Schema)

I designed the JSON export schema to be easily ingestible by a Python or C++ backend. The flat structure avoids deep nesting, allowing for rapid batch inserts into relational databases like MariaDB (e.g., using `INSERT ... ON DUPLICATE KEY UPDATE` for annotation state changes).

Furthermore, the payloads are lightweight and strictly typed enough to be broadcasted over WebSockets for real-time collaborative annotation across multiple analyst dashboards.

---

## Architecture & Core Libraries

- **Vite + React**: Lightning-fast HMR and optimized production bundling.
- **React-Konva**: HTML5 Canvas wrapper chosen specifically to solve the primary bottleneck of web-based annotation: DOM-node rendering lag.
- **Zustand**: State management decoupled from the React main thread to prevent expensive full-tree re-renders during high-frequency drag events.
- **Tailwind CSS**: Utility-first styling for the tactical, dark or light modes HUD.
- **Vitest**: Targeted unit testing for pure mathematical business logic, ensuring coordinate calculation integrity without brittle UI tests.

---

##  Challenges Faced

- **Canvas Group Dragging:** By default, Konva `<Transformer>` handles scaling/rotating groups natively, but _not_ translation (dragging) for decoupled nodes. **Solution:** I implemented a custom batch-update algorithm using `useRef` to track initial drag coordinates and map the delta `(dx/dy)` across all selected items, saving them to Zustand in a single O(1) history update.
- **Zero-Dimension Bounding Box Bugs:** When implementing freehand drawing, passing `width: 0` to a Konva `<Line>` caused the internal engine to hide the shape, making it un-selectable. **Solution:** Carefully destructured and stripped dimension props before passing them to path-based nodes.
- **React Array Reference Leaks:** Fast freehand drawing caused Zustand's history stack to drop frames because React was clearing the local `currentLine` array reference before Zustand committed it. Fixed via strict shallow copying (`[...currentLine]`).

---

## Intentional Trade-offs & Limitations

To deliver a highly polished MVP within the time constraints, I made the following intentional trade-offs:

1. **Test Coverage:** I implemented a CI pipeline and Vitest, but I intentionally only wrote unit tests for the pure mathematical functions (`coordinates.ts`). Testing canvas UI interactions via Jest/RTL is notoriously brittle and a poor ROI for an MVP.
2. **Mobile Responsiveness:** Security video annotation is inherently a desktop-class, high-precision task. I optimized the UI for 1080p+ desktop displays rather than spending time building a collapsed mobile "hamburger" menu.
3. **Local Storage / Backend Sync:** Currently, data exports as a local `.json` file. Given more time, I would wire the Zustand store directly to an Avida/Panther backend API using React Query or an RTK Query equivalent for real-time cloud sync.

---

## AI Assistance Documentation

In the spirit of transparency and modern engineering workflows, I utilized LLMs (Large Language Models) as an accelerant during this build:

- **What was generated:** Scaffolding the initial Vite boilerplate, writing the raw SVG path data for complex FontAwesome icons, and generating the baseline syntax for the multi-stage Dockerfile and GitHub Actions YAML.
- **How it was validated/modified:** I used AI primarily as an advanced autocomplete and syntax reference. When encountering the Konva group-dragging limitation, I bounced algorithmic ideas off the LLM, but ultimately wrote and refined the `useRef` delta-mapping logic manually to ensure it integrated correctly with my custom Zustand history stack. All architectural decisions (Zustand over Redux, relative ML coordinates over absolute pixels) were entirely human-led based on the product requirements.

---

_Developed for the Avida Engineering Team._
