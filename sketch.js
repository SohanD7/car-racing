var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount;
var gameState;
var car1, car2, car1_img, car2_img, track;
var fuels, powercoins, fuel_img, coin_img, obst1_img, obst2_img, obstacles, heart_img, blast_img;
var cars = [];
var allPlayers = [];

function preload() {
  backgroundImage = loadImage("./assets/background.png");
  car1_img = loadImage("assets/car1.png");
  car2_img = loadImage("assets/car2.png");
  track = loadImage("assets/track.jpg");
  fuel_img = loadImage("assets/fuel.png");
  coin_img = loadImage("assets/goldCoin.png");
  obst1_img = loadImage("assets/obstacle1.png");
  obst2_img = loadImage("assets/obstacle2.png");
  heart_img = loadImage("assets/life.png");
  blast_img = loadImage("assets/blast.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

}

function draw() {
  background(backgroundImage);
  if (playerCount == 2)
  {
    game.updateState(1);
  }
  if (gameState == 1)
  {
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
