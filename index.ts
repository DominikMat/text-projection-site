
/* Application configuration */
const canvasElement: HTMLCanvasElement | null = document.querySelector('canvas');
const targetFps = 60
const deltaTime_ms = 1000 / 60
const canvasBackgroundColour: string = 'rgb(39, 39, 39)'

/* data types */
type Point = {
    x: number;
    y: number;
    z: number;
}
const letters: Array<Array<Point>> = [
    [ {x:50,y:100,z:0}, {x:50,y:0,z:0}, {x:0,y:0,z:0}, {x:-50,y:-50,z:0}, {x:0,y:-100,z:0}, {x:50,y:-100,z:0} ], // letter d
    [ {x:-50,y:-50,z:0}, {x:-25,y:30,z:0}, {x:0,y:0,z:0}, {x:25,y:30,z:0}, {x:50,y:-50,z:0} ], // letter m
] 
let projectionMatrix: Array<Array<number>> = [
    [ 1, 0, 0 ],
    [ 0, -1, 0 ]
] 


/* Canvas Variables */
let ctx: CanvasRenderingContext2D | null | undefined = canvasElement?.getContext('2d')
let width = window.innerWidth
let height = window.innerHeight

/* Button */
let projectBtn = document.getElementById("project-btn");
if (projectBtn) projectBtn.onclick = () => onProjectButtonClicked()
let currentLetters: Array<Point> = letters[0] || []
let currentProjection: Array<Point> = letters[0] || []
let letterTarget: Array<Point> = letters[1] || []
let letterProjectionTarget: Array<Point> = letters[1] || []
let currentLetterIdx = 0

/* Timers */
const ROTATION_TIME_SECONDS = 2
let rotationStartTime = 0;
let isRotating = false;
let currentRotationState = false
const stringTarget = "ab"

// your init logic here
function init() {
    letterProjectionTarget = generateLetterTarget(currentLetters, letters[1] || [])
    /* set looping behaviour */
    setInterval(loop, deltaTime_ms)
}

function loop() {
    draw()

    if (isRotating) {
        let t = (Date.now() - rotationStartTime) / (ROTATION_TIME_SECONDS * 1000)
        rotateLoop(t)
    }
}

function draw() {
    if (!ctx) return

    // clear canvas
    ctx.clearRect(0,0,width,height)

    // draw circle in the middle of the screen
    if (currentProjection) drawPath(ctx,currentProjection)
    if (letterProjectionTarget) drawPath(ctx,letterProjectionTarget)
}
function drawPath(ctx: CanvasRenderingContext2D, points: Array<Point>) {
    ctx.beginPath()
    if (points.length > 1 && points[0]) {
        let p0 = projectedPoint(points[0] || {x:0,y:0,z:0})
        ctx.moveTo(width/2+p0.x, height/2+p0.y)
        for (let i=1; i<points.length; i++) {
            let p = projectedPoint(points[i] || {x:0,y:0,z:0})
            if (p) ctx.lineTo(width/2+p.x, height/2+p.y)
        }
    }

    ctx.closePath()
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 5
    ctx.stroke()
}

function resize() {
    const dpr = window.devicePixelRatio
    const displayWidth = window.innerWidth
    const displayHeight = window.innerHeight * 0.9 // decrese based on header size

    if (canvasElement) {
        width = canvasElement.width = Math.floor(displayWidth * dpr)
        height = canvasElement.height = Math.floor(displayHeight * dpr)
    }
    if(ctx) ctx.scale(dpr, dpr)
}

function onProjectButtonClicked() {
    currentLetterIdx = (currentLetterIdx + 1) % stringTarget.length
    const nextLetterIdx =  stringTarget.toLowerCase().charCodeAt(currentLetterIdx) - 96; // get alphabet number a=0 b=1 ... z=25
    const nextLetterTarget = letters[nextLetterIdx % letters.length] || []
    letterProjectionTarget = generateLetterTarget(letterTarget, nextLetterTarget) 
    letterTarget = nextLetterTarget
    startRotation()
}

function startRotation() {
    rotationStartTime = Date.now()
    isRotating = true
}
function endRotation () {
    isRotating = false
    rotateLoop(1.0)
    currentRotationState = !currentRotationState
}
function rotateLoop(t: number) {
    if (t > 1.0) { endRotation(); return; }
    let invT = 1.0 - t

    if (!currentRotationState) {
        // collapse x axis
        // expose z axis
        // flip y and z axis

        projectionMatrix = [
            [1*invT,0,1*t],
            // [1,0,0],
            [0,-1,0]
        ]
    } else {
        // flip y and z axis
        // collapse z
        // expose x
        
        projectionMatrix = [
            [1*t,0,1*invT],
            // [1,0,0],
            [0,-1,0]
        ]
    }
}

// casts point to 2D based on current projection
function projectedPoint(p: Point): Point {
    if (projectionMatrix === undefined 
        || projectionMatrix[0] === undefined
    ) return {x: 0, y: 0, z: 0};

    if (projectionMatrix.length < 2
        || projectionMatrix[0].length < 3
    ) return {x: 0, y: 0, z: 0};

    const x = projectionMatrix[0][0] * p.x + projectionMatrix[0][1] * p.y + projectionMatrix[0][2] * p.z
    const y = projectionMatrix[1][0] * p.x + projectionMatrix[1][1] * p.y + projectionMatrix[1][2] * p.z
    return {x,y,z:0}
}       

// given a path of 2D points in 3D space
// we want to 'hide' a 2D image in the unutilized dimension 
// this functions accept the first image defined in XY space
// reutrns the output hidden image in XYZ space
function generateLetterTarget(inputLetterPointsXY: Array<Point>, outputLetterPointsXY: Array<Point>): Array<Point> {
    if (inputLetterPointsXY.length == 0 || outputLetterPointsXY.length == 0) return []

    // for each point we will traverse the input points (they are in closed loop)
    // until we hit or go past the target X value 

    let currentInputLetterIdx = 0;
    let returnLetters: Array<Point> = []

    outputLetterPointsXY.forEach(tp => {
        let hiddenY = 0
        
        // go thru input point to find y value where we are hidden
        for (let i=currentInputLetterIdx; i<currentInputLetterIdx+inputLetterPointsXY.length;i++) {
            // check if hidden point is exacly on vertex
            let idx = i % inputLetterPointsXY.length
            let currentXPos:number = inputLetterPointsXY[idx]?.x || 0
            let currentYPos:number = inputLetterPointsXY[idx]?.y || 0
            if(tp.x === currentXPos) { hiddenY = tp.y; break; }

            // hidden point is along the segment - between point - lerp 
            let nextIdx = (currentInputLetterIdx+1) % inputLetterPointsXY.length
            let nextXPos:number = inputLetterPointsXY[nextIdx]?.x || 0
            let nextYPos:number = inputLetterPointsXY[nextIdx]?.y || 0
            if(currentXPos < tp.x && tp.x < nextXPos) {
                let t = (tp.x-currentXPos) / (nextXPos-currentXPos) // progress along segment
                hiddenY = t*nextYPos + (1.0-t)*currentYPos // lerp 
            }
        }

        let hiddenP = !currentRotationState ? { x:tp.x, y:hiddenY, z:tp.y} : { x:tp.x, y:tp.y, z:hiddenY}
        returnLetters.push(hiddenP)
    });

    return returnLetters
}

window.onload = () => { resize(); init() }
window.onresize = () => { resize() }

const isBetween = (x:number,a:number,b:number) => {
    return (a <= x && x <= b) || (b <= x && x <= a)
}