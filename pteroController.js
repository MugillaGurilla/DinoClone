import Pterodactyl from "./pterodactyl.js";

export default class PteroController
{
    PTERO_INTERVAL_MIN = 2500;
    PTERO_INTERVAL_MAX = 5000;
    nextPteroInterval = null;
    // This list, though innocuous looking, contains all Ptero objects
    allPteros = [];

    constructor(context, pteroImages, 
                scaleRatio, speed)
    {
        this.context = context;
        this.canvas = context.canvas;
        this.pteroImages = pteroImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;

        this.setNextPteroTime();
    }

    setNextPteroTime() 
    {
        const number = this.getRandomNumber(
            this.PTERO_INTERVAL_MIN, 
            this.PTERO_INTERVAL_MAX
        );

        this.nextPteroInterval = number;
    }

    getRandomNumber(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createPtero()
    {
        const index = this.getRandomNumber(0, this.pteroImages.length - 1);
        const pteroImage = this.pteroImages[index]
        const x = this.canvas.width * 1.5;
        const y = -pteroImage.height / 4;
        const pterodactyl = new Pterodactyl(
            this.context, 
            x, y, 
            pteroImage.width, 
            pteroImage.height, 
            pteroImage.image
        );
        this.allPteros.push(pterodactyl);
    }

    update(gameSpeed, frameTimeDelta)
    {
        if (this.nextPteroInterval <= 0)
        {
            this.createPtero();
            this.setNextPteroTime();
        }
        this.nextPteroInterval -= frameTimeDelta;

        this.allPteros.forEach((ptero) => {
            ptero.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
        });

        // This will remove cacti from memory as they exit screen left
        this.allPteros = this.allPteros.filter((ptero) => 
            ptero.x > -ptero.width
        );
    }

    collideWith(sprite)
    {
        return this.allPteros.some((ptero) => ptero.collideWith(sprite));
    }

    reset() 
    {
        this.allPteros = [];
    }

    draw() 
    {
        this.allPteros.forEach((ptero) => ptero.draw());
    }
}