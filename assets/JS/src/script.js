window.onload = function () {
    const canvas = document.getElementById("Canvas") || document.querySelector("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const c = canvas.getContext("2d");

    const scoreElement = document.getElementById("score");
    const healthElement = document.getElementById("health");

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
    playerImg.src = "assets/images/spaceship.png";
    const enemyImg = new Image();
    enemyImg.src = "assets/images/alien.png";
    const healthkitImg = new Image();
    healthkitImg.src = "assets/images/Healthkit.png";

    let bullets = [];
    let enemies = [];
    let healthkits = [];

    /* Player class */
    function Player(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 5;
        this.dx = 0;
        this.dy = 0;

        this.draw = function () {
            c.drawImage(playerImg, this.x, this.y, this.width, this.height);
        };

        this.update = function () {
            this.x += this.dx;
            this.y += this.dy;

            /* Code to stay within canvas */
            this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));

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

    /* Create the player */
    const player = new Player(canvas.width / 2 - playerWidth / 2, canvas.height - playerHeight - 20, playerWidth, playerHeight);

    /* Keyboard input */
    document.addEventListener("keydown", function (e) {
        switch (e.key) {
            case "ArrowLeft":
            case "a":
                player.dx = -player.speed;
                break;
            case "ArrowRight":
            case "d":
                player.dx = player.speed;
                break;
            case "ArrowUp":
            case "w":
                player.dy = -player.speed;
                break;
            case "ArrowDown":
            case "s":
                player.dy = player.speed;
                break;
        }
    });

    document.addEventListener("keyup", function (e) {
        switch (e.key) {
            case "ArrowLeft":
            case "a":
            case "ArrowRight":
            case "d":
                player.dx = 0;
                break;
            case "ArrowUp":
            case "w":
            case "ArrowDown":
            case "s":
                player.dy = 0;
                break;
        }
    });

    function spawnEnemies() {
        for (let i = 0; i < 4; i++) {
            const x = Math.random() * (canvas.width - enemyWidth);
            const y = -enemyHeight;
            const speed = 1 + Math.random() * 2;
            enemies.push(new Enemy(x, y, enemyWidth, enemyHeight, speed));
        }
    }
    setInterval(spawnEnemies, 1250);

    function spawnHealthkits() {
        const x = Math.random() * (canvas.width - healthkitWidth);
        const y = -healthkitHeight;
        const speed = 1 + Math.random() * 2.8;
        healthkits.push(new Healthkit(x, y, healthkitWidth, healthkitHeight, speed));
    }
    setInterval(spawnHealthkits, 13000);

    function shoot() {
        const x = player.x + player.width / 2 - bulletWidth / 2;
        const y = player.y;
        bullets.push(new Bullet(x, y, bulletWidth, bulletHeight, bulletSpeed));
    }
    setInterval(shoot, 200);

    function collision(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);

        player.update();

        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].update();
            if (bullets[i].y + bullets[i].height < 0) bullets.splice(i, 1);
        }

        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].update();
            if (enemies[i].y > canvas.height) {
                enemies.splice(i, 1);
                health -= 10;
                if (health <= 0) {
                    alert("Game Over!\nYour score is " + score);
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
            if (healthkits[i].y > canvas.height) {
                healthkits.splice(i, 1);
                continue;
            }
            if (collision(healthkits[i], player)) {
                health = Math.min(100, health + 20);
                healthkits.splice(i, 1);
            }
        }

        /* Update DOM */
        scoreElement.textContent = score;
        healthElement.textContent = health;
    }

    animate();
};
