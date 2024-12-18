const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 30;
let snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box
};

let food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
};

let score = 0;
let d;
let level = 1;
let speed = 100;

const startSound = new Audio('start.mp3');
const levelUpSound = new Audio('levelUp.mp3');
const gameOverSound = new Audio('gameOver.mp3');
const backgroundMusic = new Audio('background.mp3');


backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;


window.addEventListener('load', () => {
    startSound.play();

    
    startSound.onended = () => {
        backgroundMusic.play();
    };
});

document.addEventListener("keydown", direction);

function direction(event) {
    if ((event.keyCode == 37 || event.keyCode == 65) && d !== "RIGHT") {
        d = "LEFT";
    } else if ((event.keyCode == 38 || event.keyCode == 87) && d !== "DOWN") {
        d = "UP";
    } else if ((event.keyCode == 39 || event.keyCode == 68) && d !== "LEFT") {
        d = "RIGHT";
    } else if ((event.keyCode == 40 || event.keyCode == 83) && d !== "UP") {
        d = "DOWN";
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function levelUp() {
    if (score === 5 * level) {
        level++;
        speed -= 10;
        clearInterval(game);
        game = setInterval(draw, speed);
        document.getElementById('level').innerText = "Nivel: " + level;

        
        levelUpSound.play();
        backgroundMusic.volume = 0.2;

        
        levelUpSound.onended = () => {
            backgroundMusic.volume = 0.5;
        };
    }
}

function generateFood() {
    do {
        food.x = Math.floor(Math.random() * (canvas.width / box)) * box;
        food.y = Math.floor(Math.random() * (canvas.height / box)) * box;
    } while (collision(food, snake));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height) {
        clearInterval(game);

        
        backgroundMusic.pause();
        gameOverSound.play();

        setTimeout(() => {
            alert(`Perdiste maní :/ Puntos: ${score}, Nivel: ${level}`);
        }, 3000); 
        return;
    }

    if (d === "LEFT") snakeX -= box;
    if (d === "UP") snakeY -= box;
    if (d === "RIGHT") snakeX += box;
    if (d === "DOWN") snakeY += box;

    
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById('score').innerText = "Score: " + score;
        generateFood();
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    
    if (collision(newHead, snake)) {
        clearInterval(game);

        
        backgroundMusic.pause();
        gameOverSound.play();

        setTimeout(() => {
            alert(`Game Over! Score: ${score}, Nivel: ${level}`);
        }, 3000); 
        return;
    }

    snake.unshift(newHead);

    levelUp();
}

function saveProgress() {
    localStorage.setItem("snakeGameScore", score);
    localStorage.setItem("snakeGameLevel", level);
    alert("Progreso guardado");
}

function loadProgress() {
    score = parseInt(localStorage.getItem("snakeGameScore")) || 0;
    level = parseInt(localStorage.getItem("snakeGameLevel")) || 1;
    speed = 100 - (level - 1) * 10;
    document.getElementById('score').innerText = "Puntuación: " + score;
    document.getElementById('level').innerText = "Nivel: " + level;
    clearInterval(game);
    game = setInterval(draw, speed);
    alert("Progreso cargado");
}

function resetGame() {
    score = 0;
    level = 1;
    speed = 100;
    snake = [{ x: 9 * box, y: 10 * box }];
    d = null;
    generateFood();
    clearInterval(game);
    game = setInterval(draw, speed);
    document.getElementById('score').innerText = "Puntuación: " + score;
    document.getElementById('level').innerText = "Nivel: " + level;

    
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    
    startSound.play();
    startSound.onended = () => {
        backgroundMusic.play();
    };
}

let game = setInterval(draw, speed);
