export class Enemy {
    constructor(x, y, width, height, speed, ctx, img) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.ctx = ctx;
        this.img = img;
    }

    draw() {
        if (this.img && this.img.complete) {
            this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } else {
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    update() {
        this.y += this.speed;
        this.draw();
    }
}
