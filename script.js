const startButton = document.getElementById('startButton');
const drawButton = document.getElementById('drawButton');
const eraseButton = document.getElementById('eraseButton');
const randomButton = document.getElementById('randomButton');


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resolution = 20;
canvas.width = 1500;
canvas.height = 1500;
const cols = canvas.width / resolution;
const rows = canvas.height / resolution;

let isDrawing = false;
let isErasing = false;
let isRunning = false;

let isDrawingMode = false;
let isErasingMode = false;


// // Create 2D array
let mainGrid = Array.from({ length: rows }, () => Array(cols).fill(0));

startButton.addEventListener('click', function () {
    !isRunning ? start() : stop();
});

drawButton.addEventListener('click', function () {
    isDrawingMode = !isDrawingMode
    isErasingMode = false;
    drawGrid()
    if (isDrawingMode) {
        canvas.addEventListener("mousedown", startDraw);
        canvas.addEventListener('mousemove', mouseDraw);
        canvas.addEventListener("mouseup", endDraw);
    }
    else {
        canvas.removeEventListener("mousedown", startDraw);
        canvas.removeEventListener('mousemove', mouseDraw);
        canvas.removeEventListener("mouseup", endDraw);
    }
});

eraseButton.addEventListener('click', function () {
    isErasingMode = !isErasingMode
    isDrawingMode = false
    drawGrid()
    if (isErasingMode) {
        canvas.addEventListener("mousedown", startDraw);
        canvas.addEventListener('mousemove', mouseDraw);
        canvas.addEventListener("mouseup", endDraw);
    }
    else {
        canvas.removeEventListener("mousedown", startDraw);
        canvas.removeEventListener('mousemove', mouseDraw);
        canvas.removeEventListener("mouseup", endDraw);
    }
});


randomButton.addEventListener('click', function () {
    creat2DArray(rows, cols)
    drawGrid()
});


const startDraw = (event) => {
    isDrawing = true;
    mouseDraw(event);
}

const endDraw = () => {
    isDrawing = false;
    ctx.beginPath();
}

const mouseDraw = (event) => {

    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect()

    const scaleX = canvas.width / rect.width; // Scale to match the canvas size
    const scaleY = canvas.height / rect.height; // Scale to match the canvas size

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const xx = Math.floor(x / resolution)
    const yy = Math.floor(y / resolution)


    if (isDrawingMode) {
        mainGrid[xx][yy] = 1

        ctx.fillStyle = 'red';
    }
    else {
        mainGrid[xx][yy] = 0

        ctx.fillStyle = 'white';
    }
    ctx.fillRect(xx * resolution, yy * resolution, resolution, resolution);

}

const mouseErase = (event) => {

    if (!isErasing) return;

    const rect = canvas.getBoundingClientRect()

    const scaleX = canvas.width / rect.width; // Scale to match the canvas size
    const scaleY = canvas.height / rect.height; // Scale to match the canvas size

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const xx = Math.floor(x / resolution)
    const yy = Math.floor(y / resolution)

    mainGrid[xx][yy] = 0

    ctx.fillStyle = 'white';
    ctx.fillRect(xx * resolution, yy * resolution, resolution, resolution);

}


const creat2DArray = (rows, cols) => {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            mainGrid[i][j] = Math.floor(Math.random() * 2)
        }
    }
    console.log("2d array created");
};

const drawGrid = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const x = i * resolution;
            const y = j * resolution;
            if (mainGrid[i][j] === 1) {
                ctx.fillStyle = 'red';
                ctx.fillRect(x, y, resolution, resolution);
            }
            ctx.strokeStyle = 'black';
            ctx.strokeRect(x, y, resolution, resolution);
        }
    }
}

const updateGrid = () => {
    const newGrid = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const cell = mainGrid[i][j];
            const neighbors = countNeighbors(mainGrid, i, j)
            if (cell === 1 && (neighbors < 2 || neighbors > 3)) {
                newGrid[i][j] = 0;
            } else if (cell === 0 && neighbors === 3) {
                newGrid[i][j] = 1;
            } else {
                newGrid[i][j] = cell
            }
        }
    }
    mainGrid = newGrid;
}

const countNeighbors = (grid, x, y) => {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let col = (i + x);
            let row = (j + y);
            if (col < 0) {
                col = 0
            }
            if (row < 0) {
                row = 0
            }
            if (col >= cols) {
                col--
            }
            if (row >= rows) {
                row--
            }
            sum += grid[col][row]
        }
    }
    sum -= grid[x][y]
    return sum

}


let frameCount = 0;
const framesPerUpdate = 10;

function update() {
    frameCount++;
    if (isRunning) {
        if (frameCount >= framesPerUpdate) {
            frameCount = 0;

            updateGrid();
            drawGrid();
        }
        requestAnimationFrame(update);
    }
}

function start() {
    isRunning = true;
    startButton.textContent = "Stop"
    update()
}

function stop() {
    isRunning = false;
    startButton.textContent = "Start"
}

