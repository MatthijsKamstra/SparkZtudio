# Animation Software Interface Research

This document catalogs reference materials for Spark Studio interface design, drawing from Macromedia Flash and other minimal animation tools.

---

## 1. Macromedia Flash Interface References

### Best Sources for Screenshots

| Source | URL | Content |
|--------|-----|---------|
| **Web Design Museum** | [webdesignmuseum.org](https://www.webdesignmuseum.org/software/macromedia-flash-mx-2004-in-2003) | Flash MX 2004, Flash 5.0 workspace screenshots |
| **EduTech Wiki** | [edutechwiki.unige.ch](https://edutechwiki.unige.ch/en/Flash_CS3_desktop_tutorial) | Flash CS3-CS4 tutorials with screenshots |
| **GMU Workshops** | [workshops.gmu.edu](https://workshops.gmu.edu/wp-content/uploads/2014/08/Flash-CS6-Level-1.pdf) | Flash CS6 PDF with labeled interface elements |
| **O'Reilly** | [oreilly.com/library/view/flash-professional-cs6](https://www.oreilly.com/library/view/flash-professional-cs6/9780133052718/ch01.html) | Visual QuickStart Guide with interface screenshots |

### Classic Flash Layout Elements

```
─────┐
│ Menu┌──────────────────────────────────────────────────────── Bar                                                    │
├─────────┬───────────────────────────────────┬───────────────┤
│         │                                   │               │
│ Tools   │         Stage (Canvas)             │   Properties  │
│ Panel   │                                   │    Panel      │
│         │                                   │               │
│         │                                   │               │
│         │                                   │               │
├─────────┴───────────────────────────────────┴───────────────┤
│ Timeline (Frames + Layers)                                   │
└─────────────────────────────────────────────────────────────┘
```

**Key Characteristics:**
- **Timeline**: TOP (classic) or BOTTOM (CS4+)
- **Tools Panel**: Left vertical toolbar
- **Stage**: Center canvas (white)
- **Properties Panel**: Right side, context-sensitive
- **Library Panel**: Right side, symbols/assets
- **Work Area**: Gray pasteboard surrounding stage

### Version Evolution

| Version | Year | Key Interface Feature |
|---------|------|----------------------|
| Flash 5.0 | 2000 | Panel-based system |
| Flash MX (v6) | 2002 | Dockable panels, Property Inspector |
| Flash MX 2004 | 2003 | History panel, Behaviors |
| Flash 8 | 2005 | Filter effects panel |
| Flash CS3 | 2007 | Adobe branding |
| Flash CS4 | 2008 | Timeline at bottom, Motion Editor |
| Flash CS6 | 2012 | Sprite sheet generation |

---

## 2. Minimal Animation Software References

### Open Source Tools

#### Pencil2D
- **Website**: [pencil2d.org](https://www.pencil2d.org/)
- **Interface**: Canvas center, tools left, timeline bottom, tool options right
- **Simplicity Focus**: Minimal UI, unlimited canvas size, raster/vector hybrid
- **Timeline**: Hollow scrubber, double-click keyframes, up to 10,000 frames

#### Tahoma2D
- **Website**: [tahoma2d.org](https://www.tahoma2d.org/)
- **Interface**: Simplified OpenToonz derivative, cleaner than Synfig
- **Features**: Implicit holds (auto frame persistence), status bar with hints

#### Glaxnimate
- **Website**: [glaxnimate.org](https://glaxnimate.org/)
- **Interface**: Central canvas, dockable views, dark/light themes
- **Exports**: Lottie, GIF, WebP, Animated SVG
- **Simplicity**: "Fast and simple" positioning

#### Enve
- **Website**: [maurycyliebner.github.io/dow](https://maurycyliebner.github.io/dow/)
- **Interface**: After Effects style, Blender Dope Sheet timeline
- **Shortcuts**: Blender-inspired (G=grab, S=scale, R=rotate)

### Web-Based Tools

#### Wick Editor ⭐ (Flash Successor)
- **Website**: [wickeditor.com](http://www.wickeditor.com/)
- **Interface**:
  - Left: Drawing tools (brush, pencil, shapes, bucket)
  - Top Right: Inspector (properties)
  - Bottom: Timeline with layers
  - Right: Asset library, outliner
  - Center: Canvas
- **Key Feature**: Browser-based, combines Flash + Scratch + HyperCard

#### Jitter
- **Website**: [jitter.video](https://jitter.video/)
- **Interface**: Infinite canvas, smart timeline, properties panel
- **Awards**: Product Hunt Design Tool of the Year 2024
- **Export**: 4K video (up to 120fps), GIF, Lottie

#### Animatey
- **Website**: [animatey.app](https://animatey.app/)
- **Interface**: Clean minimalist single-screen
- **No account required**: Free to use

#### Motionity
- **Website**: [motionity.app](https://www.motionity.app/)
- **Interface**: Upload area, canvas with presets, timeline, filters panel

#### Brush Ninja
- **Website**: [brush.ninja](https://brush.ninja/)
- **Interface**: Super simple, frame-by-frame, minimal controls

### Professional Tools (Clean Interface)

#### Rive ⭐ (Modern Two-Mode)
- **Website**: [rive.app](https://rive.app/)
- **Design Mode**: Creating graphics
- **Animate Mode** (Tab key): Animation interface
- **Timeline** (bottom): Animation types, playback speed, snap keys
- **Inspector** (right): Context-sensitive, key icons for animatable properties

---

## 3. Common Interface Patterns

All minimal animation tools share these patterns:

```
┌─────────────────────────────────────────────────────────────┐
│ Top: Menu / Toolbar                                         │
├────────┬───────────────────────────────┬──────────────────┤
│        │                               │                  │
│ Left   │      Center Canvas            │   Right          │
│ Tools  │      (Stage/Preview)           │   Properties     │
│        │                               │   Inspector      │
│        │                               │                  │
├────────┴───────────────────────────────┴──────────────────┤
│ Bottom: Timeline (Frames + Layers + Playhead)              │
└─────────────────────────────────────────────────────────────┘
```

### Core Components

1. **Canvas/Stage**: Central editing area
2. **Timeline**: Frame-based scrubber with keyframes
3. **Tools Panel**: Drawing/selection/editing tools
4. **Properties Panel**: Context-sensitive settings
5. **Layers Panel**: Object hierarchy management
6. **Asset Library**: Reusable elements (symbols, clips)

---

## 4. Recommendations for Spark Studio

Based on this research, the recommended interface for Spark Studio:

| Element | Reference | Implementation |
|---------|-----------|----------------|
| Canvas | Flash Classic | Central SVG rendering area |
| Timeline | Wick Editor / Pencil2D | Bottom horizontal timeline with frames |
| Tools | Flash / Wick Editor | Left vertical toolbar |
| Properties | Rive / Flash | Right contextual panel |
| Layers | Flash / Tahoma2D | Timeline-integrated layer management |

### Key Takeaways

1. **Keep it simple**: Wick Editor and Pencil2D show minimal UI works
2. **Bottom timeline**: CS4+ Flash, Rive, Wick Editor all use bottom timeline
3. **Context-sensitive properties**: Rive's approach (show relevant only)
4. **Two-mode design**: Rive's Design/Animate separation is elegant
5. **Keyboard shortcuts**: Enve uses Blender-style (G, S, R) - worth considering

---

## 5. Downloaded Reference Images

Location: `docs/reference-images/`

- `flash-mx-2004.jpg` - Macromedia Flash MX 2004 workspace
- `flash-5.jpg` - Macromedia Flash 5.0 workspace

---

*Generated: March 2026*
*For Spark Studio - Lightweight Flash Variant Project*
