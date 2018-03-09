class Background {

    constructor() {
        this.x = 0;
        this.speed = 2;
    }

    update() {
        image(bgSprite, this.x, 0, bgSprite.width, height);
        this.x += -this.speed;
        if (this.x <= -bgSprite.width + width) {
            image(bgSprite, this.x + bgSprite.width, 0, bgSprite.width, height);
            if (this.x <= -bgSprite.width) {
                this.x = 0;
            }
        }
    }

}
