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
    }
}