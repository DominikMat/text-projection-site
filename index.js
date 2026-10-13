"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* Application configuration */
const canvasElement = document.querySelector('canvas');
// const targetFps = 60
const deltaTime_ms = 1000 / 60;
// letters should be defined with a bounding box on X axis from -50 to 50
// points should be defined from leftmost (lowest x) to rightmost (hightest x) in order, 
// unless they form a loop where it should go from leftmost to a duplicate of the first point at the end
const letters = [
    // a
    [{ x: -50, y: 10, z: 0 }, { x: 0, y: 30, z: 0 }, { x: 50, y: 30, z: 0 }, { x: 50, y: -50, z: 0 }, { x: 0, y: -50, z: 0 }, { x: -50, y: -10, z: 0 }, { x: 0, y: 10, z: 0 }, { x: 50, y: -10, z: 0 }, { x: 50, y: -50, z: 0 }],
    // b
    [{ x: -50, y: 100, z: 0 }, { x: -50, y: -50, z: 0 }, { x: 0, y: -50, z: 0 }, { x: 50, y: -10, z: 0 }, { x: 0, y: 30, z: 0 }, { x: -50, y: 0, z: 0 }],
    // c
    [{ x: 50, y: 20, z: 0 }, { x: 10, y: 30, z: 0 }, { x: -50, y: -10, z: 0 }, { x: 10, y: -50, z: 0 }, { x: 50, y: -40, z: 0 }],
    // d
    [{ x: -50, y: -50, z: 0 }, { x: 0, y: -100, z: 0 }, { x: 50, y: -100, z: 0 }, { x: 50, y: 100, z: 0 }, { x: 50, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -50, y: -50, z: 0 }],
    // e
    [{ x: -50, y: -10, z: 0 }, { x: 50, y: -10, z: 0 }, { x: 40, y: 20, z: 0 }, { x: 0, y: 30, z: 0 }, { x: -50, y: 10, z: 0 }, { x: -50, y: -30, z: 0 }, { x: 0, y: -50, z: 0 }, { x: 50, y: -40, z: 0 }],
    // f
    [{ x: 0, y: -50, z: 0 }, { x: 0, y: 70, z: 0 }, { x: 30, y: 100, z: 0 }, { x: 50, y: 90, z: 0 }, { x: 50, y: 20, z: 0 }, { x: -50, y: 20, z: 0 }],
    // g
    [{ x: 50, y: 30, z: 0 }, { x: 0, y: 30, z: 0 }, { x: -50, y: 0, z: 0 }, { x: 0, y: -30, z: 0 }, { x: 50, y: -10, z: 0 }, { x: 50, y: -100, z: 0 }, { x: 0, y: -100, z: 0 }, { x: -50, y: -70, z: 0 }],
    // h
    [{ x: -50, y: 100, z: 0 }, { x: -50, y: -50, z: 0 }, { x: -50, y: 0, z: 0 }, { x: 0, y: 30, z: 0 }, { x: 50, y: 0, z: 0 }, { x: 50, y: -50, z: 0 }],
    // i
    [{ x: -50, y: 0, z: 0 }, { x: 0, y: 30, z: 0 }, { x: 0, y: -50, z: 0 }, { x: 50, y: -40, z: 0 }],
    // j
    [{ x: -50, y: 30, z: 0 }, { x: 50, y: 30, z: 0 }, { x: 20, y: 30, z: 0 }, { x: 20, y: -100, z: 0 }, { x: -20, y: -100, z: 0 }, { x: -50, y: -60, z: 0 }],
    // k
    [{ x: -50, y: 100, z: 0 }, { x: -50, y: -50, z: 0 }, { x: -50, y: -10, z: 0 }, { x: 50, y: 30, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 50, y: -50, z: 0 }],
    // l
    [{ x: -50, y: 80, z: 0 }, { x: -20, y: 100, z: 0 }, { x: -20, y: -50, z: 0 }, { x: 20, y: -50, z: 0 }, { x: 50, y: -20, z: 0 }],
    // m
    [{ x: -50, y: -50, z: 0 }, { x: -25, y: 30, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 25, y: 30, z: 0 }, { x: 50, y: -50, z: 0 }],
    // n
    [{ x: -50, y: -50, z: 0 }, { x: -50, y: 20, z: 0 }, { x: 0, y: 30, z: 0 }, { x: 50, y: 10, z: 0 }, { x: 50, y: -50, z: 0 }],
    // o
    [{ x: -50, y: -10, z: 0 }, { x: -25, y: 30, z: 0 }, { x: 25, y: 30, z: 0 }, { x: 50, y: -10, z: 0 }, { x: 25, y: -50, z: 0 }, { x: -25, y: -50, z: 0 }, { x: -50, y: -10, z: 0 }],
    // p
    [{ x: -50, y: -100, z: 0 }, { x: -50, y: 30, z: 0 }, { x: 10, y: 30, z: 0 }, { x: 50, y: 0, z: 0 }, { x: 10, y: -40, z: 0 }, { x: -50, y: -40, z: 0 }, { x: -50, y: -100, z: 0 }],
    // q
    [{ x: -50, y: 0, z: 0 }, { x: 0, y: 30, z: 0 }, { x: 50, y: 30, z: 0 }, { x: 50, y: -100, z: 0 }, { x: 50, y: -40, z: 0 }, { x: 0, y: -40, z: 0 }, { x: -50, y: 0, z: 0 }],
    // r
    [{ x: -50, y: -50, z: 0 }, { x: -50, y: 30, z: 0 }, { x: 0, y: 30, z: 0 }, { x: 50, y: 15, z: 0 }],
    // s
    [{ x: -50, y: -40, z: 0 }, { x: 0, y: -50, z: 0 }, { x: 45, y: -30, z: 0 }, { x: 0, y: -10, z: 0 }, { x: -45, y: 10, z: 0 }, { x: 0, y: 30, z: 0 }, { x: 50, y: 20, z: 0 }],
    // t
    [{ x: 0, y: 80, z: 0 }, { x: 0, y: 40, z: 0 }, { x: -50, y: 40, z: 0 }, { x: 50, y: 40, z: 0 }, { x: 0, y: 40, z: 0 }, { x: 0, y: -50, z: 0 }, { x: 30, y: -50, z: 0 }, { x: 50, y: -30, z: 0 }],
    // u
    [{ x: -50, y: 30, z: 0 }, { x: -50, y: -30, z: 0 }, { x: -20, y: -50, z: 0 }, { x: 20, y: -50, z: 0 }, { x: 50, y: -30, z: 0 }, { x: 50, y: 30, z: 0 }, { x: 50, y: -50, z: 0 }],
    // v
    [{ x: -50, y: 30, z: 0 }, { x: 0, y: -50, z: 0 }, { x: 50, y: 30, z: 0 }],
    // w
    [{ x: -50, y: 30, z: 0 }, { x: -25, y: -50, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 25, y: -50, z: 0 }, { x: 50, y: 30, z: 0 }],
    // x
    [{ x: -50, y: 30, z: 0 }, { x: 0, y: -10, z: 0 }, { x: 50, y: -50, z: 0 }, { x: 0, y: -10, z: 0 }, { x: -50, y: -50, z: 0 }, { x: 0, y: -10, z: 0 }, { x: 50, y: 30, z: 0 }],
    // y
    [{ x: -50, y: 30, z: 0 }, { x: 0, y: -20, z: 0 }, { x: 50, y: 30, z: 0 }, { x: 0, y: -20, z: 0 }, { x: -20, y: -70, z: 0 }, { x: -50, y: -100, z: 0 }],
    // z
    [{ x: -50, y: 30, z: 0 }, { x: 50, y: 30, z: 0 }, { x: -50, y: -50, z: 0 }, { x: 50, y: -50, z: 0 }]
];
let projectionMatrix = [
    [1, 0, 0],
    [0, -1, 0]
];
/* Canvas Variables */
let ctx = canvasElement?.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
/* Buttons */
let projectBtn = document.getElementById("project-btn");
if (projectBtn)
    projectBtn.onclick = () => onProjectButtonClicked();
let loadBtn = document.getElementById("load-btn");
if (loadBtn)
    loadBtn.onclick = () => onLoadButtonClicked();
/* String input */
let textInput = document.getElementById("text-input");
let selectedTextDisplay = document.getElementById("selected-text");
/* Point data */
let currentLetterPointsXY = letters[0] || [];
let currentLetterProjection = letters[0] || [];
let targetLetterPointsXY = letters[0] || [];
let targetLetterProjection = letters[0] || [];
let currentStringTargetPositionIndex = 0;
let stringTarget = "ab";
/* Timers */
const ROTATION_TIME_SECONDS = 2;
let rotationStartTime = 0;
let isRotating = false;
let currentRotationState = false;
/* ========================================================================================== */
/* Main Application Logic */
/* ========================================================================================== */
function prepareNextLetter() {
    if (stringTarget.length === 0)
        return;
    const nextIdx = (currentStringTargetPositionIndex + 1) % stringTarget.length;
    const nextLetterCode = stringTarget.toLowerCase().charCodeAt(nextIdx) - 97;
    const nextLetterTarget = letters[nextLetterCode % letters.length] || letters[0] || [];
    targetLetterPointsXY = nextLetterTarget;
    targetLetterProjection = generateLetterTarget(currentLetterPointsXY, nextLetterTarget);
    currentLetterProjection = currentLetterPointsXY.map(p => {
        return !currentRotationState
            ? { x: p.x, y: p.y, z: 0 }
            : { x: p.x, y: 0, z: p.y };
    });
    updateDisplayText();
}
function init() {
    currentStringTargetPositionIndex = 0;
    const firstLetterIdx = stringTarget.toLowerCase().charCodeAt(0) - 97;
    const initialLetter = letters[firstLetterIdx % letters.length] || letters[0] || [];
    currentLetterPointsXY = initialLetter;
    currentRotationState = false;
    projectionMatrix = [
        [1, 0, 0],
        [0, -1, 0]
    ];
    prepareNextLetter();
    /* set looping behaviour */
    setInterval(loop, deltaTime_ms);
}
function loop() {
    if (isRotating) {
        let t = (Date.now() - rotationStartTime) / (ROTATION_TIME_SECONDS * 1000);
        rotateLoop(t);
    }
    draw();
    if (projectBtn)
        projectBtn.innerText = isRotating ? "Rotating ..." : "Project Next Letter";
}
function draw() {
    if (!ctx)
        return;
    // clear canvas
    ctx.clearRect(0, 0, width, height);
    // draw next (hidden) letter first with thick red stroke
    if (targetLetterProjection && targetLetterProjection.length > 0) {
        drawPath(ctx, targetLetterProjection, true);
    }
    // draw current letter on top with white stroke
    if (currentLetterProjection && currentLetterProjection.length > 0) {
        drawPath(ctx, currentLetterProjection, false);
    }
}
/* ========================================================================================== */
/* User interaction */
/* ========================================================================================== */
function onProjectButtonClicked() {
    if (isRotating)
        return;
    startRotation();
}
function onLoadButtonClicked() {
    if (textInput && textInput.value) {
        let formatString = (textInput.value.toLowerCase()).replace(/[^a-z]/g, '');
        if (formatString.length < 1)
            return;
        stringTarget = formatString;
        console.log("Loaded string: " + stringTarget);
        currentStringTargetPositionIndex = 0;
        const firstLetterIdx = stringTarget.toLowerCase().charCodeAt(0) - 97;
        const initialLetter = letters[firstLetterIdx % letters.length] || letters[0] || [];
        currentLetterPointsXY = initialLetter;
        currentRotationState = false;
        projectionMatrix = [
            [1, 0, 0],
            [0, -1, 0]
        ];
        prepareNextLetter();
    }
}
function updateDisplayText() {
    if (selectedTextDisplay) {
        const currChar = stringTarget.charAt(currentStringTargetPositionIndex);
        const nextIdx = (currentStringTargetPositionIndex + 1) % stringTarget.length;
        const nextChar = stringTarget.charAt(nextIdx);
        selectedTextDisplay.innerHTML = "<b>Selected:</b> " + stringTarget +
            " | <b>Current Letter:</b> <span style=\"color: #ffffff; font-weight: bold; background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px;\">" + currChar + "</span> (white)" +
            " | <b>Next (hidden):</b> <span style=\"color: #ff5555; font-weight: bold; background: rgba(255,0,0,0.2); padding: 2px 6px; border-radius: 4px;\">" + nextChar + "</span> (red)";
    }
}
/* ========================================================================================== */
/* Rotation handlers */
/* ========================================================================================== */
function startRotation() {
    rotationStartTime = Date.now();
    isRotating = true;
}
function endRotation() {
    isRotating = false;
    rotateLoop(1.0);
    currentRotationState = !currentRotationState;
    currentStringTargetPositionIndex = (currentStringTargetPositionIndex + 1) % stringTarget.length;
    currentLetterPointsXY = targetLetterPointsXY;
    prepareNextLetter();
}
function rotateLoop(t) {
    if (t > 1.0) {
        endRotation();
        return;
    }
    // Smooth 90 degree rotation around X axis
    let angle = !currentRotationState
        ? t * (Math.PI / 2)
        : (1.0 - t) * (Math.PI / 2);
    projectionMatrix = [
        [1, 0, 0],
        [0, -Math.cos(angle), -Math.sin(angle)]
    ];
}
/* ========================================================================================== */
/* Projection Logic */
/* ========================================================================================== */
// casts point to 2D based on current projection
function projectedPoint(p) {
    const row0 = projectionMatrix[0];
    const row1 = projectionMatrix[1];
    if (!row0 || !row1)
        return { x: 0, y: 0, z: 0 };
    const m00 = row0[0] ?? 0, m01 = row0[1] ?? 0, m02 = row0[2] ?? 0;
    const m10 = row1[0] ?? 0, m11 = row1[1] ?? 0, m12 = row1[2] ?? 0;
    const x = m00 * p.x + m01 * p.y + m02 * p.z;
    const y = m10 * p.x + m11 * p.y + m12 * p.z;
    return { x, y, z: 0 };
}
// given a path of 2D points in 3D space
// we want to 'hide' a 2D image in the unutilized dimension 
// this functions accept the first image defined in XY space
// returns the output hidden image in XYZ space
function generateLetterTarget(inputLetterPointsXY, outputLetterPointsXY) {
    if (inputLetterPointsXY.length < 2 || outputLetterPointsXY.length < 2)
        return [];
    // Ensure input points form a continuous closed loop without gaps
    let inputLoop = [];
    const p0 = inputLetterPointsXY[0];
    const pt = inputLetterPointsXY[inputLetterPointsXY.length - 1];
    if (Math.abs(p0.x - pt.x) < 1e-3 && Math.abs(p0.y - pt.y) < 1e-3) {
        inputLoop = inputLetterPointsXY.slice();
    }
    else {
        // Reversible open stroke: forward then reverse to form closed loop
        inputLoop = [...inputLetterPointsXY, ...inputLetterPointsXY.slice(0, -1).reverse()];
    }
    const numSegs = inputLoop.length - 1;
    if (numSegs < 1)
        return [];
    // Find starting segment on inputLoop for T0
    const t0 = outputLetterPointsXY[0];
    const t1 = outputLetterPointsXY[1];
    const initialTargetDir = t1.x - t0.x;
    let currSeg = 0;
    let foundDirMatch = false;
    for (let i = 0; i < numSegs; i++) {
        const segP1 = inputLoop[i];
        const segP2 = inputLoop[i + 1];
        const minX = Math.min(segP1.x, segP2.x);
        const maxX = Math.max(segP1.x, segP2.x);
        if (t0.x >= minX - 1e-4 && t0.x <= maxX + 1e-4) {
            const segDir = segP2.x - segP1.x;
            if (!foundDirMatch) {
                currSeg = i;
            }
            if ((segDir * initialTargetDir) > 1e-4) {
                currSeg = i;
                foundDirMatch = true;
                break;
            }
        }
    }
    // Interpolate start Y on currSeg
    const startP1 = inputLoop[currSeg];
    const startP2 = inputLoop[currSeg + 1];
    let currX = t0.x;
    let currY = startP1.y;
    if (Math.abs(startP2.x - startP1.x) > 1e-4) {
        const t = (currX - startP1.x) / (startP2.x - startP1.x);
        currY = startP1.y + t * (startP2.y - startP1.y);
    }
    const returnLetters = [];
    // Helper to push 3D point
    const addPoint = (x, yIn, zOut) => {
        const last = returnLetters[returnLetters.length - 1];
        const projectedY = !currentRotationState ? yIn : zOut;
        const projectedZ = !currentRotationState ? zOut : yIn;
        if (last && Math.abs(last.x - x) < 1e-3 && Math.abs(last.y - projectedY) < 1e-3 && Math.abs(last.z - projectedZ) < 1e-3) {
            return; // skip duplicate point
        }
        const p = !currentRotationState
            ? { x, y: yIn, z: zOut }
            : { x, y: zOut, z: yIn };
        returnLetters.push(p);
    };
    addPoint(currX, currY, t0.y);
    // March along target segments
    for (let k = 1; k < outputLetterPointsXY.length; k++) {
        const prevT = outputLetterPointsXY[k - 1];
        const currT = outputLetterPointsXY[k];
        const xStart = prevT.x;
        const xEnd = currT.x;
        const zStart = prevT.y;
        const zEnd = currT.y;
        const totalDx = xEnd - currX;
        if (Math.abs(totalDx) < 1e-4) {
            // Vertical segment in target: stay at currX, currY, reach zEnd
            addPoint(currX, currY, zEnd);
            continue;
        }
        let stepSafety = 0;
        const maxSteps = numSegs * 3;
        while (stepSafety++ < maxSteps) {
            const p1 = inputLoop[currSeg];
            const p2 = inputLoop[currSeg + 1];
            const segDx = p2.x - p1.x;
            const remainingDx = xEnd - currX;
            if (Math.abs(remainingDx) < 1e-4) {
                // Reached target X
                addPoint(currX, currY, zEnd);
                break;
            }
            // Case A: Current segment is vertical in X
            if (Math.abs(segDx) < 1e-4) {
                currX = p2.x;
                currY = p2.y;
                let tTgt = Math.abs(xEnd - xStart) > 1e-4 ? (currX - xStart) / (xEnd - xStart) : 1;
                tTgt = Math.max(0, Math.min(1, tTgt));
                const z = zStart + tTgt * (zEnd - zStart);
                addPoint(currX, currY, z);
                currSeg = (currSeg + 1) % numSegs;
                continue;
            }
            const stepToP2 = p2.x - currX;
            // Case B: Current segment moves in the direction of target
            if ((remainingDx * stepToP2) > 1e-4) {
                if (Math.abs(remainingDx) <= Math.abs(stepToP2) + 1e-4) {
                    // Target X is on this segment!
                    currX = xEnd;
                    const tIn = (currX - p1.x) / (p2.x - p1.x);
                    currY = p1.y + tIn * (p2.y - p1.y);
                    addPoint(currX, currY, zEnd);
                    break;
                }
                else {
                    // Move to p2 and advance
                    currX = p2.x;
                    currY = p2.y;
                    let tTgt = (currX - xStart) / (xEnd - xStart);
                    tTgt = Math.max(0, Math.min(1, tTgt));
                    const z = zStart + tTgt * (zEnd - zStart);
                    addPoint(currX, currY, z);
                    currSeg = (currSeg + 1) % numSegs;
                    continue;
                }
            }
            else {
                // Case C: Current segment doesn't move towards target (advance through p2)
                currX = p2.x;
                currY = p2.y;
                let tTgt = Math.abs(xEnd - xStart) > 1e-4 ? (currX - xStart) / (xEnd - xStart) : 0;
                tTgt = Math.max(0, Math.min(1, tTgt));
                const z = zStart + tTgt * (zEnd - zStart);
                addPoint(currX, currY, z);
                currSeg = (currSeg + 1) % numSegs;
                continue;
            }
        }
    }
    printPoints("INPUT POINTS: ", inputLetterPointsXY);
    printPoints("FROM XY OUTPUT: ", outputLetterPointsXY);
    printPoints("PROJECT OUTPUT: ", returnLetters);
    return returnLetters;
}
/* ========================================================================================== */
/* Other helpers */
/* ========================================================================================== */
function drawPath(ctx, points, isNext = false) {
    ctx.beginPath();
    if (points.length > 1 && points[0]) {
        let p0 = projectedPoint(points[0]);
        ctx.moveTo(width / 2 + p0.x * 2, height / 2 + p0.y * 2);
        for (let i = 1; i < points.length; i++) {
            let pt = points[i];
            if (pt) {
                let p = projectedPoint(pt);
                ctx.lineTo(width / 2 + p.x * 2, height / 2 + p.y * 2);
            }
        }
    }
    ctx.strokeStyle = isNext ? '#ff3333' : '#ffffff';
    ctx.lineWidth = isNext ? 8 : 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
}
function resize() {
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight * 0.9; // decrese based on header size
    if (canvasElement) {
        canvasElement.width = Math.floor(displayWidth * dpr);
        canvasElement.height = Math.floor(displayHeight * dpr);
    }
    width = displayWidth;
    height = displayHeight;
    if (ctx) {
        ctx.resetTransform();
        ctx.scale(dpr, dpr);
    }
}
window.onload = () => { resize(); init(); };
window.onresize = () => { resize(); };
function printPoints(str, ps) {
    let outStr = str + " (";
    ps.forEach((p) => {
        outStr += printPoint(p) + ",";
    });
    console.log(outStr + ")");
}
function printPoint(p) {
    return "(" + p.x + "," + p.y + "," + p.z + ")";
}
//# sourceMappingURL=index.js.map