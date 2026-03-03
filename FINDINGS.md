# Spark Studio - Analyse & Bevindingen

**Analyse datum**: 3 Maart 2026
**Status**: POC (Proof of Concept) → Production-Ready
**Laatst bijgewerkt**: 3 Maart 2026

## 🎯 Project Scope & Decisions (AFGESPROKEN)

### Vision

**"Lightweight Flash variant"** - Proof of concept dat web tech Flash-like animaties kan doen.

### MVP Goal

📍 **Single moving rectangle**: x=0 → x=400, export to MP4 ✅

### Decisions (Fixed)

| Aspect               | Beslissing                                         | Toelichting                                        |
| -------------------- | -------------------------------------------------- | -------------------------------------------------- |
| **Eindproduct**      | Lightweight Flash variant                          | Niet volledig Flash-equivalent, POC afronden       |
| **Project type**     | Personal learning                                  | Niet voor production-gebruik                       |
| **Features**         | Fix incomplete first                               | animation → property panel → layers → video export |
| **Browser**          | Chrome (later Electron)                            | WebM voldoende; MP4 later als nodig                |
| **Shapes**           | Rect, Circle, Text (Line later)                    | Prioriteit: basics werkend                         |
| **Animatable props** | Alles (x, y, width, height, fill, opacity, stroke) | Stap voor stap implementeren                       |
| **Data model**       | Okay to refactor to nested                         | `layers[].shapes[].keyframes[]` later              |
| **Undo/Redo**        | Optional (Phase 2)                                 | Eerst animation werkend                            |
| **Tech stack**       | Vanilla JS (no TS yet)                             | TypeScript later als nodig                         |
| **Testing**          | Not now                                            | Eerst POC afronden                                 |
| **Build pipeline**   | Not now                                            | Minify/svgo later                                  |
| **Users**            | Single-user only                                   | No cloud, no collaboration                         |

### Assumptions Confirmed ✅

- ✅ Keyframe animations voor all shapes = critical next step
- ✅ UI & data logic need parallel work (ikke kan wachten)
- ✅ Single-user browser app is genoeg

---

## � Current Sprint (Week 1): Get Animation Working

**Goal**: Rectangle moves x=0→x=400, export to MP4 ✅

### Step-by-Step Tasks

**Step 1: Test Inter.js Calculation**

- [ ] Open index.html in Chrome
- [ ] Console: `new Model().init()`
- [ ] Console: `const inter = new Inter(); inter.interpolateNumber(0, 400, 0.5);`
- [ ] Expected: `200`
- [ ] Report if working/broken in FINDINGS.md

**Step 2: Create Test Project**

- [ ] Create `examples/project/simple-move.json`
- [ ] 2 keyframes: Frame 0 (x=0), Frame 120 (x=400)
- [ ] Load in browser via File > Open

**Step 3: Debug Canvas Animation**

- [ ] Load simple-move.json
- [ ] Click Play button
- [ ] Watch: Does rect move smoothly on canvas?
- [ ] Report: YES/NO in console.log

**Step 4: Test Video Export**

- [ ] Click ExportMovie
- [ ] Start recording → Play animation → Stop
- [ ] Download WebM file
- [ ] Can VLC play it? Report: YES/NO

**Step 5: If All Working**

- ✅ Move to Sprint 2: Property Panel Reality

**Step 6: If Any Failed**

- 🔴 Debug specific component
- 🔴 Document error in FINDINGS.md
- 🔴 Request AI help with console output

### Success Criteria

- [ ] Rect animates on canvas
- [ ] Video exports (WebM acceptable)
- [ ] All 4 steps logged in FINDINGS.md

---

## �📊 Executive Summary

Spark Studio is een **ambitieus web-gebaseerd animatie project** met solide fundamenten maar onvolledig geïmplementeerde features. De architectuur is clean (Singleton pattern, modular classes) maar veel kernfunctionaliteit staat half af.

### Projectvisioen

> _Flash/Spark-achtige animatie tool voor web, gebruikmakend van SVG voor vectorafbeeldingen en Canvas voor rendering/export._

### Huidig bereik

- ✅ SVG canvas rendering
- ✅ Tools toolbar (select, rect, circle, line, text, zoom)
- ✅ Project file I/O (JSON, SVG import)
- ✅ Timeline UI + video export (WebM)
- ❌ Animatie keyframes (incomplete)
- ❌ Layer management (incomplete)
- ❌ Property animations (stub)

---

## 🏗️ Architectuur-Analyse

### Sterke Punten

#### 1. **Singleton Pattern (Goed doordacht)**

```javascript
// Model.js initialiseert alle components
new Model().init();
// ↓ Initialiseert:
(Canvas,
  CanvasMenu,
  Timeline,
  Properties,
  Tools,
  Shortcuts,
  Layout,
  Menu,
  ExportVideo,
  Focus);
```

**Voordeel**: Centrale initialisatie, voorkomen van dubbele instantie
**Voorzichtigheid**: Kan tight coupling creëren; moeilijker voor unit testen

#### 2. **Modulaire Class Structure**

Elk UI-component has its own class:

- `Canvas` - SVG rendering
- `Timeline` - Timeline UI
- `Properties` - Property panel
- `Tools` - Tool selection
- etc.

**Voordeel**: Scheiding van concerns
**Probleem**: Soms onduidelijke verantwoordelijkheden (wie updated ProjectVars?)

#### 3. **Inter-Class (Animation Interpolation)**

```javascript
// inter.js handelt animation frames
interpolateColor(color1, color2, progress);
interpolateNumber(num1, num2, progress);
// Generate tussenframes
```

**Voordeel**: Clean separation van calc vs rendering
**Probleem**: Niet alle property types geïmplementeerd

#### 4. **Video Export Pipeline**

```
Timeline → Inter (bereken frames) → Canvas (render) → MediaRecorder → WebM
```

**Voordeel**: Proper 3-stage pipeline
**Probleem**: Metadata injection onvolledig

### Zwakke Punten

#### 1. **Incompleet Keyframe System**

```javascript
// TODO in export.js:
"[ ] check for motion object";
"[ ] check export for color object";
```

→ Keyframes kunnen opgeslagen maar animaties niet volledig verwerkt

#### 2. **Property Panel is Stub**

```html
<div id="propertiesDocument">
  <strong>This is the first item's accordion body.</strong>
  Dummy content...
</div>
```

→ Properties kunnen niet wijzigen shape attributes real-time

#### 3. **Layer Management Ontbreekt**

```html
<tbody id="timelineTableBody">
  <!-- Layer rows will be dynamically added here -->
</tbody>
```

→ Table exists maar add/delete/reorder functionaliteit absent

#### 4. **Timeline-Canvas Synchronisatie**

- Timeline tracks frames (table rows)
- Canvas renders SVG
- **Probleem**: Geen bidirectional sync; changing timeline row doesn't update canvas

#### 5. **Hardcoded IDs en Event Listeners**

```javascript
document.getElementById("timelineFrameRate");
document.getElementById("timeLineTotalFrames");
```

→ Werkt maar geen abstract event system; moeilijk om patterns te hergebruiken

---

## 💾 Data Model Analyse

### ProjectVars Structure

```javascript
{
    width: 600,                    // Canvas width
    height: 400,                   // Canvas height
    frameRate: 24,                 // fps
    frameLength: 120,              // total frames
    time: 5,                       // duration seconds
    frames: [                      // Key frames
        {
            frameNum: 0,
            svgContent: "<svg>...</svg>",
            properties: { /* per-shape data */ }
        }
    ],
    calculated: []                 // Inter-interpolated frames (empty)
}
```

### Problemen

1. **frames array is flat** - laag-informatie gemengd met frame info
2. **svgContent is string** - difficult om specifieke shapes te queriën
3. **calculated[] nooit populate** - Inter calculations happen but not stored
4. **No undo stack** - geen historisches

---

## 🎨 Feature-by-Feature Assessment

| Feature                    | Status         | Notes                                        |
| -------------------------- | -------------- | -------------------------------------------- |
| Draw Rect/Circle/Text/Line | ✅ Working     | Via canvas.js `drawShape()`                  |
| Select Tool                | ⚠️ Partial     | Identifies shape maar no real editing        |
| Zoom                       | ✅ Working     | In/out/fit-to-screen function                |
| Save/Open Project          | ✅ Working     | JSON serialization via menu.js               |
| Import SVG                 | ✅ Working     | Via `importSVG()` in menu.js                 |
| Export WebM                | ✅ Working     | Via ExportVideo; some codec issues           |
| Timeline UI                | ⚠️ Partial     | Table renders, no keyframe visuals           |
| Keyframes                  | ❌ Incomplete  | Can set frames maar interpolation incomplete |
| Layer Management           | ❌ Incomplete  | No add/delete/reorder                        |
| Property Animations        | ❌ Incomplete  | No color/position/opacity anim               |
| Undo/Redo                  | ❌ Not-started | Menu items exist; no logic                   |
| Bezier Curves              | ❌ Not-started | No curve editor                              |
| Preview                    | ⚠️ Partial     | Play button exists; playback may be buggy    |
| Color Interpolation        | ⚠️ Partial     | ColorConverter exists; not actively used     |

---

## 🔧 Technische Schulden

### Hoog Prioriteit

1. **Keyframe interpolation** - Core animation engine onvolledig
2. **Property panel binding** - UI shows maar updates ProjectVars niet
3. **Layer array structure** - Huidge flat array moet nested worden
4. **Timeline sync** - Frame selection = canvas update?

### Middel Prioriteit

5. **Performance** - Geen optimization voor 100+ frames
6. **Error handling** - Minimal try/catch blocks
7. **Browser compat** - WebM codec varies; fallback nodig
8. **Metadata in export** - TODO.md beschrijft maar not implemented

### Laag Prioriteit

9. **TypeScript migration** - huidence vanilla JS; Types help
10. **Build optimization** - SVG compression (svgo) in node/ niet geïntegreerd
11. **Documentation** - Inline comments sparse
12. **Testing** - Geen test framework setup

---

## 🚀 Development Roadmap

### Phase 1: Animation Proof of Concept (1-2 weken)

**Goal**: Single rectangle moves on canvas, export to MP4

**Priority Order**:

1. ✅ **Test Inter.js** - Does interpolateNumber work?
2. ✅ **Debug Canvas** - Does animation render on canvas?
3. ✅ **Fix video export** - WebM/MP4 codec issues
4. Property panel binding (second, not blocking)
5. Layer management (can wait)

### Phase 2: Property & Layer System (2-3 weken)

**Goal**: Edit shape properties, manage layers

1. Property panel binding (x, y, width, height, fill)
2. Layer add/delete basic
3. Timeline real-time updates
4. Opacity & color animations

### Phase 3: Polish & Extend (2 weken)

**Goal**: Multiple animations, better UX

1. Bezier curve editor (optional)
2. Easing functions
3. Undo/Redo
4. Performance optimization

---

## 🎯 Quick Start for Continuation

### Immediate Next Steps (This Week)

1. **Read & Understand**
   - [ ] Read CLAUDE.md (architecture overview)
   - [ ] Read FINDINGS.md (this doc)
   - [ ] Explore js/ folder structure
   - [ ] Test existing features in browser

2. **Set Up Dev Environment**

   ```bash
   cd /Users/matthijskamstra/Documents/GIT/spark-studio
   npm --prefix node install
   npm --prefix node run minify  # Test build pipeline
   # Open index.html in browser
   ```

3. **Debug Setup**
   - Open Developer Tools (F12)
   - Set breakpoints in `js/model/model.js`
   - Watch `ProjectVars` in console
   - Test: `new Inter().interpolateNumber(0, 100, 0.5)` → 50

4. **Pick First Task**
   **Recommended**: Implement basic property binding
   ```javascript
   // In Property.js, bind inputs to ProjectVars
   document.getElementById("propertyWidth").addEventListener("change", (e) => {
     ProjectVars.width = parseInt(e.target.value);
     new Canvas().redraw();
   });
   ```

### Where Each Piece Lives

| What               | File                             | Status        |
| ------------------ | -------------------------------- | ------------- |
| App initialization | `js/model/model.js`              | ✅ Solid      |
| SVG rendering      | `js/canvas.js`                   | ✅ Works      |
| Animation calc     | `js/inter.js`                    | ⚠️ Needs work |
| Video export       | `js/export-video.js`             | ⚠️ Partial    |
| Timeline UI        | `js/timeline.js`                 | ⚠️ Incomplete |
| File I/O           | `js/menu.js`                     | ✅ Works      |
| DOM interactions   | `js/shortcuts.js`, `js/tools.js` | ✅ Works      |

---

## 📚 Resources & References

### Browser APIs Used

- **SVG**: Vector drawing
- **Canvas API**: 2D rendering & export
- **MediaRecorder**: WebM video recording
- **LocalStorage**: Project persistence
- **FileReader**: File import

### Libraries

- **Bootstrap 5.3**: UI/layout
- **FontAwesome**: Icons
- **svgo** (node build): SVG optimization
- **terser** (node build): JS minification

### Learning Materials

- SVG Docs: https://developer.mozilla.org/en-US/docs/Web/SVG
- Canvas 2D: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- MediaRecorder: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder

---

## ✅ Validation Checklist

Before claiming a feature is "done":

- [ ] Feature works in Chrome & Firefox
- [ ] Persists to LocalStorage
- [ ] Error handling for edge cases
- [ ] Console.log debug messages (if IS_DEBUG=true)
- [ ] Updated README.md & TODO.md
- [ ] No breaking changes to Model API
- [ ] Performance reasonable for +100 items
- [ ] Keyboard shortcut registered (if applicable)

---

## 🎓 Key Learnings

1. **SVG > Raster for Animation**: Easier to manipulate, scale, animate vectors
2. **Canvas for Rendering**: SVG → Canvas conversion allows efficient video export
3. **Frame-based > Physics**: Keyframe system simpler than physics engine
4. **Singleton Useful but Risky**: Prevents multiple instances; harder to test
5. **Web Audio/Video APIs Mature**: WebM export actually works well

---

## 🤔 Open Questions to Resolve

1. **Performance at scale**: What's max frames/layers before slowdown?
2. **Target browsers**: Must support IE11 or modern only?
3. **Export formats**: Keep WebM or add MP4/GIF support?
4. **Shape types**: Limit to rect/circle/text or add paths/bezier?
5. **Collaboration**: Single-user or multi-user sync (future)?

---

## 📝 Conclusion

**Spark Studio is a solid foundation** with good architecture that **needs focused effort to complete core animation features**. The hard parts (SVG rendering, video export) are done. The missing parts (keyframe UI, layer management, property binding) are achievable with steady work.

**Recommended approach**: Pick Phase 1 tasks one-by-one, test thoroughly, then move to Phase 2. Don't try to do everything at once (previous Copilot attempts got overwhelmed).

**Time estimate**: 6-8 weeks for Phase 1+2 with disciplined focus.

---

**Document created**: 3 Maart 2026
**Next review date**: After Phase 1 completion
