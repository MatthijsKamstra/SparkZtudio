# Spark Studio - Interface Reference Research

This document catalogs research findings on animation software interfaces, serving as reference material for building Spark Studio.

---

## 1. Macromedia Flash Interface Reference

The classic Macromedia Flash interface is the primary inspiration for Spark Studio. Key sources with screenshots:

### Primary Sources

| Source | URL | Description |
|--------|-----|-------------|
| Web Design Museum | [Flash MX 2004](https://www.webdesignmuseum.org/software/macromedia-flash-mx-2004-in-2003) | Comprehensive workspace screenshots |
| Web Design Museum | [Flash 5.0](https://www.webdesignmuseum.org/software/macromedia-flash-5-0-in-2000) | Early interface screenshots |
| EduTech Wiki | [Flash CS3 Tutorial](https://edutechwiki.unige.ch/en/Flash_CS3_desktop_tutorial) | Educational tutorial with screenshots |
| EduTech Wiki | [Flash CS4 Tutorial](https://edutechwiki.unige.ch/en/Flash_CS4_desktop_tutorial) | CS4 interface documentation |
| GMU Workshops | [Flash CS6 PDF](https://workshops.gmu.edu/wp-content/uploads/2014/08/Flash-CS6-Level-1.pdf) | Labeled interface diagrams |
| O'Reilly | [Flash CS6 Guide](https://www.oreilly.com/library/view/flash-professional-cs6/9780133052718/ch01.html) | Professional interface reference |

### Classic Flash Workspace Layout

```
+------------------+------------------------+------------------+
|                  |        Menu Bar        |                  |
+------------------+------------------------+------------------+
|                  |                        |                  |
|   Tools Panel    |        Stage           |   Properties    |
|    (Left)        |      (Center)          |    Panel         |
|                  |                        |   (Right)        |
|                  |                        |                  |
+------------------+------------------------+------------------+
|                     Timeline (Bottom)                      |
|  [Layer 1] | | | | | | | | | | | | | | | | | | | |        |
|  [Layer 2] | | | | | | | | | | | | | | | | | | | |        |
+-----------------------------------------------------------+
```

### Key Interface Elements

1. **Timeline** - Top (classic) or Bottom (CS4+), frame-based animation
2. **Stage** - White canvas area for editing
3. **Tools Panel** - Left vertical toolbar (selection, drawing, shapes)
4. **Properties Inspector** - Right panel, context-sensitive properties
5. **Library Panel** - Right side, stores symbols/assets
6. **Color Mixer/Swatches** - Right panel for fill/stroke colors
7. **Actions Panel** - Bottom/right for code editing
8. **Work Area (Pasteboard)** - Gray area surrounding stage

---

## 2. Minimal Animation Software References

### Open Source Tools

#### Pencil2D
- **Website**: [pencil2d.org](https://www.pencil2d.org/)
- **Interface**: Central canvas (800x600 camera field), left tools panel, bottom timeline
- **Features**: Raster/vector workflow, keyframe-based, dockable panels
- **Relevance**: Minimal UI philosophy, focus on animating

#### Tahoma2D
- **Website**: [tahoma2d.org](https://tahoma2d.org/)
- **Interface**: Simplified OpenToonz derivative, cleaner than professional tools
- **Features**: Implicit holds (auto-display until next keyframe), status bar with hints
- **Relevance**: Beginner-friendly, automatic frame management

#### Glaxnimate
- **Website**: [glaxnimate.org](https://glaxnimate.org/)
- **Interface**: Central canvas, dockable views, dark/light themes
- **Features**: Vector animation, exports to Lottie, GIF, WebP, Animated SVG
- **Relevance**: Customizable dockable UI, modern minimalist approach

#### Synfig Studio
- **Website**: [synfig.org](https://synfig.org/)
- **Interface**: Complex industrial interface (not minimal)
- **Features**: Professional vector animation, waypoints/keyframes system
- **Relevance**: Advanced features, but interface too complex

### Web-Based Tools

#### Wick Editor (Flash Successor)
- **Website**: [wickeditor.com](http://www.wickeditor.com/)
- **Interface**: Left tools, top-right inspector, bottom timeline, right library
- **Features**: Browser-based, Flash spiritual successor, clips system
- **Relevance**: **Highest relevance** - direct Flash successor, browser-based

#### Jitter
- **Website**: [jitter.video](https://jitter.video/)
- **Interface**: Infinite canvas, smart timeline, properties panel
- **Features**: Auto-alignment, kinetic type, 300+ templates, 2024 Product Hunt winner
- **Relevance**: Modern minimal interface, smart timeline features

#### Animatey
- **Website**: [animatey.app](https://animatey.app/)
- **Interface**: Super minimal single-screen, simple keyframe timeline
- **Features**: No account required, onion skinning, GIF export
- **Relevance**: Minimal learning curve, simple timeline

#### Motionity
- **Website**: [motionity.app](https://www.motionity.app/)
- **Interface**: Upload area, canvas with presets, timeline, right panel
- **Features**: WebM/GIF export, layer-based, keyframe easing
- **Relevance**: Modern web-based, similar to Spark Studio goals

#### Brush Ninja
- **Website**: [brush.ninja](https://brush.ninja/)
- **Interface**: Clean canvas, frame-by-frame timeline, minimal controls
- **Features**: No complex timelines, free to use
- **Relevance**: Extremely simple, good for beginners

### Professional Tools (Clean Interface)

#### Rive
- **Website**: [rive.app](https://rive.app/)
- **Interface**: Two modes (Design/Animate), inspector right, timeline bottom
- **Features**: Context-sensitive properties, clean animation types (One-Shot, Ping-Pong, Loop)
- **Relevance**: **High relevance** - modern two-mode interface, clean design

---

## 3. Common Patterns Across Simple Tools

### Layout Patterns

| Element | Typical Position | Notes |
|---------|------------------|-------|
| Canvas/Stage | Center | Large working area |
| Timeline | Bottom | Frame/keyframe scrubber |
| Tools Panel | Left | Drawing/editing tools |
| Properties Panel | Right | Context-sensitive settings |
| Layers | Near timeline | Stack management |

### UI Patterns

1. **Central Canvas** - Large working area dominates
2. **Bottom Timeline** - Most common timeline position in modern tools
3. **Left Tools Panel** - Classic left-side toolbar
4. **Right Properties Panel** - Context-sensitive, shows relevant options
5. **Dockable/Floating Panels** - User-customizable (Glaxnimate, Synfig)
6. **Minimal Chrome** - Hideable UI for focus
7. **Context-Sensitive Controls** - Show only relevant options

---

## 4. Recommendations for Spark Studio

Based on this research, the recommended interface for Spark Studio:

```
+------------------------+------------------------+
|          Menu Bar                        |
+----+------------------------+-------------+
|    |                        |             |
| T  |       Canvas          | Properties  |
| O  |       (SVG)           |   Panel     |
| O  |                        |             |
| L  |                        |             |
| S  +------------------------+-------------+
|    |     Timeline (Frames + Layers)      |
+----+-------------------------------------+
```

### Key Design Decisions

1. **Timeline at bottom** - Matches modern tools (CS4+, Pencil2D, Rive)
2. **Tools on left** - Classic Flash/Macromedia convention
3. **Properties on right** - Context-sensitive, updates per selection
4. **Canvas centered** - Maximum workspace
5. **Layer management** - Integrate with timeline (like Flash, Pencil2D)

### Reference Priority

1. **Wick Editor** - Primary reference (browser-based Flash successor)
2. **Rive** - Secondary (modern two-mode design)
3. **Pencil2D** - Tertiary (open source, minimal)
4. **Classic Flash** - Historical reference (MX-CS6)

---

## 5. Downloaded Reference Images

| File | Source | Description |
|------|--------|-------------|
| `flash-mx-2004.jpg` | Web Design Museum | Macromedia Flash MX 2004 workspace |

---

*Document generated: March 2026*
*Research conducted for Spark Studio - Lightweight Flash Variant Project*
