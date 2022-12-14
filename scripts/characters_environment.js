// Main variable
var T_rex, bricks, clouds, mountains, enemyMushrooms, pipes, platforms, thighs;

// Variable object to control ( 32 = SPACE ) 
var control = {
    up: "UP_ARROW",
    left: 'LEFT_ARROW',
    right: 'RIGHT_ARROW',
    revive: 32
}


// Game setting
class gameConfig {
    constructor(status, initialLifes, moveSpeed, enemyMoveSpeed, gravity, gravityEnemy, jump, startingPointX, startingPointY, screenX, screenY, timeScores, scores) {
        this.status = status; // status ( play , game over , start )
        this.initialLifes = initialLifes; // number of lives
        // Character's moving speed 
        this.moveSpeed = moveSpeed; 
        this.enemyMoveSpeed = enemyMoveSpeed;
        // Gravity and jumping speed 
        this.gravity = gravity;
        this.gravityEnemy = gravityEnemy;
        this.jump = jump;
        // Character's stating point 
        this.startingPointX = startingPointX;
        this.startingPointY = startingPointY;
        // Default canvas size 
        this.screenX = screenX;
        this.screenY = screenY;
        // Scring 
        this.timeScores = timeScores;
        this.scores = scores;

    }
}

// Define gameConfig 
let gaConfig = new gameConfig("start", 3, 3.5, 0.75, 1, 10, -30, 50, 50, 1350, 650, 0, 0);


function game() {
    // Check game 
    instializeInDraw();
    moveEnvironment(T_rex);
    drawSprites();
    if (gaConfig.status === 'start') {
        fill(0, 0, 0, 150);
        rect(0, 0, gaConfig.screenX, gaConfig.screenY);
        fill(255, 255, 255);
        textSize(40);
        textAlign(CENTER);
        text("Press Any Arrow Keys to Start and Play ", gaConfig.screenX / 2, gaConfig.screenY / 2);
        textSize(40);
        stroke(255);
        strokeWeight(7);
        noFill();
        changeGameStatud();
    }

    if (gaConfig.status === 'play') {
        positionOfCharacter(T_rex);
        enemys(enemyMushrooms);
        checkStatus(T_rex);
        scores(T_rex);
        manualControl(T_rex);
    }
    // If game over 
    if (gaConfig.status === 'gameover') {
        fill(0, 0, 0, 150);
        rect(0, 0, gaConfig.screenX, gaConfig.screenY);
        fill(255, 255, 255);
        textSize(40);
        textAlign(CENTER);
        text("GAME OVER", gaConfig.screenX / 2, gaConfig.screenY / 2 + 105);
        textSize(15);
        text("Press SPACE to Restart", gaConfig.screenX / 2, gaConfig.screenY / 2 + 135);
        textSize(40);
        text(round(gaConfig.scores), gaConfig.screenX / 2, gaConfig.screenY / 2 - 35);
        text("points", gaConfig.screenX / 2, gaConfig.screenY / 2);
        stroke(255);
        strokeWeight(7);
        noFill();
        ellipse(gaConfig.screenX / 2, gaConfig.screenY / 2 - 30, 160, 160);
        changeGameStatud(T_rex); 
    }
}
// Change game status 
function changeGameStatud(character) {
    if ((keyDown(control.up) || keyDown(control.left) || keyDown(control.right)) && gaConfig.status === "start") {
        initializeCharacterStatus(T_rex);
        gaConfig.status = "play";
    }
    if (gaConfig.status === "gameover" && keyDown(control.revive)) {
        gaConfig.status = "start";
    }
}

// Define status 
function instializeInSetup(character) {
    frameRate(120);
    character.scale = 0.35;
    initializeCharacterStatus(character)
    bricks.displace(bricks);
    platforms.displace(platforms);
    thighs.displace(thighs);
    thighs.displace(platforms);
    thighs.collide(pipes);
    thighs.displace(bricks);
    // Change scale of cloud and meteoroid
    clouds.forEach(function(element) {
        element.scale = random(1, 2);
    })
}
// Define character status 
function initializeCharacterStatus(character) {
    character.scale = 0.35;
    character["killing"] = 0; // Khi ??ang gi???t con b??? 
    character["kills"] = 0;
    character["live"] = true;
    character["liveNumber"] = gaConfig.initialLifes;
    character["status"] = 'live';
    character["thighs"] = 0;
    character["dying"] = 0;
    character.position.x = gaConfig.startingPointX;
    character.position.y = gaConfig.startingPointY;
}

function instializeInDraw() {
    background(255, 255, 255);
    if (T_rex.killing > 0) {
        T_rex.killing -= 1;
    } else {
        T_rex.killing = 0;
    }
    // Make objects not collapse 
    pipes.displace(pipes);
    enemyMushrooms.displace(enemyMushrooms);
    enemyMushrooms.collide(pipes);
    clouds.displace(clouds);
    // Make character not collapse with anything else  
    if (T_rex.live) {
        bricks.displace(T_rex);
        pipes.displace(T_rex);
        enemyMushrooms.displace(T_rex);
        platforms.displace(T_rex);
    }
    T_rex["standOnObj"] = false;
    T_rex.velocity.x = 0;
    T_rex.maxSpeed = 20;

}

// Interaction 

// T-rex eat chicken thigh
function getThighs(thigh, character) {
    if (character.overlap(thigh) && character.live && thigh.get == false) {
        character.thighs += 1;
        thigh.get = true;
    };
}

// Chicken thigh appears more after T-rex eat 
function thighVanish(thigh) {
    if (thigh.get) {
        thigh.position.x = random(50, gaConfig.screenX) + gaConfig.screenX;
        thigh.get = false;
    };
}

// Control T-rex
// 

function positionOfCharacter(character) {
    if (character.live) {
        // See if T-rex is on the brick 
        platforms.forEach(function(element) {
            standOnObjs(character, element);
        });
        bricks.forEach(function(element) {
            standOnObjs(character, element);
        });
        pipes.forEach(function(element) {
            standOnObjs(character, element);
        });
    
        falling(character);
        // Make character jump-able when standing on object 
        if (character.standOnObj) jumping(character);

    }
    // Interaction with chicken thigh
    thighs.forEach(function(element) {
        getThighs(element, T_rex);
        thighVanish(element);
    });
    // Interaction with enemy 
    enemyMushrooms.forEach(function(element) {
        StepOnEnemy(character, element);
        if ((element.touching.left || element.touching.right) && character.live && character.killing === 0) die(T_rex);

    })
    // Keep T-rex inside the screen 
    dontGetOutOfScreen(T_rex);

}

// Auto-move character when it stucks 
function autoControl(character) {
    character.velocity.x += gaConfig.moveSpeed;
    character.changeAnimation('move');
    character.mirrorX(1);
}

// Manual control character 
function manualControl(character) {

    if (character.live) {
        if (keyDown(control.left)) {
            character.velocity.x -= gaConfig.moveSpeed;
            character.changeAnimation('move');
            character.mirrorX(-1);
        }

        if (keyDown(control.right)) {
            character.velocity.x += gaConfig.moveSpeed;
            character.changeAnimation('move');
            character.mirrorX(1);
        }

        if (!keyDown(control.left) && !keyDown(control.right) && !keyDown(control.up)) {
            character.changeAnimation('stand');
        }
    }

}

function jumping(character) {
    if ((keyWentDown(control.up) && character.live) || (touchIsDown && character.live)) {
        character.velocity.y += gaConfig.jump;
    }
}

function falling(character) {
    character.velocity.y += gaConfig.gravity;
    character.changeAnimation('jump');
}

function standOnObjs(obj1, obj2) {
    var obj1_Left = leftSide(obj1);
    var obj1_Right = rightSide(obj1);
    var obj1_Up = upSide(obj1);
    var obj1_Down = downSide(obj1);
    var obj2_Left = leftSide(obj2);
    var obj2_Right = rightSide(obj2);
    var obj2_Up = upSide(obj2);
    var obj2_Down = downSide(obj2);

    if (obj1_Right >= obj2_Left && obj1_Left <= obj2_Right && obj1_Down <= obj2_Up + 7 && obj1_Down >= obj2_Up - 7) {
        obj1.velocity.y = 0;
        obj1.position.y = obj2_Up - (obj1.height / 2) - 1;
        obj1.standOnObj = true;
    }
}

// If T-rex kills enemy 
function StepOnEnemy(obj1, obj2) {
    var obj1_Left = leftSide(obj1);
    var obj1_Right = rightSide(obj1);
    var obj1_Up = upSide(obj1);
    var obj1_Down = downSide(obj1);
    var obj2_Left = leftSide(obj2);
    var obj2_Right = rightSide(obj2);
    var obj2_Up = upSide(obj2);
    var obj2_Down = downSide(obj2);

    if (obj1_Right >= obj2_Left && obj1_Left <= obj2_Right && obj1_Down <= obj2_Up + 7 && obj1_Down >= obj2_Up - 7 && obj2.live == true && obj2.touching.top) {
        obj2.live = false;
        obj1.killing = 30;
        obj1.kills++;
        if (obj1.velocity.y >= gaConfig.jump * 0.8) {
            obj1.velocity.y = gaConfig.jump * 0.8;
        } else {
            obj1.velocity.y += gaConfig.jump * 0.8;
        }
    }
}

// If T-rex touches enemy 
function die(character) {
    character.live = false;
    character.dying += 120;
    character.liveNumber--;
    character.status = "dead";
    character.changeAnimation('dead');
    character.velocity.y -= 2;
}

function checkStatus(character) {
    if (character.live == false) {
        character.changeAnimation('dead');
        character.dying -= 1;
        reviveAfterMusic(character);
    }
    if (character.live == false && character.liveNumber == 0) {
        gaConfig.status = "gameover"
    }

}

// revive 
function reviveAfterMusic(character) {
    if (character.live === false && T_rex.liveNumber !== 0 && character.dying === 0) {
        character.live = true;
        character.status = "live";
        character.position.x = 50;
        character.position.y = 50;
        character.velocity.y = 0;
    }
}

// Keep character inside screen 
function dontGetOutOfScreen(character) {

    // If falls 
    if (character.position.y > gaConfig.screenY && character.live && character == T_rex) {
        die(T_rex);
    }

    
    if (character.position.x > gaConfig.screenX - (character.width * 0.5)) {
        character.position.x = gaConfig.screenX - (character.width * 0.5);
    } else if (character.position.x < character.width * 0.5) {
        if (character == T_rex) {
            character.position.x = character.width * 0.5;
        } else {
            character.live = false;
        }
    }

}

function enemys(enemys) {
    enemys.forEach(function(enemy) {
        stateOfEnemy(enemy);
        positionOfEnemy(enemy);
        enemy.position.x -= gaConfig.enemyMoveSpeed;
    });
}

 
function stateOfEnemy(enemy) {
    if (enemy.live == false || enemy.position.y > gaConfig.screenY + 50) {
        enemy.position.x = random(gaConfig.screenX * 1.5, 2 * gaConfig.screenX + 50);
        enemy.position.y = random(gaConfig.screenY * 0.35, gaConfig.screenY * 0.75);
        enemy.live = true;
    }
}

// Reaction of other object with enemy 
function positionOfEnemy(enemy) {

    platforms.forEach(function(element) {
        enemyStandOnObjs(enemy, element);
    });
    bricks.forEach(function(element) {
        enemyStandOnObjs(enemy, element);
    });
    pipes.forEach(function(element) {
        enemyStandOnObjs(enemy, element);
    })
    enemy.position.y += gaConfig.gravityEnemy;
    dontGetOutOfScreen(enemy);
}

function enemyStandOnObjs(obj1, obj2) {

    var obj1_Left = leftSide(obj1);
    var obj1_Right = rightSide(obj1);
    var obj1_Up = upSide(obj1);
    var obj1_Down = downSide(obj1);
    var obj2_Left = leftSide(obj2);
    var obj2_Right = rightSide(obj2);
    var obj2_Up = upSide(obj2);
    var obj2_Down = downSide(obj2);

    if (obj1_Right >= obj2_Left && obj1_Left <= obj2_Right && obj1_Down <= obj2_Up + 7 && obj1_Down >= obj2_Up - 7) {
        obj1.velocity.y = 0;
        obj1.position.y = obj2_Up - (obj1.height);
    }
}

function moveEnvironment(character) {
    var environmentScrollingSpeed = gaConfig.moveSpeed * 0.3;

    if (gaConfig.status === 'play') {
        environmentScrolling(platforms, environmentScrollingSpeed);
        environmentScrolling(bricks, environmentScrollingSpeed);
        environmentScrolling(clouds, environmentScrollingSpeed * 0.5);
        environmentScrolling(mountains, environmentScrollingSpeed * 0.3);
        environmentScrolling(pipes, environmentScrollingSpeed);
        environmentScrolling(thighs, environmentScrollingSpeed);
        environmentScrolling(enemyMushrooms, environmentScrollingSpeed);
        character.position.x -= environmentScrollingSpeed;
    }
}


// Scroll function
function environmentScrolling(group, environmentScrollingSpeed) {
    group.forEach(function(element) {
        if (element.position.x > -50) {
            element.position.x -= environmentScrollingSpeed;
        } else {
            element.position.x = gaConfig.screenX + 50;
            // Random block from 1/3 - 3/4 of screen
            if (group === bricks) {
                element.position.y = random(gaConfig.screenY * 0.35, gaConfig.screenY * 0.75);
            }
           
            // Pipes and mountain appear randomly 
            if (group === pipes || group === mountains) {
                element.position.x = random(50, gaConfig.screenX) + gaConfig.screenX;
            }

            // Random loud position 
            if (group === clouds) {
                element.position.x = random(50, gaConfig.screenX) + gaConfig.screenX;
                element.position.y = random(0, gaConfig.screenY * 0.5);
                element.scale = random(0.3, 1.5);
            }

            // Random chicken thigh position 
            if (group === thighs) {
                element.position.x = random(0, gaConfig.screenX) + gaConfig.screenX;
                element.position.y = random(gaConfig.screenY * 0.2, gaConfig.screenY * 0.6);
            }

        }

    })
}

function debugging(character) {
    strokeWeight(1);
    fill(255);
    textSize(12);
    text(character.dying, 20, 20);
    text(gaConfig.status, 20, 80);
    noFill();
    stroke(251);
    strokeWeight(2);
    outline(character);

    pipes.forEach(function(element) {
        outline(element);
    });
    enemyMushrooms.forEach(function(element) {
        outline(element);
    });

}

// Scoring

function scores(character) {
    strokeWeight(0);
    fill(0, 0, 0, 71);
    textSize(40);

    gaConfig.scores = character.thighs + character.kills + gaConfig.timeScores;  
    // Score = number of thigh + enemy + time alive
    if (character.live && gaConfig.status === 'play') gaConfig.timeScores += 0.02;
    text("scores: " + round(gaConfig.scores), 20, 40);
    text("lives: " + character.liveNumber, 20, 80);
    if (T_rex.live == false && T_rex.liveNumber != 0) {
        fill(0, 0, 0, 150);
        rect(0, 0, gaConfig.screenX, gaConfig.screenY);
        strokeWeight(7);
        noFill();
        stroke(255);
        ellipse(gaConfig.screenX / 2, gaConfig.screenY / 2 - 30, 150, 150)
        stroke("red");
        var ratio = (character.liveNumber / gaConfig.initialLifes);
        arc(gaConfig.screenX / 2, gaConfig.screenY / 2 - 30, 150, 150, PI + HALF_PI, (PI + HALF_PI) + (TWO_PI * ratio));
        fill(255, 255, 255);
        noStroke();
        textAlign(CENTER);
        textSize(40);
        text(round(character.liveNumber), gaConfig.screenX / 2, gaConfig.screenY / 2 - 35);
        text("lives", gaConfig.screenX / 2, gaConfig.screenY / 2);
    }
}


function outline(obj) {
    rect(leftSide(obj), upSide(obj), rightSide(obj) - leftSide(obj), downSide(obj) - upSide(obj));
}

// Define orientation for enemy and pipe 
function leftSide(obj) {
    return obj.position.x - (obj.width / 2);
}

function rightSide(obj) {
    return obj.position.x + (obj.width / 2);
}

function upSide(obj) {
    return obj.position.y - (obj.height / 2);
}

function downSide(obj) {
    return obj.position.y + (obj.height / 2);
}
