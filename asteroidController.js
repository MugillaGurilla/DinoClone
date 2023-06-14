import Asteroid from "./asteroid.js";

export default class AsteroidController
{
    ASTRO_INTERVAL_MIN = 2500;
    ASTRO_INTERVAL_MAX = 5000;
    nextAstroInterval = null;
    // This list, though innocuous looking, contains all Asteroid objects
    allAstros = [];

    constructor(context, astroImages, 
                scaleRatio, speed)
    {
        this.context = context;
        this.canvas = context.canvas;
        this.astroImages = astroImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;

        this.setNextAstroTime();
    }

    setNextAstroTime() 
    {
        const number = this.getRandomNumber(
            this.ASTRO_INTERVAL_MIN, 
            this.ASTRO_INTERVAL_MAX
        );

        this.nextAstroInterval = number;
    }

    getRandomNumber(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createAstro()
    {
        const index = this.getRandomNumber(0, this.astroImages.length - 1);
        const astroImage = this.astroImages[index]
        const x = this.getRandomNumber(this.canvas.width * 1.5, this.canvas.width * 2.5);
        const y = -this.canvas.height * 1.5;
        const asteroid = new Asteroid(
            this.context, 
            x, y, 
            astroImage.width, 
            astroImage.height, 
            astroImage.image
        );
        // console.log(x);
        this.allAstros.push(asteroid);
    }

    update(gameSpeed, frameTimeDelta)
    {
        if (this.nextAstroInterval <= 0)
        {
            this.createAstro();
            this.setNextAstroTime();
        }
        this.nextAstroInterval -= frameTimeDelta;

        // This moves the asteroids diagonally down right to left
        this.allAstros.forEach((astro) => {
            astro.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
        });

        // This will remove cacti from memory as they exit screen left
        this.allAstros = this.allAstros.filter((astro) => 
            astro.y < astro.height + this.canvas.height
        );

        console.log(this.allAstros.length);
    }

    collideWith(sprite)
    {
        return this.allAstros.some((astro) => astro.collideWith(sprite));
    }

    reset() 
    {
        this.allAstros = [];
    }

    draw() 
    {
        this.allAstros.forEach((astro) => astro.draw());
    }
}