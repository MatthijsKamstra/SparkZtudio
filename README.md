# ⚡️ Spark Studio

**Lightweight Flash variant** - Web-based vector animation tool.

## 🎯 Vision

Proof of concept: Can web tech replicate Flash-like animation workflow?

**MVP Goal**: Single rectangle animates x=0→x=400, export as MP4 ✅

## 🎬 Current Status

| Feature          | Status | Notes                            |
| ---------------- | ------ | -------------------------------- |
| SVG canvas       | ✅     | Draw shapes working              |
| Tools            | ✅     | Rect, circle, text, zoom         |
| File I/O         | ✅     | Save/load JSON projects          |
| Animation        | 🔧     | WIP - keyframe system incomplete |
| Video export     | 🔧     | WebM works; MP4 codec issues     |
| Property panel   | 🚫     | UI stub, no binding              |
| Layer management | 🚫     | No add/delete/reorder            |

## 🚀 Getting Started

### 1. Open in Browser

```bash
cd /Users/matthijskamstra/Documents/GIT/spark-studio
# Open index.html in Chrome
```

### 2. Create Animation

- **File** > New
- Draw rectangle with **Rect Tool**
- Add 2 keyframes to timeline (frame 0 & 120)
- Adjust position in second keyframe
- **Canvas > Play** to preview
- **File > ExportMovie** for WebM

### 3. Load Example

- **File** > Open
- Select `examples/project/simple-move.json`
- Click Play

## 📁 Structure

```
js/
├── model/model.js         # App state (Singleton)
├── canvas.js              # SVG rendering
├── inter.js               # Animation interpolation ⭐
├── export-video.js        # Video export ⭐
├── timeline.js            # Timeline UI
├── properties.js          # Property panel (WIP)
├── menu.js                # File operations
├── tools.js               # Drawing tools
└── ...other classes

css/
├── style.css
├── canvas.css
├── resize-layout.css
└── nested.css

examples/project/          # Sample animations
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

1. **Inter.js**: `calculateFrames()` incomplete - check console
2. **Properties**: Panel is stub - no real binding
3. **WebM codec**: Varies across browsers
4. **Layer system**: Table exists but no logic
5. **Undo/Redo**: UI exists but no history stack

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
