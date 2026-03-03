# Sprint Tracker - Spark Studio

**Current Sprint**: Week 1 - Animation POC
**Goal**: Rectangle animates x=0→x=400, export to MP4
**Status**: 🔧 IN PROGRESS

---

## ⚙️ Setup

### Start Local Server (REQUIRED)

**Problem**: Opening `index.html` directly (`file://`) blocks ES modules → CORS error

**Solution**: Run local web server

```bash
cd /Users/matthijskamstra/Documents/GIT/spark-studio
python3 -m http.server 8000
```

Then open: **http://localhost:8000**

### Console Access

1. Open Chrome DevTools (F12)
2. Go to **Console** tab
3. Paste debug commands below

---

---

## 📋 Sprint 1: Animation POC

### Task 1: Test Inter.js Interpolation ✅ PASS

**Purpose**: Verify animation calculation engine works

- [x] Open browser console (F12)
- [x] Run: `new Model().init()`
- [x] Expected result: Inter constructor runs, frames calculated
- [x] **Actual result**: ✅ WORKING
  - Console shows: `calculated.length: 31` (31 frames interpolated!)
  - Project loaded: "xxexample_project"
  - No errors!

**Status**: ✅ PASS - Inter.js calculation engine works correctly

---

### Task 2: Load Example Project ✅ PASS

**Purpose**: Have animation to test with

- [x] Project exists: `examples/project/all_600x300.json`
- [x] Loaded successfully in browser
- [x] Shapes visible on canvas (red, yellow, green circles)
- [x] Timeline shows 4 layers

**Status**: ✅ PASS - Using existing example projects

---

### Task 3: Test Canvas Animation 🔧 TESTING

**Purpose**: Verify shapes animate visually on canvas

**Steps**:
1. Click **Play button** (groene play-knop in canvas menu)
2. Watch canvas area - do shapes move/animate?

**Expected**: Animation plays smoothly  
**Observations so far**: Shapes are rendered, waiting for Play button test

**TODO**: Click Play and report results

**Status**: 🔧 IN PROGRESS - Awaiting user interaction

---

### Task 4: Test Video Export 🔧 TESTING

**Purpose**: Verify WebM export works

**Steps**:
1. Click **File > ExportMovie**
2. Modal opens
3. Click **Start Recording**
4. Click **Play**
5. Wait for animation
6. Click **Stop Recording**
7. Click **Yes, Export**

**Questions to answer**:
- [ ] File downloaded? YES/NO
- [ ] File has content? YES/NO (> 100KB)
- [ ] Can VLC play it? YES/NO

**Status**: 🔧 IN PROGRESS - Ready to test

---

### Task 5: Bug Report

**Fixes already applied**:
- ✅ Fixed CORS - Switched from `file://` to `http://localhost:8000`
- ✅ App loads without errors

**Current known issues**:
- None so far! App is working well.

**Status**: ✅ GOOD

**Purpose**: Verify MP4/WebM export works

**Steps**:

1. Load `simple-move.json`
2. Click **File > ExportMovie**
3. Modal opens with canvas preview
4. Click **Start Recording**
5. Click **Play** in modal
6. Click **Stop Recording**
7. Click **Yes, Export**
8. Browser downloads file

**Questions**:

- [ ] File downloaded? YES / NO
- [ ] File size > 0 bytes? YES / NO
- [ ] Can VLC play it? YES / NO
- [ ] File format? WebM / MP4 / Other: \_\_\_

**Status**: TODO

---

### Task 5: Debug Issues & Report

**Purpose**: Document any problems found

**If any step FAILED**:

1. Copy console error
2. Paste in this document
3. Note which file has the bug
4. Note line number if possible

**Errors found**:

```
[user to fill in console output here]
```

**Status**: TODO

---

## 🎯 Success Criteria

- [ ] Task 1: Inter.interpolateNumber returns correct value
- [ ] Task 2: simple-move.json exists and loads
- [ ] Task 3: Rectangle animates on canvas
- [ ] Task 4: WebM file exports (any issues OK, we'll fix)
- [ ] Task 5: All errors documented

---

## 📝 Next Actions After Sprint 1

**IF ALL PASS**: Proceed to **Sprint 2 - Property Panel**

- Start binding property inputs to ProjectVars
- Make rectangle move via property slider

**IF ANY FAIL**:

- Fix specific component (Inter.js, Canvas, etc)
- Document bug in FINDINGS.md
- Retry step

---

## 🔧 Debug Commands

Paste these in browser console:

```javascript
// Test interpolation
new Inter().interpolateNumber(0, 400, 0.5);

// Test color interpolation
new Inter().interpolateColor("#ff0000", "#0000ff", 0.5);

// Check ProjectVars state
console.log(ProjectVars);

// Check if Inter calculated frames
console.log(ProjectVars.calculated);

// Trigger canvas redraw
new Canvas().redraw();
```

---

## 📅 Timeline

- **Sprint 1**: Week 1 (Animation POC)
- **Sprint 2**: Week 2 (Property Panel + Layer basics)
- **Sprint 3**: Week 3+ (Polish & extend)

---

**Last Updated**: 3 March 2026
**Next Review**: After all Sprint 1 tasks complete
