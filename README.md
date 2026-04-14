# CPU Scheduling Simulator (OS Project)

Implements and compares:
- **FCFS**
- **SJF**: non-preemptive and preemptive (**SRTF**)
- **Priority**: non-preemptive and preemptive

Tracks:
- **Waiting time (WT)**
- **Turnaround time (TAT)**
- **Response time (RT)**

Also renders a **Gantt chart** timeline (including CPU **IDLE** gaps).

## Steps to run (Windows / PowerShell) — React JS (no TypeScript)

1. Open a terminal in this folder:
   - `C:\Users\DELL\Desktop\os project\cpu-scheduling-simulator`
2. Install dependencies:

```bash
npm install
```

3. Start the app:

```bash
npm run dev
```

4. Open the URL shown in the terminal (usually `http://127.0.0.1:5173/`).

## How to use

1. Enter processes with:
   - PID, Arrival Time, Burst Time, Priority
2. Choose:
   - Algorithm: FCFS / SJF / Priority
   - Preemptive: toggle ON/OFF (disabled for FCFS)
3. View:
   - Gantt chart
   - Per-process metrics + averages

## Notes / assumptions

- **Time unit**: discrete integer units.
- **Priority**: smaller number = higher priority (1 runs before 2).
- **Ties**: resolved stably (arrival time, then PID) to keep output deterministic.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
