var bg, ground, groundImg;
var canvas;
var ground, ground2;
var lowPipe, highPipe, smallPipeImg1, smallPipeImg2, smallPipeImg3, low, high;
var bigPipeImg1, bigPipeImg2, bigPipeImg3, bigPipeImg4;
var firstSmall;
var pipes;
var play, dead;
var gameState;
var bird;
var font;
var screen;
var title;
var retryButton, retryImg;
var gameover, gameoverImg;
var playButton, playImg;
var score, scoreFont;
var checkpoint;
var giveScore;
var gameOverUI;
var best;
var medal, bronze, silver, gold;
var newB, newImg;
var hitS, wingS, SwooshS, scoreS, dieS;
var fallS = true;
var buttonS;
var dayImg, nightImg;
var switch_bg;
var day;
var hour;

var database;

var bestDATABASE;
function preload() {
    dayImg = loadImage("Sprites/background/bg.png");
    groundImg = loadImage("Sprites/ground/Ground.png");
    smallPipeImg1 = loadImage("Sprites/pipes/Small/Small Pipe 1.png");
    smallPipeImg2 = loadImage("Sprites/pipes/Small/Small Pipe 2.png");
    smallPipeImg3 = loadImage("Sprites/pipes/Small/Small Pipe 3.png");

    bigPipeImg1 = loadImage("Sprites/pipes/Big/Big Pipe 1.png");
    bigPipeImg2 = loadImage("Sprites/pipes/Big/Big Pipe 2.png");
    bigPipeImg3 = loadImage("Sprites/pipes/Big/Big Pipe 3.png");
    bigPipeImg4 = loadImage("Sprites/pipes/Big/Big Pipe 4.png");

    play = loadAnimation("Sprites/bird/bird.png", "Sprites/bird/bird 2.png", "Sprites/bird/bird 3.png", "Sprites/bird/bird 2.png");
    dead = loadAnimation("Sprites/bird/bird 2.png");
    font = loadFont("Fonts/FlappyBirdy.ttf");

    title = loadImage("Sprites/title/title.png");

    retryImg = loadImage("Sprites/retry/retry.png");
    playImg = loadImage("Sprites/play/play.png");

    gameoverImg = loadImage("Sprites/gameover/gameover.png");

    scoreFont = loadFont("Fonts/flappy-bird-font.ttf");

    gameOverUI = loadImage("Sprites/score/score.png");

    bronze = loadImage("Sprites/medals/bronze.png");

    silver = loadImage("Sprites/medals/silver.png");

    gold = loadImage("Sprites/medals/gold.png");

    newImg = loadImage("Sprites/score/new.png");

    swooshS = loadSound("Sounds/swoosh.wav");

    wingS = loadSound("Sounds/wing.wav");

    hitS = loadSound("Sounds/hit.wav");

    dieS = loadSound("Sounds/die.wav");

    scoreS = loadSound("Sounds/point.wav");

    buttonS = loadSound("Sounds/button.wav");

    nightImg = loadImage("Sprites/background/bgNight.png");
    day = new Date();
    hour = day.getHours();
}
function setup() {
    database = firebase.database();
    database.ref("Score Manager").update({
        score: 0
    })
    canvas = createCanvas(window.innerWidth * 0.9, window.innerHeight * 0.96);
    if (hour > 6 && hour < 20) {
        bg = dayImg;
    }
    else if (hour <= 6 || hour >= 20) {
        bg = nightImg;
    }
    switch_bg = true;
    console.log(canvas.width + ", " + canvas.height);
    ground = createSprite((canvas.width / 2), canvas.height / 1.04, canvas.width , 70);
    ground.addImage(groundImg);
    ground2 = createSprite((canvas.width / 2), canvas.height / 1.04, canvas.width , 70);
    ground2.addImage(groundImg);

    pipes = new Group();

    bird = createSprite(canvas.width / 4, canvas.height / 2, 20, 20);
    bird.scale = 0.6;
    bird.addAnimation("play", play);
    bird.setAnimation("play");
    endBird = createSprite(canvas.width / 4, canvas.height / 2, 20, 20);
    endBird.scale = 0.6;
    endBird.addAnimation("end", dead);
    endBird.setAnimation("end");
    endBird.visible = false;
    gameState = "menu";
    screen = createSprite(0,0,canvas.width * 2, canvas.height * 2);
    screen.visible = false;

    retryButton = createSprite(canvas.width / 2, canvas.height / 1.3, 20, 20);
    retryButton.visible = false;
    gameover = createSprite(canvas.width / 2, canvas.height / 6, 20, 20);
    gameover.scale = 0.6;
    gameover.visible = false;

    playButton = createSprite(canvas.width / 2, canvas.height / 2.3, 20, 20);
    playButton.addImage(playImg);
    playButton.scale = 1;
    playButton.visible = true;

    score = 0;
    checkpoint = createSprite(canvas.width * (1/7), canvas.height / 2, canvas.width / 12, canvas.height * 2);
    checkpoint.visible = false;
    giveScore = true;
    best = 0;

    medal = bronze;

    newB = false;
    
    score = 0;

    var scoreManager = database.ref("Score Manager/score");
    scoreManager.on("value", readScore, showError);
    var bestManager = database.ref("Score Manager/best");
    bestManager.on("value", saveBest, showError);
}
function readScore(data) {
    scoreR = data.val();
    score = scoreR;
}
function updateScore() {
    database.ref("Score Manager").set({
        "score": score,
        "best": best
    })
}
function saveBest(data) {
    bestS = data.val();
    bestDATABASE = bestS;
}
function showError() {
    console.error("Couldn't update database");
}
function draw() {
    background(bg);
    if (gameState === "menu") {
        if (hour > 6 && hour < 20) {
            bg = dayImg;
        }
        else if (hour <= 6 || hour >= 20) {
            bg = nightImg;
        }
        bird.setAnimation("play", play);
        textAlign(CENTER);
        textSize(Math.round((canvas.width + canvas.height) / 2) / 12.5);
        textFont(font);
        fill("black");
        text("Made By Horacio Ruggeri Ruiz", canvas.width / 2, canvas.height - (canvas.height * (1.7 / 6)));
        imageMode(CENTER);
        if (canvas.width > canvas.height) {
        image(title, canvas.width / 2, canvas.height / 6, canvas.width / 4, canvas.height / 6);
        }
        else if (canvas.height > canvas.width) {
            image(title, canvas.width / 2, canvas.height / 6, canvas.width / 2, canvas.height / 7);
        }
    if (mousePressedOver(playButton)) {
        gameState = "play";
        playButton.visible = false;
        buttonS.play();
        swooshS.play();
    }
}
    if (gameState === "play") {
    textAlign(CENTER);
    fill("#fff");
    textFont(scoreFont);
    textSize(((canvas.width + canvas.height) / 2) / 12);
    text(score, canvas.width / 2, canvas.height * (1/6));
    if (score % 10 === 0 && score > 0) {
        if (switch_bg === true) {
        if (bg === dayImg) {
            bg = nightImg;
            switch_bg = false;
        }
        else if (bg === nightImg) {
            bg = dayImg;
            switch_bg = false;
        }
    }
    }
    else {
        switch_bg = true;
    }
    ground.velocityX = (-score / 2)  + -7;
    ground2.velocityX = ground.velocityX;
    ground2.x = ground.x + ground.width/2;
    ground2.depth = ground.depth;
    if (ground2.x <= canvas.width/2) {
        ground.x = canvas.width / 2;
    }
    if (frameCount % 60 === 0) {
        firstSmall = Math.round(random(1,2));
        if (firstSmall === 1) {
            low = "small";
            high = "big";
        }
        else if (firstSmall === 2){
            low = "big";
            high = "small";
        }
            lowPipe = createSprite(canvas.width + 30, canvas.height * 0.81, 20, 20);
            lowPipe.velocityX = ground.velocityX;
            lowPipe.rotation = 180;
            lowPipe.lifetime = (canvas.width / lowPipe.velocityX) * -1;
            highPipe = createSprite(canvas.width + 30, canvas.height / 14, 20, 20);
            highPipe.velocityX = lowPipe.velocityX;
            highPipe.rotation = 0;
            highPipe.lifetime = (canvas.width / highPipe.velocityX) * -1;
            highPipe.scale = 1.5;
            lowPipe.scale = 1.5;
            lowPipe.depth = ground.depth;
            lowPipe.depth = lowPipe.depth - 1;
            pipes.add(lowPipe);
            pipes.add(highPipe);
            if (high === "small") {
                var selectedPipe = Math.round(random(1, 3));
                switch (selectedPipe) {
                    case 1:
                        highPipe.addImage(smallPipeImg1);
                    break;
                    case 2:
                        highPipe.addImage(smallPipeImg2);
                    break;
                    case 3:
                        highPipe.addImage(smallPipeImg3);
                    break;
                }
            }
            else if (high === "big") {
                var selectedPipe = Math.round(random(1, 4));
                switch (selectedPipe) {
                    case 1:
                        highPipe.addImage(bigPipeImg1);
                    break;
                    case 2:
                        highPipe.addImage(bigPipeImg2);
                    break;
                    case 3:
                        highPipe.addImage(bigPipeImg3);
                    break;
                    case 4:
                        highPipe.addImage(bigPipeImg4);
                    break;
            }
        }
        if (low === "small") {
            var selectedPipe = Math.round(random(1, 3));
            switch (selectedPipe) {
                case 1:
                    lowPipe.addImage(smallPipeImg1);
                break;
                case 2:
                    lowPipe.addImage(smallPipeImg2);
                break;
                case 3:
                    lowPipe.addImage(smallPipeImg3);
                break;
            }
        }
        else if (low === "big") {
            var selectedPipe = Math.round(random(1, 4));
            switch (selectedPipe) {
                case 1:
                    lowPipe.addImage(bigPipeImg1);
                break;
                case 2:
                    lowPipe.addImage(bigPipeImg2);
                break;
                case 3:
                    lowPipe.addImage(bigPipeImg3);
                break;
                case 4:
                    lowPipe.addImage(bigPipeImg4);
                break;
        }
        
    }
}
        best = bestDATABASE;
if (bird.isTouching(ground) || bird.isTouching(pipes) || bird.y < 0) {
    gameState = "over";
    pipes.destroyEach();
    hitS.play();
    if (score > best) {
        newB = true;
        database.ref("Score Manager").set({
            "score":score,
            "best":score
        });
        best = bestDATABASE;
    }
    else {
        newB = false;
    }
    if (score >= 0 && score <= 10) {
        medal = bronze;
    }
    if (score > 10 && score <= 20) {
        medal = silver;
    }
    if (score > 20) {
        medal = gold;
    }
}
if (checkpoint.isTouching(pipes) && giveScore === true) {
    score++;
    giveScore = false;
    updateScore();
    scoreS.play();
}
else if (checkpoint.isTouching(pipes) === false && giveScore === false) {
    giveScore = true;
}
if (keyDown("space") && bird.velocityY > 0) {
    Jump(bird, 15);
}
if (mousePressedOver(screen) && bird.velocityY > 0) {
    Jump(bird, 15);
}
    Gravity(bird, 1.75);
    bird.collide(pipes);
    bird.collide(ground);
}
if (gameState === "over") {
    endBird.x = bird.x;
    endBird.y = bird.y;
    endBird.rotation = 90;
    bird.visible = false;
    endBird.visible = true;
    endBird.setAnimation("end", dead);
    ground.velocityX = 0;
    ground2.velocityX = 0;
    pipes.setVelocityXEach(0)
    pipes.setLifetimeEach(-1);
    bird.velocityY = 0;
    bird.velocityX = 0;
    bird.rotation = 90;
    retryButton.visible = true;
    retryButton.addImage(retryImg);
    retryButton.scale = 0.7;
    gameover.visible = true;
    gameover.depth = gameover.depth +2;
    gameover.addImage(gameoverImg);
    if (bird.y < 495) {
        bird.y = bird.y + 20;
        if (fallS === true) {
        dieS.play();
        fallS = false;
        }
    }
    else {
        fallS = true;
    }
    imageMode(CENTER);
    image(gameOverUI, canvas.width / 5, canvas.height / 2, canvas.width / 2.7, canvas.height / 2.7);
    image(medal, canvas.width / 11, canvas.height / 1.9, canvas.width / 12, canvas.width / 12);
    
    textAlign(CENTER);
    fill("blue");
    textFont(scoreFont);
    textSize(((canvas.width + canvas.height) / 2) / 18);
    text(score, canvas.width / 3, canvas.height / 2);
    text(best, canvas.width / 3, canvas.height / 1.55);
    if (newB === true) {
        imageMode(CENTER);
        image(newImg, canvas.width / 4, canvas.height / 1.9, canvas.width / 12, canvas.height / 14);
    }
    if (mousePressedOver(retryButton)) {
        buttonS.play();
        reset();
    }
}
    drawSprites();
}
function Gravity(object, amount) {
    object.velocityY = object.velocityY + amount;
    console.log(object.rotation);
    if (object.rotation < 90 || object.rotation > 314 && object.rotation < 445) {
    object.rotation = object.rotation + 4;
    }
    bird.x = canvas.width / 4;
}
function Jump(object, force) {
    object.velocityY = -force;
    object.rotation = 315;
    wingS.play();
}
function reset() {
    endBird.visible = false;
    bird.visible = true;
    bird.x = canvas.width / 4;
    bird.y = canvas.height / 2;
    bird.rotation = 0;
    gameState = "menu";
    pipes.destroyEach();
    retryButton.visible = false;
    gameover.visible = false;
    playButton.visible = true;
    score = 0;
    updateScore();
}