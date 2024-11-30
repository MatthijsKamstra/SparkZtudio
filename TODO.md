# TODO

- [ ] ~~min and max tools, canvas, propperits, via css~~
- [ ] ~~canvas min ?~~
- [x] timeline with icons (text, image, rect)
- [x] timeline in table,
- [ ] timeline with small spaces for frames and keyframes
- [ ] use highligh color when selected
- [x] start with project
  - [x] default svg in canvas
  - [x] open `.sparkz`/`.json` file
  - [x] open `.sparkz`/`.json` file -> shortcut
  - [x] import `.svg`
  - [x] import `.svg` -> shortcut
- [x] save file `.sparkz`/`.json` file
- [ ] layers revered so background is lowest
- [ ] opslaan van afmeting properties, timeline (share locally)
- [ ] opslaan van previous projects
- [x] afmeting rate,
- [x] Model maken ipv Project
- [x] LocalStorageHandler
- [x] zoom working
- [x] use model more
- [x] canvas menu
  - [x] play/stop toggle
  - [x] next keyferame
  - [x] prev keyferame
  - [x] loop
- [x] time rounded
- [ ] Canvas menu
  - [ ] jump to keyframe
  - [ ] play calculated frames
  - [ ] previous keyframe
  - [ ] next keyframe
- [ ] Export testen
  - [x] Project file open en inter gebruiken voor tussen scherm
  - [x] export correct svg width height
  - [ ] check for motion object
  - [ ] check export for color object
  - [x] change size canvas
  - [x] change length / fps
  - [ ] rect/circle/text/image animation
  - [ ] 3 rect/circle/text/image animation
  - [ ] check shapes width/height, x/y pos, fill color, stroke color, stroke width, opacity, rotation?
  - [x] export using inter for betweens.
  - [x] create script to genenrate quick projects base upon inkscape export
  - [x] Ensures the frame length is greater than or equal to the last frame's number and adjusts it if necessary.
  - [x] Ensures the frame length divided by the frame rate equals the time and corrects the time if needed.
  - [x] Adjusts the width, height, and viewBox attributes in the frames' SVG content to match the project's width and height.
  - [x] Cleans up the SVG content in the frames by removing line breaks, tabs, comments, and extra spaces.
  - [x] Converts default web color names to their corresponding hex values in the frames' SVG content.
- [ ] Document properties
  - [ ] change width/height
  - [ ] change frameeratge
  - [ ] change framelenght
  - [ ] add total time
  - [ ] change total time
- [ ] is it possible to code some extra values in .webm (data from export)
- [ ] fix menu canvas with bigger projects
- [x] fix label click which is buggy
- [x] try again: fix label click which is buggy

---

## ExportMovie...

new Model().init() -> new Inter().init()

- dummy file projectFile

-> new Model().setProjectViaFile(this.projectFileTest);
