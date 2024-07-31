const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 480;  // Increased width
canvas.height = 640; // Increased height

const birdImg = createBirdImage();
const pipeTopImg = createPipeImage('#228B22');
const pipeBottomImg = createPipeImage('#32CD32');
const groundImg = createGroundImage();

const bird = {
    x: 70, // Adjusted position
    y: 200,
    width: 34,
    height: 24,
    gravity: 0.6,
    lift: -10, // Lower jump height
    velocity: 0
};

const pipes = [];
const pipeWidth = 52;
const pipeGap = 200; // Increased gap to match larger canvas
let frame = 0;
let score = 0;
let highScore = 0;
let gameSpeed = 2;
let isGameRunning = false;

function createBirdImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 34;
    canvas.height = 24;
    ctx.fillStyle = 'yellow';
    ctx.fillRect(0, 0, 34, 24);
    return canvas;
}

function createPipeImage(color) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 52;
    canvas.height = 320;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 52, 320);
    return canvas;
}

function createGroundImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 480; // Adjusted width to match canvas
    canvas.height = 40;
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, 480, 40);
    return canvas;
}

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(pipeTopImg, pipe.x, 0, pipeWidth, pipe.top);
        ctx.drawImage(pipeBottomImg, pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
}

function drawGround() {
    ctx.drawImage(groundImg, 0, canvas.height - groundImg.height);
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height - groundImg.height || bird.y < 0) {
        resetGame();
    }
}

function updatePipes() {
    if (frame % 90 === 0) {
        const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - groundImg.height));
        const bottomHeight = canvas.height - topHeight - pipeGap - groundImg.height;
        pipes.push({ x: canvas.width, top: topHeight, bottom: bottomHeight });
    }

    pipes.forEach(pipe => {
        pipe.x -= gameSpeed;

        if (pipe.x + pipeWidth < 0) {
            pipes.shift();
            score++;
            document.getElementById('score').textContent = score;
            if (score > highScore) {
                highScore = score;
                document.getElementById('high-score').textContent = highScore;
            }

            if (score % 10 === 0) {
                gameSpeed += 0.5; // Increase speed every 10 points
            }
        }

        if (bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)) {
            resetGame();
        }
    });
}

function resetGame() {
    bird.y = 200;
    bird.velocity = 0;
    pipes.length = 0;
    frame = 0;
    score = 0;
    gameSpeed = 2;
    document.getElementById('score').textContent = score;
    isGameRunning = false;
    document.getElementById('start-button').style.display = 'block';
}

function loop() {
    if (!isGameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    drawBird();
    drawPipes();
    updateBird();
    updatePipes();
    frame++;
    requestAnimationFrame(loop);
}

document.getElementById('start-button').addEventListener('click', () => {
    isGameRunning = true;
    document.getElementById('start-button').style.display = 'none';
    loop();
});

document.addEventListener('keydown', () => {
    if (isGameRunning) {
        bird.velocity = bird.lift;
    }
});
