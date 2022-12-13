class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Enter your name");
    this.playButton = createButton("Play");
    this.titleImg = createImg("./assets/title.png", "game title");
    this.greeting = createElement("h2");
  }

  hide() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }

  setPosition()
  {
    this.input.position(width/2-130,height/2-100);
    this.playButton.position(width/2-110,height/2);
    this.titleImg.position(160,120);
    this.greeting.position(460,height/2-100);
  }

  setStyle()
  {
    this.input.class("customInput");
    this.playButton.class("customButton");
    this.titleImg.class("gameTitle");
    this.greeting.class("greeting");
  }

  display()
  {
    this.setPosition();
    this.setStyle();
    this.handleMousePressed();
  }

  handleMousePressed()
  {
    this.playButton.mousePressed(()=>{
      this.input.hide();
      this.playButton.hide();
      var message = `Hello ${this.input.value()} 
      </br> Wait for other player to join...`;
      this.greeting.html(message);
      playerCount += 1;
      player.name = this.input.value();
      player.index = playerCount;
      player.updateCount(playerCount);
      player.addPlayer();
      player.getDistance();
    })
  }
}
