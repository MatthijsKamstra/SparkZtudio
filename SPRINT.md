# Sprint Tracker - Spark Studio

**Current Sprint**: Week 1 - Animation POC
**Goal**: Rectangle animates x=0→x=400, export to MP4
**Status**: 🔧 IN PROGRESS

---

## 📋 Sprint 1: Animation POC

### Task 1: Test Inter.js Interpolation

**Purpose**: Verify animation calculation engine works

- [ ] Open browser console (F12)
- [ ] Run: `new Model().init()`
- [ ] Run: `new Inter().interpolateNumber(0, 400, 0.5)`
- [ ] Expected result: `200`
- [ ] Actual result: _[user to fill in]_
- [ ] Status: PASS / FAIL

**If FAIL**: Debug Inter.js → log output here

---

### Task 2: Create Test Project

**Purpose**: Have simple animation to test with

- [ ] Create file: `examples/project/simple-move.json`
- [ ] 2 keyframes:
  - Frame 0: `<rect x='0' y='50' width='100' height='100' fill='red'/>`
  - Frame 120: `<rect x='400' y='50' width='100' height='100' fill='red'/>`
- [ ] Verify file created
- [ ] Test load in browser: File > Open

**Status**: TODO

---

### Task 3: Test Canvas Animation

**Purpose**: Verify shapes animate visually on canvas

**Steps**:

1. Load `simple-move.json`
2. Click **Play** button in canvas menu
3. Watch canvas area - does rectangle move?

**Expected**: Smooth motion from left to right
**Actual**: _[user to fill in]_
**Status**: TODO

---

### Task 4: Test Video Export

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
