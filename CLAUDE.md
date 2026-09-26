# CLAUDE.md - AI Copilot Instructies

Documentatie voor AI assistenten die aan Spark Studio werken.

## 🎯 Projectdoel

**Spark Studio** is een **Lightweight Flash-variant** - web-gebaseerde vector animatie tool voor learning purposes.

### MVP Goal

✨ **Single moving object** (rectangle x=0→x=400) + MP4 export

### Functionaliteit

- SVG shapes (rechthoeken, cirkels, tekst) op een canvas
- Keyframe-gebaseerde animaties
- Projecten opslaan/laden als JSON
- Animaties exporteren naar WebM/MP4 video

### Type Project

- **Learning**: Personal project met AI-ondersteuning
- **Single-user**: Geen cloud, geen collaboration
- **Chrome-first**: Later Electron; WebM export voldoende

## 🏗️ Architectuur

### Slim Singleton Pattern

Alle UI-classes zijn singletons (`new Canvas()` geeft altijd dezelfde instantie). `Model` start alles:

```javascript
new Model().init(); // init van Canvas, CanvasMenu, Menu, Timeline, Properties, Tools, Shortcuts, ExportVideo
```

### Core Classes

- **project.js** (`js/model/project.js`) - Pure functies: projectformaat v2, tweening (`getLayerState`), `renderFrameSvg`, SVG-import, v1-conversie, sanitizing
- **Model** (`js/model/model.js`) - State (`ProjectVars`, `currentFrame`, `selectedLayerId`), undo/redo, playback, alle mutaties
- **Canvas** (`js/canvas.js`) - Stage: rendert frame, selecteren/slepen, tekentools
- **Timeline** (`js/timeline.js`) - Laagrijen x framekolommen, keyframes, playhead
- **Properties** (`js/properties.js`) - Inspector voor geselecteerde laag en document
- **ExportVideo** (`js/export-video.js`) - Frame-exacte MP4/WebM via WebCodecs + Mediabunny (CDN)
- **Export** (`js/export.js`) - JSON opslaan, PNG van huidig frame

### Datastroom

1. UI roept een Model-methode aan (`setLayerProps`, `insertKeyframe`, `addLayer`, ...)
2. Model doet `snapshot()` (undo), muteert `ProjectVars`, dan `changed(type)` (autosave + `notify`)
3. `notify('structure' | 'animation' | 'frame' | 'selection')` roept `build/render/refresh` aan op Canvas, Timeline en Properties

Muteer `ProjectVars` nooit buiten Model. Lees `ProjectVars` altijd vers: undo en laden wijzen een nieuw object toe.

### Key Data Structure (formaat v2)

```javascript
{
  format: 2, exportName, projectName, width, height,
  viewBox: [0, 0, 600, 400], background: '#ffffff',
  frameRate: 24, frameLength: 48,
  defs: '<defs>...</defs>',            // gedeelde gradients/styles uit geimporteerde SVG
  layers: [                             // index 0 = bovenste laag (voorgrond), zoals in Flash
    { id, name, visible, locked,
      content: '<rect .../>',           // SVG-markup van de laag, statisch
      cx, cy,                           // pivot (registratiepunt), standaard midden van content
      keyframes: [{ frame, x, y, sx, sy, rot, alpha, tween, ease, blank }] }
  ]
}
```

Een laag is zichtbaar vanaf zijn eerste keyframe. `tween: true` interpoleert naar de volgende keyframe. `blank: true` is een lege keyframe (F7). Oude v1-bestanden (`frames[]` met complete SVG per keyframe) worden bij openen omgezet.

## ⚠️ Huidige Status & Problemen

### ✅ Werkend (v2, september 2026)

- [x] SVG-import: top-level elementen en Inkscape-lagen worden lagen
- [x] Lagen: toevoegen, verwijderen, volgorde, hernoemen, verbergen, vergrendelen, Distribute to Layers
- [x] Keyframes (F6), blank keyframes (F7), clear (Shift+F6)
- [x] Motion tween op x, y, schaal, rotatie, alpha, met ease
- [x] Slepen op stage maakt automatisch een keyframe en tween
- [x] Property panel gekoppeld aan laag en document
- [x] Undo/redo (snapshots)
- [x] Video-export MP4 (H.264) en WebM (VP9/VP8), frame-exact
- [x] Autosave naar localStorage, Open Recent

### 🚧 Nog niet

- [ ] Shape tween en kleur-tween (fill/stroke)
- [ ] Import to Stage (SVG toevoegen aan bestaand project)
- [ ] Frames invoegen/verwijderen (F5), keyframes slepen in de timeline
- [ ] Onion skin, library/symbols
- [ ] Desktop-wrapper (Electron of Tauri): Mediabunny dan lokaal meeleveren
- [ ] Ongebruikte v1-code opruimen: `inter.js`, `inter-dummy-data.js`, `inter.min.js`, `defaults.js`, `timeline-menu.js`, `utils/color-converter.js`

### 🐛 Aandachtspunten

1. Externe fonts en externe `<image href>` renderen niet in video-export (SVG als image laadt geen externe bronnen)
2. `node/export.js` genereert nog v1-projecten; die worden bij openen omgezet
3. Content uit SVG en projectbestanden gaat door `sanitizeSvgMarkup` (geen scripts, event handlers, `javascript:` links)

## 📋 Werkflow voor Verbetering

### Volgende stappen

1. Kleur-tween (tint/fill) als extra keyframe-eigenschap
2. Import to Stage en frames invoegen/verwijderen (F5)
3. Keyframes slepen in de timeline, onion skin
4. Desktop-wrapper: Tauri of Electron, Mediabunny lokaal meeleveren, native open/save dialogs

## 🔧 Best Practices voor Aanpassingen

### Naming Conventions

- Classes: PascalCase (Canvas, Timeline, Properties)
- Methods: camelCase (initTimeline, updateProperty)
- IDs in HTML: kebab-case (timeline-wrapper, svg-container)
- Variables: camelCase (isPlaying, frameIndex)

### Adding Features

1. **New Shape Type**: Voeg een tool toe in `tools.js` en markup in `Canvas.shapeMarkup`
2. **New Animatable Property**: Voeg de key toe aan `DEFAULT_STATE` in `project.js`, pas `layerTransform`/`renderFrameSvg` en `Canvas.render` aan, en een veld in `properties.js`
3. **New Layer/Keyframe Action**: Methode in `Model` met `snapshot()` vooraf en `changed(type)` achteraf
4. **UI Changes**: Altijd eerst structuur in HTML, dan CSS, dan JS

### Debug Mode

Classes hebben `IS_DEBUG = false`. Zet het per class aan voor console output.

### LocalStorage

`Model.changed()` doet de autosave (`SparkZtudio-currentProject`). Open Recent staat in `SparkZtudio-projectFiles`.

## 👀 Waar Let Op

### ExportVideo

- Rendert elk frame via `renderFrameSvg` naar een canvas en encodeert met WebCodecs (`CanvasSource` van Mediabunny)
- Onafhankelijk van afspeelsnelheid, dus geen haperingen of verkeerde duur
- Beschikbare codecs worden per browser gecontroleerd met `canEncodeVideo`
- H.264 vereist even afmetingen; de export rondt naar boven af

### Timeline Performance

- Table groeit met aantal frames × aantal layers
- Geen virtualization - kan traag worden bij 100+ frames
- Later: implementeer virtual scrolling

## 📁 Bestandsstructuur Overzicht

```
js/
├── model/
│   ├── project.js        # Formaat v2, tweening, import, sanitizing ⭐
│   └── model.js          # State, undo, playback, mutaties ⭐
├── canvas.js             # Stage rendering en interactie
├── canvas-menu.js        # Zoom en afspeelknoppen
├── timeline.js           # Timeline UI
├── properties.js         # Property panel
├── export-video.js       # Video export ⭐
├── export.js             # JSON opslaan, PNG export
├── menu.js               # Navbar menu's
├── tools.js              # Tools en kleuren
├── shortcuts.js          # Keyboard shortcuts
├── layout.js             # Resize/layout
├── focus.js              # Focus management
└── local-storage.js      # Persistentie
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
