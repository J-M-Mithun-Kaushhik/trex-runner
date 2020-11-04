var trex, trex_running, trex_collided, ground, invisible_ground, ground_image, cloud, cloud_image, obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, restart, gameover, restartImage, gameoverImage, score, gameState,cloudsGroup, obstaclesGroup, jump_sound, die_sound, checkpoint_sound

localStorage.highestScore = 0;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  ground_image = loadImage("ground2.png");
  cloud_image = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  restartImage = loadImage("restart.png");
  gameoverImage = loadImage("gameOver.png");
  
  jump_sound = loadSound("jump.mp3");
  die_sound = loadSound("die.mp3");
  checkpoint_sound = loadSound("checkPoint.mp3");
}
function setup() {
  createCanvas(600, 200);
  trex = createSprite(50,180,10,10);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,10,10);
  ground.addImage(ground_image);
  ground.velocityX = -6;
  
  invisible_ground = createSprite(200,185,400,5);
  invisible_ground.visible = false;
  
  restart = createSprite(300,75,10,10);
  restart.scale = 0.5;
  restart.addImage(restartImage);
  restart.visible = false;
  
  gameover = createSprite(300,125,10,10);
  gameover.scale = 0.75;
  gameover.addImage(gameoverImage);
  gameover.visible = false;
  score = 0;
  
  gameState = "play";
  
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
}

function draw() {
  background(190);
  text("Score: " + score,275,20);
  if (localStorage.highestScore>0){
    text("Highest score: " + localStorage.highestScore, 490,20);
  }
  if (gameState === "play"){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -6 - (score/100);
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  trex.collide(invisible_ground);
  trex.velocityY = trex.velocityY + 0.6;
  if (keyDown("space") && trex.y >= 159){
    trex.velocityY = -10;
    jump_sound.play();
  }
  spawnClouds();
  spawnObstacles();
    if (trex.isTouching(obstaclesGroup)){
    gameState = "end";
    trex.changeAnimation("collided",trex_collided);
    die_sound.play();
  }
    if (score % 100 === 0 && score > 0){
      checkpoint_sound.play();
    }
  }
  else if (gameState === "end"){
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.setVelocity(0,0);
    gameover.visible = true;
    restart.visible = true;
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    if (mousePressedOver(restart)){
      reset();
    }
  }
  drawSprites();
  
}
  

function spawnClouds(){
  if (frameCount % 60 === 0){
    var cloud = createSprite(600,random(50,120),10,10);
    cloud.addImage(cloud_image);
    cloud.velocityX = -6;
    cloud.scale = 0.5;
    trex.depth = cloud.depth;
    cloud.lifetime = 110;
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles(){
  if (frameCount % 60 === 0){
  var obstacle = createSprite(600,165,10,10);
  obstacle.velocityX = ground.velocityX;
  var random_number = Math.round(random(1,6));
  obstacle.scale = 0.5;
    obstacle.lifetime = 110;
    
    switch (random_number) {
  case 1:
    obstacle.addImage(obstacle1);
    break;
  case 2:
     obstacle.addImage(obstacle2);
    break;
  case 3:
    obstacle.addImage(obstacle3);
    break;
  case 4:
    obstacle.addImage(obstacle4);
    break;
  case 5:
    obstacle.addImage(obstacle5);
    break;
  case 6:
    obstacle.addImage(obstacle6);
}
  obstaclesGroup.add(obstacle) ; 
}
}
function reset(){
  gameState = "play";
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  if (localStorage.highestScore < score){
    localStorage.highestScore = score;
  }
  score = 0;
  gameover.visible = false;
  restart.visible = false;
  trex.changeAnimation("running",trex_running);
  ground.velocityX = -6;
  
}