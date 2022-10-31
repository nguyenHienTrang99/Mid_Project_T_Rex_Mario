var mountainImages = ['imgs/scene/mountains01.png', 'imgs/scene/mountains02.png', 'imgs/scene/mountains03.png', 'imgs/scene/mountains04.png'];
var cloudImages = ['imgs/scene/cloud01.png', 'imgs/scene/cloud02.png'];
var brickImages = ['imgs/blocks/blocks001.png', 'imgs/blocks/blocks002.png', 'imgs/blocks/blocks003.png'];
var thighsImags = ['imgs/blocks/thigh01.png', 'imgs/blocks/thigh05.png'];
var pipeImages = ['imgs/scene/tube.png'];
var platformImages = ['imgs/scene/platform.png'];
var enemyMushroomImage = ['imgs/enemy/enemyMushroom01.png', 'imgs/enemy/enemyMushroom02.png'];

var spriteNumber = {
    mountain: 10,
    cloud: 10,
    brick: 10,
    pipe: 12,
    thigh: 12,
    enemyMushroom: 8,
}

function setSprites() {
    setSpriteGroups();
    loadStaticObjects(mountains, mountainImages, spriteNumber.mountain, 1.5, gaConfig.screenX, gaConfig.screenY - 35, gaConfig.screenY - 35);
    loadStaticObjects(clouds, cloudImages, spriteNumber.cloud, 0, gaConfig.screenX, 20, gaConfig.screenY * 0.5);
    loadStaticObjects(bricks, brickImages, spriteNumber.brick, gaConfig.screenX * 0.1, gaConfig.screenX * 1.0, gaConfig.screenY * 0.5, gaConfig.screenY * 1.0);
    loadStaticObjects(pipes, pipeImages, spriteNumber.pipe, 50, gaConfig.screenX, gaConfig.screenY - 20, gaConfig.screenY + 10);
    loadAnimatedObjects(thighs, thighsImags, 'shine', spriteNumber.thigh, "get", false, 0, gaConfig.screenX, gaConfig.screenY * 0.4, gaConfig.screenY * 0.8);
    loadAnimatedObjects(enemyMushrooms, enemyMushroomImage, 'move', spriteNumber.enemyMushroom, 'live', true, gaConfig.screenX * 0.5, gaConfig.screenX, gaConfig.screenY * 0.35, gaConfig.screenY * 0.75);
    loadPlatforms();
}


function setSpriteGroups() {
    bricks = new Group();
    enemyMushrooms = new Group();
    clouds = new Group();
    mountains = new Group();
    pipes = new Group();
    platforms = new Group();
    thighs = new Group();
};

// Set up non-moving objects 
function loadStaticObjects(group, imageArray, spriteNumber, randomPosStartX, randomPosEndX, randomPosStartY, randomPosEndY) {
    for (var i = 0; i < spriteNumber; i++) {
        var randomNumber = floor((random() * 10) % imageArray.length);
        var img = loadImage(imageArray[randomNumber]);
        group[i] = createSprite(random(randomPosStartX, randomPosEndX), random(randomPosStartY, randomPosEndY));
        group[i].addImage(img);
    }
};

// Set up moving and animated objects 
function loadAnimatedObjects(group, imageArray, animationName, spriteNumber, spriteStatusName, spriteStatusValue, randomPosStartX, randomPosEndX, randomPosStartY, randomPosEndY) {
    for (var i = 0; i < spriteNumber; i++) {
        group[i] = createSprite(random(randomPosStartX, randomPosEndX), random(randomPosStartY, randomPosEndY));
        group[i].addAnimation(animationName, imageArray[0], imageArray[1]);
        group[i].scale = 1.5;
        group[i][spriteStatusName] = spriteStatusValue;

    };
};

// Set up ground 
function loadPlatforms() {
    img = loadImage('imgs/scene/platform.png');
    for (i = 0; i < 70; i++) {
        randomNumber = random();
        if (randomNumber > 0.2) {
            platforms[i] = createSprite(gaConfig.screenX - i * 19, gaConfig.screenY - 10);
        } else {
            platforms[i] = createSprite(random(0, gaConfig.screenX), gaConfig.screenY - 10);
        }
        platforms[i].addImage(img);
    };
};

// Setup T-rex 
function T_Rex_Animation() {
    T_rex = createSprite(gaConfig.startingPointX, gaConfig.startingPointY, gaConfig.startingPoint, 0.5);
    T_rex.addAnimation("stand", 'imgs/tRex/rex06.png');
    T_rex.addAnimation("move", 'imgs/tRex/rex01.png', 'imgs/tRex/rex03.png');
    T_rex.addAnimation("jump", 'imgs/tRex/rex05.png');
    T_rex.addAnimation("dead", 'imgs/tRex/rex24.png');
};
