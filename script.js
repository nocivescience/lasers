const game = document.getElementById('game');
const score = document.getElementById('score');
const ctx = game.getContext('2d');
game.width = 800;
game.height = 600;
let scoreCount = 0;
let time = 1000;
let enemyInterval;
const audio = new Audio('images/enemigo.wav');

class Laser {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.dy = 10;
        this.color = color;
    }
    update() {
        this.y -= this.dy;
    }
    draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, 1, 10);
    }
}

class Enemy {
    constructor(image) {
        this.image = image;
        this.x = Math.random() * game.width;
        this.y = 0;
        this.dy = 2;
    }
    update() {
        this.y += this.dy;
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, 50, 50);
    }
}

const lasers = [];
const enemies = [];
const colors = ['yellow', 'red', 'green', 'blue'];

function spawnEnemies() {
    const blood = new Image();
    blood.src = "images/blood.png";
    const cake = new Image();
    cake.src = "images/cake.png";
    const diversity = new Image();
    diversity.src = "images/diversity.png";
    const family = new Image();
    family.src = "images/family.png";
    const love = new Image();
    love.src = "images/love.png";
    const listEnemies= [blood, cake, diversity, family, love];
    return listEnemies[Math.floor(Math.random() * listEnemies.length)];
}

function updateEnemies() {
    const enemy = spawnEnemies();
    const newEnemy = new Enemy(enemy);
    enemies.push(newEnemy);
    newEnemy.draw();
}

function manageEnemySpawn() {
    if (enemyInterval) clearInterval(enemyInterval);
    enemyInterval = setInterval(() => {
        updateEnemies();
    }, time);
}

// Inicializar el primer intervalo
manageEnemySpawn();

function animate() {
    ctx.clearRect(0, 0, game.width, game.height);
    
    // Actualizar enemigos
    enemies.forEach((enemy, index) => {
        enemy.update();
        enemy.draw();
        if (enemy.y > game.height) {
            enemies.splice(index, 1);
        }
    });
    
    // Actualizar láseres
    lasers.forEach((laser, index) => {
        laser.update();
        laser.draw();
        if (laser.y < 0) {
            lasers.splice(index, 1);
        }
        if (enemies.length > 0) {
            enemies.forEach((enemy, enemyIndex) => {
                if (laser.x < enemy.x + 50 && laser.x + 1 > enemy.x && laser.y < enemy.y + 50 && laser.y + 10 > enemy.y) {
                    enemies.splice(enemyIndex, 1);
                    lasers.splice(index, 1);
                    scoreCount++;
                    audio.play();
                    audio.volume = 0.2;
                    // Actualizar el tiempo del intervalo según el score
                    if (scoreCount > 10) {
                        time = 500;
                    } else if (scoreCount > 20) {
                        time = 300;
                    }
                    manageEnemySpawn();
                }
            });
        }
    });
    
    // Actualizar puntaje
    score.innerHTML = scoreCount;
    
    requestAnimationFrame(animate);
}

document.addEventListener('click', (e) => {
    const rect = game.getBoundingClientRect();
    const color = colors[Math.floor(Math.random() * colors.length)];
    const laser = new Laser(e.clientX - rect.left, e.clientY - rect.top, color);
    lasers.push(laser);
    laser.draw();
});

animate();
