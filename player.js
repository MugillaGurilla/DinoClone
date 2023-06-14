export default class Player
{
    // Dino animation stuff
    WALK_ANIMATION_TIMER = 200;
    walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    dinoRunImages = [];

    // Dino jump stuff
    jumpPressed = false;
    jumpInProgress = false;
    isFalling = false;
    JUMP_SPEED = 0.6;
    BASE_GRAVITY = 0.4;
    baseGravity = this.BASE_GRAVITY;
    downArrowPressed = false;
    gravityIncreased = false;

    constructor (context, width, height, 
                minJumpHeight, maxJumpHeight, 
                scaleRatio)
    {
        this.context = context;
        this.canvas = context.canvas
        this.width = width;
        this.height = height;
        this.minJumpHeight = minJumpHeight;
        this.maxJumpHeight = maxJumpHeight;
        this.scaleRatio = scaleRatio;

        this.x = 10 * scaleRatio;
        this.y = this.canvas.height - this.height - (1.5 * scaleRatio);
        this.yStandingPosition = this.y;

        this.standingStillImage = new Image();
        this.standingStillImage.src = "images/standing_still.png";
        this.fallingDino = new Image();
        this.fallingDino.src = "images/falling_dino.png"
        this.surfingDino = new Image();
        this.surfingDino.src = "images/surfing_dino.png"
        this.image = this.standingStillImage;

        const dinoRunImage1 = new Image();
        dinoRunImage1.src = "images/dino_run1.png";
        const dinoRunImage2 = new Image();
        dinoRunImage2.src = "images/dino_run2.png";
        this.dinoRunImages.push(dinoRunImage1);
        this.dinoRunImages.push(dinoRunImage2);

        // KEYBOARD - Jump Event Listeners
        window.removeEventListener('keydown', this.keydown);
        window.removeEventListener('keyup', this.keyup);
        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);

        // TOUCH - Jump Event Listeners
        window.removeEventListener('touchstart', this.touchstart);
        window.removeEventListener('touchend', this.touchend);
        window.addEventListener('touchstart', this.touchstart);
        window.addEventListener('touchend', this.touchend);
    }

    keydown = (event) => 
    {
        if (event.code === "Space")
        {
            this.jumpPressed = true;
        }
        if (event.code === "ArrowDown")
        {
            this.downArrowPressed = true;
            this.gravityIncreased = true;
        }
    };

    keyup = (event) => 
    {
        if (event.code === "Space")
        {
            this.jumpPressed = false;
        }
        if (event.code === "ArrowDown")
        {
            this.downArrowPressed = false;
        }
    };

    touchstart = () => 
    {
        this.jumpPressed = true;
    }

    touchend = () =>
    {
        this.jumpPressed = false;
    }

    update(gameSpeed, frameTimeDelta)
    {
        this.run(gameSpeed, frameTimeDelta);
        if (this.jumpInProgress)
        {
            this.image = this.standingStillImage;
        }
        this.jump (frameTimeDelta);
    }

    jump(frameTimeDelta)
    {
        if (this.gravityIncreased && this.jumpInProgress)
        {
            this.image = this.fallingDino;
        }
        if (this.jumpPressed)
        {
            this.jumpInProgress = true;
        }
        if (this.jumpInProgress && !this.isFalling)
        {
            if (this.y > this.canvas.height - this.minJumpHeight ||
                (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed))
            {
                this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
            }
            else 
            {
                this.isFalling = true;
            }
        }
        else
        {
            if (this.y < this.yStandingPosition)
            {
                if (this.downArrowPressed)
                {
                    this.baseGravity *= 1.25;
                }
                this.y += this.baseGravity * frameTimeDelta * this.scaleRatio;
                if (this.y + this.height > this.canvas.height)
                {
                    this.y = this.yStandingPosition;
                }
            }
            else 
            {
                this.isFalling = false;
                this.jumpInProgress = false;
                this.baseGravity = this.BASE_GRAVITY;
                this.gravityIncreased = false;
            }
        }
    }

    surf()
    {
        if (this.downArrowPressed && !this.isFalling)
        {
            this.image = this.surfingDino;
        }
    }

    run(gameSpeed, frameTimeDelta)
    {
        if(this.walkAnimationTimer <=0 && !this.downArrowPressed)
        {
            if (this.image === this.dinoRunImages[0])
            {
                this.image = this.dinoRunImages[1];
            }
            else 
            {
                this.image = this.dinoRunImages[0];
            }

            this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
        }

        this.surf();

        this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
    }

    draw()
    {
        this.context.drawImage(this.image, this.x, this.y, this.width, this.height);    
    }
}