window.onload = function () {
    var c = document.getElementById("Canvas");
    var canvas = this.document.querySelector("canvas");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    c = c.getContext("2d");

    function startGame() {
        mouse = {
            x: innerWidth / 2,
            y: innerHeight - 33
        };

        touch = {
            x: innerWidth / 2,
            y: innerHeight - 33
        };

        canvas.addEventListener("mousemove", function (event) {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        });

        canvas.addEventListener("touchmove", function (event) {
            var rect = canvas.getBoundingClientRect();
            var root = document.documentElement;
            var touch = event.changedTouches[0];
            var touchX = parseInt(touch.clientX);
            var touchY = parseInt(touch.clientY) - rect.top - root.scrollTop;
            event.preventDefault();
            mouse.x = touchX;
            mouse.y = touchY;
        });
        var player_width = 33;
        var player_height = 33;
        var img = new Image();
        var score = 0;
        var health = 100;
        playerImg.src = "spaceship.png";

        var_bullets = [];
        var_bullet_width = 7;
        var_bullet_height = 9;
        var_bullet_speed = 10;

        var_enemies = [];
        var_enemyImg = new Image();
        enemyImg.src = "alien.png";
        var_enemy_width = 33;
        var_enemy_height = 33;
        var_enemy_speed = 1;
        var_enemy_spawn_rate = 30;
        var_enemy_spawn_timer = 0;

        var_healthkits = [];
        var_healthkitImg = new Image();
        healthkitImg.src = "Healthkit.png";
        var_healthkit_width = 33;
        var_healthkit_height = 33;
        var_healthkit_speed = 5;

        function Player(x, y, width, height, speed) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.speed = speed

            this.draw = function () {
                c.beginPath();
                c.drawImage(enemyImg, this.x, this.y);
            };

            this.update = function () {
                this.y = this.speed;
                this.draw();
            };
        }

        function Bullet(x, y, width, height, speed) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.speed = speed

            this.draw = function () {
                c.beginPath();
                c.rect(this.x, this.y, this.width, this.height);
                c.fillStyle = "white";
                c.fill();
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
                c.beginPath();
                c.drawImage(enemyImg, this.x, this.y);
            };

            this.update = function () {
                this.y += this.speed;
                this.draw();
            }

        }

        function Healthkit(x, y, width, height, speed) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.speed = speed;

            this.draw = function () {
                c.beginPath();
                c.drawImage(healthkitImg, this.x, this.y);
            };

            this.update = function () {
                this.y += this.speed;
                this.draw();
            }
        }

        var_player = new Player(mouse.x, mouse.y, player_width, player_height);
        function drawEnemies() {
            for (var _ = 0; _ < 4; _++) {
                varx = Math.random() * (innerWidth - enemy_width);
                var y = -enemy_height;
                var width = enemy_width;
                var height = enemy_height;
                var speed = Math.random() * 2;
                var_enemy = new Enemy(x, y, width, height, speed);
                enemies.push(_enemy);
            }

        } setInterval(drawEnemies, 1250);

        function drawHealthkits() {
            for (var _ = 0; _ < 1; _++) {
                varx = Math.random() * (innerWidth - enemy_width);
                var y = -enemy_height;
                var width = healthkit_width;
                var height = healthkit_height;
                var speed = Math.random() * 2.8;
                var_healthkit = new Healthkit(x, y, width, height, speed);
                var_healthkits.push(_healthkit);
            }
        } setInterval(drawHealthkits, 13000);

        function shoot() {
            for (var _ = 0; _ < 1; _++) {
                var x = mouse.x - var_bullet_width / 2;
                var y = mouse.y - player_height / 2;
                var_bullet = new Bullet(x, y, bullet_width, bullet_height, bullet_speed);
                _bullets.Push(_bullet);
            }
        } setInterval(shoot, 200);

    }

}