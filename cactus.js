export default class Cactus
{
    constructor(context, x, y,
                width, height,
                image)
    {
        this.context = context;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    }

    update(speed, gameSpeed, frameTimeDelta, scaleRatio)
    {
        this.x -= speed * gameSpeed * frameTimeDelta * scaleRatio;
    }

    collideWith(sprite)
    {
        const adjustby = 1.4;
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