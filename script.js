
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
let paused = 0;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resolution = 20;
canvas.width = 1500;
canvas.height = 1500;

const cols = canvas.width / resolution;
const rows = canvas.height / resolution;
// const gridContainer = document.getElementById('grid-container');

// // Create 2D array
let mainGrid = Array.from({ length: rows }, () => Array(cols).fill(0));

startButton.addEventListener('click', function () {
    start()
});

pauseButton.addEventListener('click', function () {
    if (paused)
        paused = 0;
    else
        paused = 1;
});



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
                ctx.fillStyle = 'black';
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

    if (frameCount >= framesPerUpdate && !paused) {
        frameCount = 0;

        updateGrid();
        drawGrid();
    }
    requestAnimationFrame(update);
}

function start() {
    creat2DArray(rows, cols);
    drawGrid();
    update();
}

