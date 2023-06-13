export default class Score 
{
    score = 0;
    HIGH_SCORE_KEY = "highScore";

    constructor (context, scaleRatio)
    {
        this.context = context;
        this.canvas = context.canvas;
        this.scaleRatio = scaleRatio;
    }

    update(frameTimeDelta)
    {
        this.score += frameTimeDelta * 0.01;
    }

    reset()
    {
        this.score = 0;
    }

    setHighScore()
    {
        const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
        if (this.score > highScore)
        {
            localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
        }
    }

    draw()
    {
        const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
        const y = 20 * this.scaleRatio;
        const fontSize = 20 * this.scaleRatio;
        this.context.font = `${fontSize}px Verdana`;
        this.context.fillStyle = "#525250";
        const currScoreX = this.canvas.width - 75 * this.scaleRatio;
        const highScoreX = currScoreX - 125 * this.scaleRatio;
        const paddedScore = Math.floor(this.score).toString().padStart(6,0);
        const paddedHighScore = Math.floor(highScore).toString().padStart(6,0);
        this.context.fillText(paddedScore, currScoreX, y);
        this.context.fillText(`HI ${paddedHighScore}`, highScoreX, y);
    }
}