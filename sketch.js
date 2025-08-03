
let ball;
let paddle;
let synth;
let notes = ["C4", "E4", "G4", "B4"];
let currentNote = 0;
let startButton;
let started = false;

function setup() {
  let cnv = createCanvas(600, 400);
  cnv.parent("game");
  ball = new Ball();
  paddle = new Paddle();
  synth = new Tone.Synth().toDestination();
  noLoop();
  createStartButton();
}

function draw() {
  background(0);
  ball.update();
  ball.display();
  paddle.update();
  paddle.display();

  if (ball.hits(paddle)) {
    ball.bounce();
    playNextNote();
  }

  if (ball.offScreen()) {
    ball.reset();
  }
}

function createStartButton() {
  startButton = createButton("🎮 Start Game");
  startButton.position(250, 420);
  startButton.style("padding", "10px 20px");
  startButton.style("font-size", "16px");
  startButton.style("background", "#00ffcc");
  startButton.style("border", "none");
  startButton.style("border-radius", "8px");
  startButton.mousePressed(() => {
    Tone.start();
    startButton.hide();
    started = true;
    loop();
  });
}

function playNextNote() {
  synth.triggerAttackRelease(notes[currentNote], "8n");
  currentNote = (currentNote + 1) % notes.length;
}

class Ball {
  constructor() {
    this.reset();
    this.r = 15;
  }

  reset() {
    this.x = width / 2;
    this.y = 50;
    this.vx = random(-2, 2);
    this.vy = 3;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) {
      this.vx *= -1;
    }
  }

  display() {
    fill(255);
    ellipse(this.x, this.y, this.r * 2);
  }

  hits(paddle) {
    return (
      this.y + this.r > paddle.y &&
      this.x > paddle.x &&
      this.x < paddle.x + paddle.w
    );
  }

  bounce() {
    this.vy *= -1;
  }

  offScreen() {
    return this.y > height;
  }
}

class Paddle {
  constructor() {
    this.w = 100;
    this.h = 20;
    this.x = width / 2 - this.w / 2;
    this.y = height - this.h - 20;
    this.speed = 7;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }
    this.x = constrain(this.x, 0, width - this.w);
  }

  display() {
    fill(0, 255, 255);
    rect(this.x, this.y, this.w, this.h);
  }
}
