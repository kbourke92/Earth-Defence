import { Player } from './player.js';
import { Bullet } from './bullet.js';
import { Enemy } from './enemy.js';
import { Healthkit } from './healthkit.js';

const canvas = document.getElementById('Canvas') || document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext('2d');

let mouse = { x: innerWidth / 2, y: innerHeight - 33 };
let score = 0;
let health = 100;

const playerWidth = 33;
const playerHeight = 33;

const bulletWidth = 7;
const bulletHeight = 9;
const bulletSpeed = 10;

const enemyWidth = 33;
const enemyHeight = 33;

const healthkitWidth = 33;
const healthkitHeight = 33;

const playerImg = new Image();
playerImg.src = 'spaceship.png';
const enemyImg = new Image();
enemyImg.src = 'alien.png';
const healthkitImg = new Image();
healthkitImg.src = 'Healthkit.png';

let bullets = [];
let enemies = [];
let healthkits = [];

canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

canvas.addEventListener('touchmove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const t = e.changedTouches[0];
    mouse.x = Math.round(t.clientX - rect.left);
    mouse.y = Math.round(t.clientY - rect.top);
    e.preventDefault();
}, { passive: false });

const player = new Player(c, mouse, playerWidth, playerHeight, playerImg);

function spawnEnemies() {
    for (let i = 0; i < 4; i++) {
        const x = Math.random() * (innerWidth - enemyWidth);
        const y = -enemyHeight;
        const speed = 1 + Math.random() * 2;
        enemies.push(new Enemy(x, y, enemyWidth, enemyHeight, speed, c, enemyImg));
    }
}
setInterval(spawnEnemies, 1250);

function spawnHealthkits() {
    const x = Math.random() * (innerWidth - healthkitWidth);
    const y = -healthkitHeight;
    const speed = 1 + Math.random() * 2.8;
    healthkits.push(new Healthkit(x, y, healthkitWidth, healthkitHeight, speed, c, healthkitImg));
}
setInterval(spawnHealthkits, 13000);

function shoot() {
    const x = mouse.x - bulletWidth / 2;
    const y = mouse.y - playerHeight / 2;
    bullets.push(new Bullet(x, y, bulletWidth, bulletHeight, bulletSpeed, c));
}
setInterval(shoot, 200);

function collision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

c.font = '20px Arial';

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    c.fillStyle = 'white';
    c.fillText('Health: ' + health, 10, 30);
    c.fillText('Score: ' + score, innerWidth - 140, 30);

    player.update();

    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update();
        if (bullets[i].y + bullets[i].height < 0) bullets.splice(i, 1);
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
        if (enemies[i].y > innerHeight) {
            enemies.splice(i, 1);
            health -= 10;
            if (health <= 0) {
                alert('Game Over!\nYour score is ' + score);
                enemies = [];
                bullets = [];
                health = 100;
                score = 0;
            }
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        for (let j = bullets.length - 1; j >= 0; j--) {
            if (collision(enemies[i], bullets[j])) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                score++;
                break;
            }
        }
    }

    for (let i = healthkits.length - 1; i >= 0; i--) {
        healthkits[i].update();
        if (healthkits[i].y > innerHeight) {
            healthkits.splice(i, 1);
            continue;
        }
        if (collision(healthkits[i], player)) {
            health = Math.min(100, health + 20);
            healthkits.splice(i, 1);
        }
    }
}

animate();

// allow testing by importing the module in Node (optional)
export { canvas, c };
