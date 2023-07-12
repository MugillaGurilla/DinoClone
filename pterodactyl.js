export default class Pterodactyl
{
    // Ptero animation stuff
    FLY_ANIMATION_TIMER = 400;
    flyAnimationTimer = this.FLY_ANIMATION_TIMER;
    pteroFlyImages = [];

    constructor(context, x, y,
                width, height,
                image)
    {
        this.context = context;
        this.canvas = context.canvas;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;

        const pteroFlyImage1 = new Image();
        pteroFlyImage1.src = "images/ptero_1.png";
        const pteroFlyImage2 = new Image();
        pteroFlyImage2.src = "images/ptero_2.png";
        this.pteroFlyImages.push(pteroFlyImage1);
        this.pteroFlyImages.push(pteroFlyImage2);
    }

    update(speed, gameSpeed, frameTimeDelta, scaleRatio)
    {
        this.fly(gameSpeed, frameTimeDelta);
        this.move(speed, gameSpeed, frameTimeDelta, scaleRatio);
    }

    move(speed, gameSpeed, frameTimeDelta, scaleRatio)
    {
        this.x -= speed * gameSpeed * frameTimeDelta * scaleRatio;
    }

    fly(gameSpeed, frameTimeDelta)
    {
        if (this.flyAnimationTimer <= 0)
        {
            if (this.image === this.pteroFlyImages[0])
            {
                this.image = this.pteroFlyImages[1];
            }
            else
            {
                this.image = this.pteroFlyImages[0];
            }
            this.flyAnimationTimer = this.FLY_ANIMATION_TIMER;
        }

        this.flyAnimationTimer -=frameTimeDelta * gameSpeed;
    }

    collideWith(sprite)
    {
        const adjustby = 2.0;
        if (
            sprite.x < this.x + this.width / adjustby &&
            sprite.x + sprite.width / adjustby > this.x &&
            sprite.y < this.y + this.height / adjustby &&
            sprite.y / adjustby + sprite.height > this.y
            )
        {
            return true;
        }
        else 
        {
            return false;
        }
    }

    draw() 
    {
        this.context.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}