// Global game variables are below. 
const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
import Player from './player.js';
import Ground from './ground.js';
import CactiController from './cactiController.js';
import Score from './score.js';

// Game constants
const GAME_SPEED_START = 1.00;
const GAME_SPEED_INCREMENT = 0.000_01;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;
const PLAYER_WIDTH = 88 / 1.5;
const PLAYER_HEIGHT = 94 / 1.5;
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;
const GROUND_CACTUS_SPEED = 0.5;
const CACTI_CONFIG = [
    {width: 48/1.5, height: 100/1.5, image: "images/cactus_1.png"},
    {width: 98/1.5, height: 100/1.5, image: "images/cactus_2.png"},
    {width: 68/1.5, height: 70/1.5, image: "images/cactus_3.png"},
];

// Game objects
let player = null;
let ground = null;
let cactiController = null;
let score = null;

// Game variables
let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

setScreen();

// Event Listners
window.addEventListener("resize", () => setTimeout(setScreen, 500));
if (screen.orientation)
{
    screen.orientation.addEventListener("change", setScreen);
}
window.addEventListener("keyup", reset, {once: true});
window.addEventListener("touchstart", reset, {once: true});

// Defining game functions
function createSprites()
{
    const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
    const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
    const minJumpInGame = MIN_JUMP_HEIGHT * scaleRatio;
    const maxJumpInGame = MAX_JUMP_HEIGHT * scaleRatio;
    const groundWidthInGame = GROUND_WIDTH * scaleRatio;
    const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

    player = new Player(
        context, 
        playerWidthInGame, 
        playerHeightInGame, 
        minJumpInGame, 
        maxJumpInGame, 
        scaleRatio
    );
    ground = new Ground(
        context,
        groundWidthInGame,
        groundHeightInGame, 
        GROUND_CACTUS_SPEED, 
        scaleRatio
    );
    const cactiImages = CACTI_CONFIG.map((cactus) => {
        const image = new Image();
        image.src = cactus.image;
        return {
            image: image,
            width: cactus.width * scaleRatio,
            height: cactus.height * scaleRatio,
        };
    });
    cactiController = new CactiController(
        context, 
        cactiImages, 
        scaleRatio, 
        GROUND_CACTUS_SPEED
    );
    score = new Score(
        context, 
        scaleRatio
    )
}

function setScreen()
{
    scaleRatio = getScaleRatio();
    canvas.width = GAME_WIDTH * scaleRatio;
    canvas.height = GAME_HEIGHT * scaleRatio;
    createSprites();
}

function getScaleRatio()
{
    const screenHeight = Math.min(
        window.innerHeight, 
        document.documentElement.clientHeight
    );
    const screenWidth = Math.min(
        window.innerWidth, 
        document.documentElement.clientWidth
    );

    if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT)
    {
        return screenWidth / GAME_WIDTH;
    }
    else 
    {
        return screenHeight / GAME_HEIGHT;
    }
}

function showStartGameText()
{
    const fontSize = 40 * scaleRatio;
    context.font = `${fontSize}px Verdana`;
    context.fillStyle = "grey";
    const x = canvas.width / 14;
    const y = canvas.height / 2;
    context.fillText("And So It Begins...", x, y);
}

function updateGameSpeed(frameTimeDelta)
{
    gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;
}

function showGameOver()
{
    const fontSize = 70 * scaleRatio;
    context.font = `${fontSize}px Verdana`;
    context.fillStyle = "grey";
    const x = canvas.width / 4.5;
    const y = canvas.height / 2;
    context.fillText("GAME OVER", x, y);
}

function setupGameReset()
{
    if (!hasAddedEventListenersForRestart)
    {
        hasAddedEventListenersForRestart = true;
        setTimeout(() => {
            window.addEventListener("keyup", reset, {once: true});
            window.addEventListener("touchstart", reset, {once: true});
        }, 2000);
    }
}

function reset()
{
    hasAddedEventListenersForRestart = false;
    gameOver = false;
    waitingToStart = false;
    ground.reset();
    cactiController.reset();
    score.reset();
    gameSpeed = GAME_SPEED_START;
}

function clearScreen()
{
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(currentTime)
{
    console.log(gameSpeed);

    // This defines delta time
    if (previousTime === null)
    {
        previousTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;
    }
    const frameTimeDelta = currentTime - previousTime;
    previousTime = currentTime;

    // This clears the screen at the start of each frame
    clearScreen();

    // This updates game objects
    if (!gameOver && !waitingToStart)
    {
        ground.update(gameSpeed, frameTimeDelta);
        cactiController.update(gameSpeed, frameTimeDelta);
        player.update(gameSpeed, frameTimeDelta);
        score.update(frameTimeDelta);
        updateGameSpeed(frameTimeDelta);
    }

    // This checks if the playercollides with any cacti
    // And then changes game over to true
    if (!gameOver && cactiController.collideWith(player))
    {
        gameOver = true;
        setupGameReset();
        score.setHighScore();
    }

    // Draws game objects
    ground.draw();
    cactiController.draw();
    player.draw();
    score.draw();

    // Game over text
    if (gameOver)
    {
        showGameOver();
    }

    // Start text
    if (waitingToStart)
    {
        showStartGameText();
    }

    requestAnimationFrame(gameLoop);
}

// Starting game loop
requestAnimationFrame(gameLoop);
