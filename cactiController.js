import Cactus from "./cactus.js";

export default class CactiController
{
    CACTUS_INTERVAL_MIN = 500;
    CACTUS_INTERVAL_MAX = 2000;
    nextCactusInterval = null;
    cacti = [];

    constructor(context, cactiImages, 
                scaleRatio, speed)
    {
        this.context = context;
        this.canvas = context.canvas;
        this.cactiImages = cactiImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;

        this.setNextCactusTime();
    }

    setNextCactusTime() 
    {
        const number = this.getRandomNumber(
            this.CACTUS_INTERVAL_MIN, 
            this.CACTUS_INTERVAL_MAX
        );

        this.nextCactusInterval = number;
    }

    getRandomNumber(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createCactus()
    {
        const index = this.getRandomNumber(0, this.cactiImages.length - 1);
        const cactusImage = this.cactiImages[index];
        const x = this.canvas.width * 1.5;
        const y =  this.canvas.height - cactusImage.height;
        const cactus = new Cactus(
            this.context, 
            x, y, 
            cactusImage.width, 
            cactusImage.height, 
            cactusImage.image
        );

        this.cacti.push(cactus);
    }

    update(gameSpeed, frameTimeDelta)
    {
        if (this.nextCactusInterval <= 0)
        {
            this.createCactus();
            this.setNextCactusTime();
        }
        this.nextCactusInterval -= frameTimeDelta;

        // This moves the cacti right to left
        this.cacti.forEach((cactus) => {
            cactus.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
        });

        // This will remove cacti from memory as they exit screen left
        this.cacti = this.cacti.filter((cactus) => 
            cactus.x > -cactus.width
        );
    }

    collideWith(sprite)
    {
        return this.cacti.some((cactus) => cactus.collideWith(sprite));
    }

    reset() 
    {
        this.cacti = [];
    }

    draw() 
    {
        this.cacti.forEach((cactus) => cactus.draw());
    }
}