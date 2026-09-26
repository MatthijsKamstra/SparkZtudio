# ⚡️ Spark Studio

**Lightweight Flash variant** - Web-based vector animation tool.

## 🎯 Vision

Proof of concept: Can web tech replicate Flash-like animation workflow?

**MVP Goal**: Single rectangle animates x=0→x=400, export as MP4 ✅

## 🎬 Current Status

| Feature          | Status | Notes                                                        |
| ---------------- | ------ | ------------------------------------------------------------ |
| SVG import       | ✅     | Top-level elements / Inkscape layers become layers           |
| Layers           | ✅     | Add, delete, reorder, rename, hide, lock, distribute         |
| Keyframes        | ✅     | F6 keyframe, F7 blank keyframe, Shift+F6 clear               |
| Motion tween     | ✅     | x, y, scale, rotation, alpha, with ease in/out               |
| Stage editing    | ✅     | Select, drag, arrow-key nudge, rect/oval/line/text drawing   |
| Property panel   | ✅     | Selected layer at current frame + document settings          |
| Undo/redo        | ✅     | Snapshot based, 100 steps                                    |
| Video export     | ✅     | Frame-exact MP4 (H.264) or WebM (VP9/VP8) via WebCodecs      |
| Shape tween      | 🚫     | Only transforms animate; colour/path morphing not yet        |
| Desktop app      | 🚫     | Browser first; Electron/Tauri wrapper later                  |

## 🚀 Getting Started

### 1. Run it

ES modules need a web server (opening `index.html` via `file://` does not work):

```bash
cd spark-studio
python3 -m http.server 8000
# open http://localhost:8000 in Chrome, Edge, Firefox or Safari
```

No build step. Bootstrap and the video encoder library ([Mediabunny](https://mediabunny.dev)) load from a CDN.

### 2. Animate an SVG

1. **File > Import** an `.svg`. Every top-level element (or Inkscape layer) becomes a timeline layer.
2. Everything on one layer? Select it and use **Layer > Distribute to Layers**.
3. Click a frame in the timeline (e.g. frame 24) and drag the object on the stage. A keyframe is created and the span before it becomes a motion tween.
4. Fine-tune X/Y/scale/rotation/alpha and easing in the **Properties** panel.
5. **Enter** plays, **,** and **.** step frames.
6. **File > Save** writes a `.json` project; **File > Export Movie** renders MP4 or WebM.

The app starts with a demo project (a box tweening from x=0 to x=400). Old v1 project files (`frames[]` with SVG snapshots) are converted on open.

### Shortcuts

| Key                | Action                         |
| ------------------ | ------------------------------ |
| V / R / O / N / T / Z | Select, rectangle, oval, line, text, zoom |
| F6 / F7 / Shift+F6 | Keyframe / blank keyframe / clear keyframe |
| Enter              | Play / stop                    |
| , / . / Home / End | Previous / next / first / last frame |
| Arrows (+Shift)    | Nudge selected layer 1 (10) px |
| Backspace          | Delete layer                   |
| ⌘Z / ⇧⌘Z          | Undo / redo                    |
| ⌘S / ⌘O / ⌘I      | Save / open / import SVG       |
| ⌘E / ⇧⌘E          | Export movie / export PNG frame |

## 📁 Structure

```
js/
├── model/project.js       # Project format v2: layers, keyframes, tweening, SVG import, v1 conversion
├── model/model.js         # App state (singleton): selection, current frame, undo, playback
├── canvas.js              # Stage: renders a frame, select/drag, drawing tools
├── timeline.js            # Layer rows × frame columns, keyframes, playhead
├── properties.js          # Property inspector
├── export-video.js        # WebCodecs + Mediabunny video export
├── export.js              # Save JSON, export PNG
├── menu.js / shortcuts.js / tools.js / canvas-menu.js
└── inter.js, defaults.js, utils/color-converter.js   # v1 engine, no longer used
```

## 📖 Documentation

- **[FINDINGS.md](FINDINGS.md)** - Complete analysis & roadmap
- **[CLAUDE.md](CLAUDE.md)** - Architecture & decisions
- **[gitlab-copilot.md](gitlab-copilot.md)** - CI/CD & branching

## 🔄 Development Workflow

### Current Sprint: Animation POC (Week 1)

**Goal**: Rectangle animates on canvas + exports to video

Steps:

1. Test Inter.js interpolation
2. Load simple-move.json project
3. Click Play - check canvas animation
4. ExportMovie - verify WebM downloads
5. Report results in FINDINGS.md

See FINDINGS.md for complete Phase 1-3 roadmap.

## ⚙️ Key Design Decisions

| Decision              | Why                  | Trade-off                |
| --------------------- | -------------------- | ------------------------ |
| SVG for shapes        | Scalable, animatable | No pixel-perfect paint   |
| Canvas for export     | Consistent rendering | Browser codec varies     |
| Singleton pattern     | Centralized state    | Harder to unit test      |
| Frame-based animation | Simpler than physics | Needs explicit keyframes |
| WebM for video        | Browser support      | Not MP4 yet              |
| Vanilla JS            | Simple start         | Will add TS later        |

## 🐛 Known Issues

1. Only transforms tween (position, scale, rotation, alpha). Fill/stroke colour and path shape tweens are not implemented.
2. Converting v1 projects keeps position and size changes, not colour changes.
3. External fonts and `<image href="https://...">` do not render in exported video (SVG-as-image cannot load external resources). Embed images as data URIs.
4. The VS Code integrated browser cannot preview WebM; the files themselves are valid.

See TODO.md for complete list.

## 📚 Resources

- **MDN SVG**: https://mdn.io/svg
- **Canvas API**: https://mdn.io/canvas
- **MediaRecorder**: https://mdn.io/mediarecorder
- **Bootstrap 5**: https://getbootstrap.com

## 🙏 Notes

- Started with GitHub Copilot assistance
- Now documented for AI-assisted continuation
- Learned: Scope management is critical
- Next: Disciplined Phase 1 execution

---

**Last Updated**: 3 March 2026
**Next Milestone**: Animation working (Week 1)
