let BGSound;

function preload() {
    BGSound = loadSound('BG.mp3');
    setSprites();
    T_Rex_Animation();
}

function setup() {
    createCanvas(gaConfig.screenX, gaConfig.screenY);
    instializeInSetup(T_rex);
    BGSound.play();
    BGSound.loop();
}

function draw() {
    game();
}