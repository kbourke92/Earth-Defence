window.onload = function () {
    // Setup canvas and context
    const canvas = document.getElementById("Canvas") || document.querySelector("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const c = canvas.getContext("2d");

    // Game state
    let mouse = { x: innerWidth / 2, y: innerHeight - 33 };
    let score = 0;
    let health = 100;

    // Sizes and resources
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
    playerImg.src = "assets/Images/spaceship.png";
    const enemyImg = new Image();
    enemyImg.src = "assets/Images/alien.png";
    const healthkitImg = new Image();
    healthkitImg.src = "assets/Images/Healthkit.png";

    // Arrays
    let bullets = [];
    let enemies = [];
    let healthkits = [];

    // Input
    canvas.addEventListener("mousemove", function (event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    canvas.addEventListener("touchmove", function (event) {
        const rect = canvas.getBoundingClientRect();
        const t = event.changedTouches[0];
        const touchX = Math.round(t.clientX - rect.left);
        const touchY = Math.round(t.clientY - rect.top);
        event.preventDefault();
        mouse.x = touchX;
        mouse.y = touchY;
    }, { passive: false });

    // Constructors
    function Player(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.draw = function () {
            c.drawImage(playerImg, this.x, this.y, this.width, this.height);
        };

        this.update = function () {
            // center player on mouse
            this.x = mouse.x - this.width / 2;
            this.y = mouse.y - this.height / 2;
            this.draw();
        };
    }

    function Bullet(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;

        this.draw = function () {
            c.fillStyle = "white";
            c.fillRect(this.x, this.y, this.width, this.height);
        };

        this.update = function () {
            this.y -= this.speed;
            this.draw();
        };
    }

    function Enemy(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;

        this.draw = function () {
            c.drawImage(enemyImg, this.x, this.y, this.width, this.height);
        };

        this.update = function () {
            this.y += this.speed;
            this.draw();
        };
    }

    function Healthkit(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;

        this.draw = function () {
            c.drawImage(healthkitImg, this.x, this.y, this.width, this.height);
        };

        this.update = function () {
            this.y += this.speed;
            this.draw();
        };
    }

    const player = new Player(mouse.x, mouse.y, playerWidth, playerHeight);

    function spawnEnemies() {
        for (let i = 0; i < 4; i++) {
            const x = Math.random() * (innerWidth - enemyWidth);
            const y = -enemyHeight;
            const speed = 1 + Math.random() * 2;
            enemies.push(new Enemy(x, y, enemyWidth, enemyHeight, speed));
        }
    }
    setInterval(spawnEnemies, 1250);

    function spawnHealthkits() {
        const x = Math.random() * (innerWidth - healthkitWidth);
        const y = -healthkitHeight;
        const speed = 1 + Math.random() * 2.8;
        healthkits.push(new Healthkit(x, y, healthkitWidth, healthkitHeight, speed));
    }
    setInterval(spawnHealthkits, 13000);

    function shoot() {
        const x = mouse.x - bulletWidth / 2;
        const y = mouse.y - playerHeight / 2;
        bullets.push(new Bullet(x, y, bulletWidth, bulletHeight, bulletSpeed));
    }
    setInterval(shoot, 200);

    function collision(a, b) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }

    c.font = "20px Arial";

    function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, innerWidth, innerHeight);

        // HUD
        c.fillStyle = "white";
        c.fillText("Health: " + health, 10, 30);
        c.fillText("Score: " + score, innerWidth - 140, 30);

        player.update();

        // bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].update();
            if (bullets[i].y + bullets[i].height < 0) bullets.splice(i, 1);
        }

        // enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].update();
            if (enemies[i].y > innerHeight) {
                enemies.splice(i, 1);
                health -= 10;
                if (health <= 0) {
                    alert("Game Over!\nYour score is " + score);
                    // reset basic state
                    enemies = [];
                    bullets = [];
                    health = 100;
                    score = 0;
                }
            }
        }

        // bullets vs enemies
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

        // healthkits update & pickup
        for (let i = healthkits.length - 1; i >= 0; i--) {
            healthkits[i].update();
            if (healthkits[i].y > innerHeight) {
                healthkits.splice(i, 1);
                continue;
            }
            // pickup by player
            if (collision(healthkits[i], player)) {
                health = Math.min(100, health + 20);
                healthkits.splice(i, 1);
            }
        }
    }

    animate();
};