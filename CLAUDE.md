# CLAUDE.md - AI Copilot Instructies

Documentatie voor AI assistenten die aan Spark Studio werken.

## 🎯 Projectdoel

**Spark Studio** is een web-gebaseerde vector animatie tool - een Flash-achtige applicatie waarin gebruikers:

- SVG shapes (rechthoeken, cirkels, tekst, lijnen) op een canvas kunnen tekenen
- Keyframe-gebaseerde animaties kunnen maken
- Projecten kunnen opslaan/laden als JSON
- Animaties kunnen exporteren naar WebM/MP4 video

## 🏗️ Architectuur

### Slim Singleton Pattern

Alle major components zijn singletons die via de `Model` class worden geïnitialiseerd:

```javascript
new Model().init(); // Initializes: Canvas, Menu, Timeline, Properties, Tools, etc.
```

### Core Classes

- **Model** (`js/model/model.js`) - App state & initialization hub
- **Canvas** (`js/canvas.js`) - SVG rendering & shape management
- **Timeline** (`js/timeline.js`) - Frame & layer management UI
- **Inter** (`js/inter.js`) - Animation interpolation engine
- **ExportVideo** (`js/export-video.js`) - WebM/MP4 video export
- **Properties** (`js/properties.js`) - Property panel (WIP)
- **Menu** (`js/menu.js`) - File operations (open, save, import)

### Key Data Structure

```javascript
export let ProjectVars = {
  width: 600,
  height: 400,
  frameRate: 24,
  frameLength: 120, // 5 sec @ 24fps
  time: 5,
  frames: [], // Array van keyframes met SVG content
  calculated: [], // Inter-geïnterpoleerde frames
};
```

## ⚠️ Huidige Status & Problemen

### ✅ Werkend

- [x] SVG canvas rendering
- [x] Basis shapes (rect, circle, text, line) tekenen
- [x] File open/save/import (JSON, SVG)
- [x] Keyboard shortcuts
- [x] Timeline table UI
- [x] Video export (WebM)
- [x] Zoom functionaliteit
- [x] LocalStorage persistentie

### 🚧 Onvolledig/Buggy

- [ ] **Keyframe system** - Veel TODO's in export.js, inter.js
- [ ] **Layer management** - Tabel bestaat, maar functionaliteit ontbreekt
- [ ] **Shape properties** - Width, height, fill, stroke, opacity animaties
- [ ] **Property panel** - Accordion gedefinieerd maar niet gevuld met controls
- [ ] **Animation timeline** - Geen visual feedback van keyframes in timeline
- [ ] **Undo/Redo** - Menu items bestaan, functionaliteit ontbreekt
- [ ] **Motion/Bezier** - Geen curve editor
- [ ] **Color interpolation** - Color converter aanwezig, niet direct gebruikt

### 🐛 Bekende Architectural Issues

1. **Cross-talk tussen classes** - Model.init() initialiseert alles via console.info, geen echte dependency injection
2. **Incomplete Property binding** - Property panel heeft dummy content
3. **Timeline-Canvas sync** - Onvoldoende synchronisatie tussen timeline beweging en canvas updates
4. **Export validation** - TODO: "check for motion object, check export for color object"

## 📋 Werkflow voor Verbetering

### Phase 1: Stabilisatie (Priority)

1. Maak keyframe system compleet voor alle shapes
2. Implementeer proper layer add/delete/reorder
3. Bind properties panel aan shape properties
4. Fix property animations in Inter class

### Phase 2: Core Features

1. Implementeer Bezier curve editor
2. Voeg easing/timing functions toe
3. Verbeter timeline UI met keyframe visuals
4. Implementeer undo/redo

### Phase 3: Polish

1. Performance optimalisatie
2. Improved UX (tooltips, help)
3. Export metadata in video
4. Project templates

## 🔧 Best Practices voor Aanpassingen

### Naming Conventions

- Classes: PascalCase (Canvas, Timeline, Properties)
- Methods: camelCase (initTimeline, updateProperty)
- IDs in HTML: kebab-case (timeline-wrapper, svg-container)
- Variables: camelCase (isPlaying, frameIndex)

### Adding Features

1. **New Shape Type**: Voeg shape class toe + entry in tools.js
2. **New Property**: Update PropertyVars, Property.js, export.js interpolation
3. **New Animation Type**: Update Inter.js interpolation logic
4. **UI Changes**: Altijd eerst structuur in HTML, dan CSS, dan JS

### Debug Mode

Alle classes hebben `IS_DEBUG = true` - geeft console output. Zet dit uit voor production.

### LocalStorage

`LocalStorageHandler` (`js/local-storage.js`) handelt project persistentie - vergeet niet dit aan te roepen na data wijzigingen.

## 👀 Waar Let Op

### ExportVideo Complexity

- Gebruikt `MediaRecorder` API (browser-gebaseerd)
- Canvas context 2D rendering van SVG
- WebM codec support is inconsistent (check `isCodecSupportedList()`)
- Metadata injection code in TODO.md is incomplete

### Timeline Performance

- Table groeit met aantal frames × aantal layers
- Geen virtualization - kan traag worden bij 100+ frames
- Later: implementeer virtual scrolling

### SVG Color Handling

- `ColorConverter` (`js/utils/color-converter.js`) converteert CSS naar hex
- Somige legacy color names (tomato, etc) worden gehandeld
- Border cases: rgb(), hsl() formats

## 📁 Bestandsstructuur Overzicht

```
js/
├── model/
│   └── model.js          # App state & init
├── canvas.js             # SVG rendering
├── timeline.js           # Timeline UI
├── inter.js              # Animation engine ⭐
├── export-video.js       # Video export ⭐
├── export.js             # Project export
├── properties.js         # Property panel (WIP)
├── menu.js               # File menu
├── tools.js              # Drawing tools
├── shortcuts.js          # Keyboard shortcuts
├── layout.js             # Resize/layout
├── focus.js              # Focus management
├── local-storage.js      # Persistentie
└── utils/
    └── color-converter.js
```

## 🎓 Leervoet

Als je een feature wilt toevoegen:

1. Lees eerst de model.js comment sekcties
2. Check de Import statements - zie welke dependencies je nodig hebt
3. Zoek naar TODO comments (`grep 'TODO'`) voor incomplete sections
4. Test met `new Model().init()` in browser console

## 🎨 De Intent van Spark Studio

Dit is een lerning project om zu zien:

- Kan web tech Flash/Spark functionaliteit nabootsen?
- SVG als asset systeem (beter dan raster images)
- Keyframe-gebaseerde animatie op web
- Canvas/WebM export workflow

**NIET productie-klaar** - dit is een proof-of-concept die gereed is voor verdere ontwikkeling.

---

**Bijgewerkt**: 3 Maart 2026
