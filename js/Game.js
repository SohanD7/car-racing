class Game {
  constructor() 
  {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");

    this.playerMoving = false;
    this.leftKeyActive = false;
    this.blast = false;
  }

  getState()
  {
    var s = database.ref("gameState");
    s.on("value",function (data){
      gameState = data.val();
    })
  }

  updateState(count)
  {
    database.ref("/").update({
      gameState: count 
    })
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    player.getCount();
    car1 = createSprite(width/2-100, height-100);
    car1.addImage("car1",car1_img);
    car1.addImage("blast",blast_img);
    car1.scale = 0.08;
    car2 = createSprite(width/2+100, height-100);
    car2.addImage("car2",car2_img);
    car2.addImage("blast",blast_img);
    car2.scale = 0.08;
    cars = [car1,car2];

    //creating the groups
    fuels = new Group();
    powercoins = new Group();
    obstacles = new Group();

    var obstPositions = [
      {x: width/2+250, y: height-400, image: obst1_img},
      {x: width/2-150, y: height-800, image: obst1_img},
      {x: width/2+250, y: height-1200, image: obst2_img},
      {x: width/2-180, y: height-1600, image: obst2_img},
      {x: width/2, y: height-2000, image: obst1_img},
      {x: width/2-180, y: height-2500, image: obst2_img},
      {x: width/2+180, y: height-2500, image: obst1_img},
      {x: width/2+250, y: height-3000, image: obst2_img},
      {x: width/2-150, y: height-3000, image: obst1_img},
      //{x: width/2+250, y: height-4400, image: obst2_img},
      {x: width/2, y: height-3900, image: obst1_img},
      //{x: width/2-180, y: height-4500, image: obst2_img},
    ]

    //adding fuel sprite into the game
    this.addSprites(fuels,4,fuel_img,0.02);
    this.addSprites(powercoins,20,coin_img,0.08);
    this.addSprites(obstacles,obstPositions.length,obst1_img,0.05,obstPositions);
  }

  addSprites(group, num, img, scale,positions=[])
  {
    for (var i = 0; i < num; i++)
    {
      var x, y;
      if (positions.length>0)
      {
        x = positions[i].x;
        y = positions[i].y;
        img = positions[i].image;
      } else {
        x = random(width/2+150, width/2-150);
        y = random(-height*4.5,height-400);
      }

      var sprite = createSprite(x,y);
      sprite.addImage(img);
      sprite.scale = scale;
      group.add(sprite);
    }
  }

  handleFuel(index)
  {
    //adding fuel 
    cars[index-1].overlap(fuels,function (collector,collected) {
      player.fuel = 185;
      //collected is the sprite in the group collectibles that triggered the touching event
      collected.remove();
    })

    //reducing player car fuel
    if (player.fuel > 0 && this.playerMoving)
    {
      player.fuel -= 0.3;
    }
    if (player.fuel <= 0)
    {
      gameState = 2;
      this.gameOver();
    }
  }

  handlePowercoins(index)
  {
    cars[index-1].overlap(powercoins,function (collector,collected) {
      player.score+=1;
      player.update();

      collected.remove();
    })
  }

  handleElements()
  {
    form.hide();
    form.titleImg.position(40,40);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Reset Game");
    this.resetTitle.position(width/2+150,40);
    this.resetTitle.class("resetText");

    this.resetButton.position(width/2+180,100);
    this.resetButton.class("resetButton");

    this.leadboardTitle.html("Leaderboard");
    this.leadboardTitle.class("resetText");
    this.leadboardTitle.position(width/3-70,40);

    this.leader1.class("leadersText");
    this.leader1.position(width/3-80,80);

    this.leader2.class("leadersText");
    this.leader2.position(width/3-80,130);
  }

  handlePlayerControl()
  {
    if (!this.blast)
    {
    if (keyIsDown(UP_ARROW))
    {
      this.playerMoving = true;
      player.positionY += 10;
      player.update();
    }
    if (keyIsDown(LEFT_ARROW) && player.positionX > width/3-50)
    {
      this.leftKeyActive = true;
      player.positionX -= 5;
      player.update();
    }
    if (keyIsDown(RIGHT_ARROW) && player.positionX < width/2+270)
    {
      this.leftKeyActive = false;
      player.positionX += 5;
      player.update();
    }
  }
  }

  handleResetButton()
  {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        carsAtEnd: 0,
        players: {}
      })
      window.location.reload();
    })
  }

  handleObstacleCollision(index)
  {
    if (cars[index-1].collide(obstacles))
    {
      if (this.leftKeyActive)
      {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }
      if (player.life > 0)
      {
        player.life -= 185/4;
      } 
      player.update();
    }
  }

  handleCarCollision(index)
  {
    if (index  == 1)
    {
      if (cars[index-1].collide(cars[1]))
      {
        if (this.leftKeyActive)
      {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }

      //reducing player life
      if (player.life > 0)
      {
        player.life -= 185/4;
      } 
      player.update();
      }
    } 
    if (index == 2)
    {
      if (cars[index-1].collide(cars[0]))
      {
        if (this.leftKeyActive)
      {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }

      //reducing player life
      if (player.life > 0)
      {
        player.life -= 185/4;
      } 
      player.update();
      }
    }
  }

  showLeaderboard = async () =>
  {
    var leader1,leader2;
    var players = await Object.values(allPlayers);
    if ((players[0].rank==0 && players[1].rank==0) || players[0].rank==1)
    {
      // "&emsp;" this tag is used for displaying four consecutive spaces
      leader1 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
      leader2 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
    }
    if (players[1].rank==1)
    {
      leader2 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
      leader1 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
    }
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  showRank() 
  {
    swal({
      title: `Congratulations! ${"\n"}Rank${"\n"}${player.rank}`,
      text: "You have reached the finish line successfully",
      imageUrl: "https://cdn.picpng.com/checkered_flags/checkered-flags-finish-line-77576.png",
      imageSize: "200x200",
      confirmButtonText: "ok"
    })
  }

  gameOver()
  {
    swal({
      title: `Game Over!`,
      text: "Oops you ran out of fuel!",
      imageUrl: "https://th.bing.com/th/id/R.174a3d61a7c9db289a0f5b312998ad6a?rik=JaEU3L9RGLUfAg&riu=http%3a%2f%2fpluspng.com%2fimg-png%2ffuel-tank-png-enertech-search-partners-executive-search-firm-a-year-of-oil-and-gas-decline-is-a-boon-for-grid-edge-hiring-6017.jpg&ehk=ySgFPTZJbSlhqisT2NVLkmUAMFlll%2bFpOltOANoj1VM%3d&risl=&pid=ImgRaw&r=0",
      imageSize: "200x200",
      confirmButtonText: "Thanks for playing"
    })
  }

  showLife()
  {
    push();
    image(heart_img,player.positionX+470,height-player.positionY+300,20,20);
    fill("white");
    rect(player.positionX+500,height-player.positionY+300,185,20);
    fill("red");
    rect(player.positionX+500, height-player.positionY+300,player.life,20);
    pop();
  }

  showFuel()
  {
    push();
    image(fuel_img,player.positionX+470, height-player.positionY+250,20,20);
    fill("white");
    rect(player.positionX+500,height-player.positionY+250,185,20);
    fill("yellow");
    rect(player.positionX+500, height-player.positionY+250,player.fuel,20);
    pop();
  }

  play()
  {
    this.handleElements();
    this.handleResetButton();
    Player.getInfo();
    player.getCarsAtEnd();
    if (allPlayers != undefined)
    {
      image(track,0,-height*5,width,height*6);
      this.showLife();
      this.showFuel();
      this.showLeaderboard();
      var index = 0;
      for (var i in allPlayers)
      {
        index = index + 1;
        var x = allPlayers[i].positionX;
        var y = height - allPlayers[i].positionY;

        //saving the value of player.life in a temp variable
        var tempLife = allPlayers[i].life;
        if (tempLife <= 0)
        {
          this.blast = true;
          this.playerMoving = false;
          cars[index-1].changeImage("blast");
          cars[index-1].scale = 0.5;
        }
        cars[index-1].position.x = x;
        cars[index-1].position.y = y;


        if (index == player.index)
        {
          fill("yellow");
          strokeWeight(2);
          stroke("black");
          ellipse(x,y-10,65,80);
          text(player.name,x-15,y-70);

          this.handleFuel(index);
          this.handlePowercoins(index);

          this.handleCarCollision(index);
          this.handleObstacleCollision(index);

          //changing camera position according to the car's position
          camera.position.x = cars[index-1].position.x;
          camera.position.y = cars[index-1].position.y;
        }
      }
      if (this.playerMoving)
      {
        player.positionY += 3;
        player.update();
      }
      this.handlePlayerControl();
      //finishing line
      const finishLine = (height*6)-100;
      if (player.positionY > finishLine)
      {
        gameState = 2;
        player.rank = player.rank+=1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }
      drawSprites();
    }
  }
}
