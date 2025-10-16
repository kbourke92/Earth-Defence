export class Player {
    constructor(ctx, mouse, width, height, img) {
        this.ctx = ctx;
        this.mouse = mouse;
        this.width = width;
        this.height = height;
        this.img = img;
        this.x = mouse.x;
        this.y = mouse.y;
    }

    draw() {
        if (this.img && this.img.complete) {
            this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } else {
            // fallback rectangle while image loads
            this.ctx.fillStyle = 'cyan';
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    update() {
        this.x = this.mouse.x - this.width / 2;
        this.y = this.mouse.y - this.height / 2;
        this.draw();
    }
}
