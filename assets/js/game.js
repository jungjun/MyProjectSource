var text;
var field;
var backV;
var landV;
var land;
var mummy;
var cursor;
var canJump;
var playerJump;
var pipe;
var counter;
var weapon;
var mob;

// game Option
var rollSpeed = 150;
var platformTickTime = 1000;
var platfromMoveSpeed = 250;
var fireTime = 0;

var Game = {
    preload: function() {
        
        game.load.image('backGround','./assets/images/backGround.png');
        game.load.image('land','./assets/images/Land.png');
        game.load.spritesheet('mummy','./assets/images/metalslug_mummy.png',37,45,18);
        game.load.image('bullet','assets/images/bird.png');
        game.load.image('pipe','assets/images/pipe.png');
        game.load.image('mob','assets/images/Cal-character.png');
        //weapon = game.add.weapon(30, 'bullet');
        },

    create: function() {

     
        
      field = game.add.tileSprite(0,0,800,600,'backGround');
      //land = game.add.tileSprite(0,450,800,150,'land');
      land = game.add.sprite(-800,450,'land');
      //bird = this.game.add.sprite(100,100,'bullet');
      mummy = game.add.sprite(100,100,'mummy');
      weapon = game.add.weapon(30, 'bullet');
      var walk = mummy.animations.add('walk');
      mummy.animations.play('walk',30,true);
      mummy.scale.set(1.5);

      backV = 1;
      landV = 2;

      playerJump = 0;
      canJump = 2;

      text = game.add.text(game.world.centerX, game.world.centerY-250, 'Counter: 0M', { font: "24px Arial", fill: "#ffffff", align: "center" });
      text.anchor.setTo(0.5, 0.5);
      counter = 0;

      game.input.onDown.add(this.jumpPlayer, this);
      game.physics.startSystem(Phaser.Physics.ARCADE); // 물리를 적용합니다.
      game.physics.arcade.enable(mummy); 
      game.physics.arcade.enable(land);
      //game.physics.arcade.enable(bird);
      land.body.immovable = true;   //물리에 움직이지 않고 고정됨 

      mummy.body.gravity.y = 1000;
      land.body.velocity.x = -rollSpeed;
      // mummy.body.velocity.x = rollSpeed;
      
      this.pipes = game.add.group()   //파이프라는 이름의 빈 그룹 생성

      this.timer = game.time.events.loop(platformTickTime, this.addRowOfPipes, this); 

      game.time.events.loop(Phaser.Timer.SECOND/2, this.updateCounter, this); // 버티는 시간 (기록)
      
      weapon = game.add.weapon(30, 'bullet');
      weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;    // 총알이 삭제되는 기준 
      weapon.bulletSpeed = 400;                                   //총알 속도
      weapon.fireRate = 60;
      weapon.trackSprite(mummy, 30, 0, true); //z캐릭터에 귀속되어 캐릭터 방향대로 발사 
      game.physics.arcade.enable(weapon);
      
      game.time.events.loop(Phaser.Timer.SECOND/2, this.playerFire, this);
      //weapon.bullet.scale.setTo(0.5,0.5);


    },

    playerFire: function(){
          weapon.fire();
    },

    update: function(){
        field.tilePosition.x -= backV;
        //land.tilePosition.x -=landV;
        mummy.x = 100;
      game.physics.arcade.collide(mummy,land);  // 플레이어 캐릭터와 땅의 콜리젼
      
      game.physics.arcade.overlap(weapon.bullets, mob, this.damageMob, null, this);
      //game.physics.arcade.collide(mob,weapon);

      if( !pipe ){
        console.log("비어 있음");
      }else{
        console.log("값이 있음");
        game.physics.arcade.collide(mummy,this.pipes);  // 플레이어와 플랫폼의 충돌
        game.physics.arcade.collide(mob,this.pipes);  // 몬스터와 플랫폼의 충돌
      }

      if(pipe < 0)
      {
        console.log("플랫폼 삭제");
        this.pipes.remove(pipe);
      
      }


      if(mummy.y > 700){
        this.death();
        
       }
      
    },

    death: function()
    {
      game.state.start('Game');
    },

    jumpPlayer: function()
    {
      console.log("Jump Lale");
        // if(canJump && bird.body.blocked.down)
        //2단 점프
        if(mummy.body.touching.down || (playerJump > 0 && playerJump < canJump)){
           if(mummy.body.touching.down){
               playerJump = 0;  
           }
            mummy.body.velocity.y = -450;
            playerJump++;
          
        }
       // weapon.fire();
    },

    addOnePipe: function(x,y){    //플랫폼 생성
        pipe = game.add.sprite(x, y,'pipe');
        //this.pipe = game.add.sprite(200,245,'pipe');
        this.pipes.add(pipe);   // 생성된 그룹에 추가
        game.physics.arcade.enable(pipe);  // 파이프에 물리 적용 함
        pipe.body.immovable = true;
        pipe.body.velocity.x = -platfromMoveSpeed; // 파이프 생성 후 왼쪽으로 이동
       // this.pipes.align(rnd, -1, 50, 50);

       //  Pick a random number between -2 and 6
       // var rand = game.rnd.realInRange(1, 3.5);
       //var r = rand.toFixed(2);
       // console.log(r);
       //  Set the scale of the sprite to the random value
       // pipe.scale.setTo(r, 0.7);


        pipe.checkWorldBounds = true;  
        pipe.outOfBoundsKill = true;  
    },

    addRowOfPipes: function() {     // 플랫폼을 그룹으로 생성함 
        //var hole = Math.floor(Math.random() * 2) + 1;
         var rand = game.rnd.realInRange(0,3); 
         var hole = game.rnd.realInRange(300,470);
       
         for(var i =0; i< rand; i++){
            this.addOnePipe(i * 50 + 650, hole);
         }

         var rateAddMob = game.rnd.realInRange(0,100);
        
         if(rateAddMob > 50){

            if(rand > 1){
              mob = game.add.sprite(650,hole-50,'mummy'); // 몹 생성
              game.physics.arcade.enable(mob);          //몹에 물리를 적용함
              //mob.body.gravity.y = 1000;
            
              mob.animations.play('walk',30,true);
              mob.enableBody = true;
              mob.physicsBodyType = Phaser.Physics.ARCADE;
              mob.body.velocity.x = -platfromMoveSpeed;
          }
        } 
    },

    updateCounter : function(){
      counter++;
      text.setText('Counter: ' + counter + "M");
    },

    redner : function(){
      weapon.debug();
    },

    damageMob : function(bullet, mob){
      console.log("Damage Monster");
      bullet.kill();
      mob.kill();
      

    },

    
    // LandMummy: function()
    // {
    //     mummy.body.velocity.y = 0;
    // }

      // preload: function() {
    //     // 이 기능은 처음에 실행됩니다.
    //     game.load.image('bird', './assets/images/bird.png');
    //     game.load.image('pipe', './assets/images/pipe.png');
    // },

    // create: function() {
    //     // 이 함수는 preload 함수 후에 호출됩니다.
    //     game.stage.backgroundColor = '#71c5cf';
    //     game.physics.startSystem(Phaser.Physics.ARCADE);
    //     this.bird = game.add.sprite(100,245,'bird');
    //     game.physics.arcade.enable(this.bird);          // 새 이미지에게 물리 시스템을 집어넣음
    //     this.bird.body.gravity.y = 1000;    //새에게 중력을 가함
    //     // var spaceKey = game.input.keyboard.addKey(
    //     //     Phaser.Keyboard.SPACEBAR);
    //     // spaceKey.onDown.add(this.jump, this);       // 스페이스바를 입력하면 캐릭터가 점프 
        
    //     //game.input.onTap.add(this.jump, this);     // mouse
    //     game.input.onDown.add(this.jump, this);     
    //     game.input.addPointer();
    //    //game.input.addPointer();
   

    //     this.pipes = game.add.group()   //파이프라는 이름의 빈 그룹 생성
    //     //    
    //     this.timer = game.time.events.loop(1500, this.addRowOfPipes, this); // 1.5초마다 타이머를 이용 파이프를 추가함 
    //     //text = game.add.text(game.world.centerX, game.world.centerY, 'Counter: 0', { font: "64px Arial", fill: "#ffffff", align: "center" });
    //     //text.anchor.setTo(0.5, 0.5);
    //   //  game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);

    //   // this.score = 0;
    //   // this.labelScore.text =  game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
    //   count = 0;

    //   text = game.add.text(20, 20, "0", {g
    //       font: "30px Arial",
    //       fill: "#ffffff",
         
    //   });
      
    // },

    // render: function() {
    //    // game.debug.pointer(game.input.pionter1);
    // },

    // update: function() {
    //     // 이 함수는 초당 60 회 호출됩니다.
    //     if (this.bird.y < 0 || this.bird.y > 490)
    //     this.restartGame();

    //     game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);

    //     // if (game.input.pointer1.isDown) {
    //     //     jump();
    //     // }
    // },

    // jump: function(){
    //     this.bird.body.velocity.y = -350;
    // },
    // restartGame: function() {
    //     // 게임을 다시 시작하게 합니다.
       
    //     game.state.start('Menu');
    // },

    // addOnePipe: function(x,y){
    //     var pipe = game.add.sprite(x, y,'pipe');
    //     //this.pipe = game.add.sprite(200,245,'pipe');
    //     this.pipes.add(pipe);   // 생성된 그룹에 추가
    //     game.physics.arcade.enable(pipe);  // 파이프에 물리 적용 함
    //     pipe.body.velocity.x = -200; // 파이프 생성 후 왼쪽으로 이동
    //     pipe.checkWorldBounds = true;  
    //     pipe.outOfBoundsKill = true;  
    // },

    // addRowOfPipes: function() {

    //    // game.debug.text("Next tick: " + game.time.events.next.toFixed(0), 32, 64);
    //     // 무작위로 1과 5 사이의 숫자 선택
    //     // 구멍 위치가됩니다.
        
    //     var hole = Math.floor(Math.random() * 5) + 1;
    //     //this.score +=1;
    //     //this.labelScore.text = this.score;
   
    
    //     // 6 개의 파이프 추가
    //     // '구멍'과 '구멍 + 1' 위치에 하나의 큰 구멍이있는 상태
    //     for (var i = 0; i < 8; i++)
    //         if (i != hole && i != hole + 1)
    //             this.addOnePipe(400, i * 60 + 10);

    //     count++;
    //     text.setText(count);


    // },

    // updateCounter : function () {

    //     counter++;
    //     text.setText('Counter: ' + counter);
    
    // },
};