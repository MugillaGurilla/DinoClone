export default class Ground 
{
    constructor (context, 
                width, height, 
                speed, scaleRatio)
    {
        this.context = context;
        this.canvas = context.canvas;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.scaleRatio = scaleRatio;

        this.x = 0;
        this.y = this.canvas.height - this.height; // second height is of the ground

        this.groundImage = new Image();
        this.groundImage.src = "images/ground.png";
    }

    update(gameSpeed, frameTimeDelta)
    {
        this.x -= gameSpeed * frameTimeDelta * this.speed * this.scaleRatio;
    }

    reset()
    {
        this.x = 0;   
    }

    draw()
    {
        this.context.drawImage(
            this.groundImage, 
            this.x, this.y, 
            this.width, this.height
        );

        // These bits below  loop the round so it displays continuously. 
        this.context.drawImage(
            this.groundImage, 
            this.x + this.width, this.y, 
            this.width, this.height
        );

        if (this.x < -this.width)
        {
            this.x = 0;
        }
    }
}