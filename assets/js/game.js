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
var playerSpine;
var platfroms;
var near;
var close;
var far;
var playerLife = true;

// game Option
var rollSpeed = 150;
var platformTickTime = 1000;
var platfromMoveSpeed = 250;


var Game = {
    preload: function() {
        
        game.load.image('backGround','./assets/images/stage01_4.png');
        game.load.image('farBg','./assets/images/stage01_3.png');
        
        game.load.image('closeBg','./assets/images/stage01_2.png');
        game.load.image('nearBg','./assets/images/stage01_1.png');

        game.load.image('land','./assets/images/prop_01.png');
        game.load.spritesheet('mummy','./assets/images/metalslug_mummy.png',37,45,18);
        game.load.image('bullet','assets/images/leal_a01.png');
        game.load.image('pipe','assets/images/pipe.png');
      //  game.load.image('mob','assets/images/Cal-character.png');
        //weapon = game.add.weapon(30, 'bullet');
        //leal_a01
       // game.load.image('laelBullet','assets/images/leal_a01.png');
        game.plugins.add(PhaserSpine.SpinePlugin);
        game.load.spine('lael', "assets/images/anim/character_003.json");
        game.load.image('mainpopup','assets/images/ui/01.png');

        //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;


        },

    create: function() {

      //game.world.setBounds(0, 0, 1280, 720);

      //field = game.add.tileSprite(0,0,1280,720,'backGround');
     
      this.createBackGround();//배경 생성
      this.createLand();        //초반 땅 생성 

      playerLife = true;

      playerSpine = game.add.spine(0, 20, "lael"); //game.add.sprite(100,100,'mummy');
      mummy = game.add.sprite(100,100,'');
      weapon = game.add.weapon(30, 'bullet');

      playerSpine.setAnimationByName(0, "pistol_run", true);
      //lael.setSkinByName("lael");
      playerSpine.setToSetupPose();
      playerSpine.scale.set(-0.3,0.3);
      //playerSpine.anchor.set(0.5,0.5);

      //mummy.parent = playerSpine;
      mummy.addChild(playerSpine);

   

      backV = 0.5;
      landV = 1;

      playerJump = 0;
      canJump = 2;

      text = game.add.text(game.world.centerX, game.world.centerY-250, 'Counter: 0M', { font: "24px Arial", fill: "#ffffff", align: "center" });
      text.anchor.setTo(0.5, 0.5);
      counter = 0;

      game.input.onDown.add(this.jumpPlayer, this);
      game.physics.startSystem(Phaser.Physics.ARCADE); // 물리를 적용합니다.
      game.physics.arcade.enable(mummy); 
      game.physics.arcade.enable(platfroms);
      //game.physics.arcade.enable(bird);
    

      mummy.body.gravity.y = 1000;
     
      
    
      this.pipes = game.add.group();  //파이프라는 이름의 빈 그룹 생성
      this.timer = game.time.events.loop(platformTickTime, this.addRowOfPipes, this); 
      game.time.events.loop(Phaser.Timer.SECOND/2, this.updateCounter, this); // 버티는 시간 (기록)
      game.time.events.loop(Phaser.Timer.SECOND/2, this.autoAttack, this);
      weapon = game.add.weapon(30, 'bullet');
      weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;    // 총알이 삭제되는 기준 
      weapon.bulletSpeed = 400;                                   //총알 속도
      weapon.fireRate = 60;
      weapon.trackSprite(mummy, 50, -20, true); //캐릭터 방향대로 발사 
      game.physics.arcade.enable(weapon);
      //weapon.bulletCollideWorldBounds=true;
    
    },

    createBackGround: function(){

      field = game.add.sprite(0,0,'backGround');
      far = game.add.sprite(0,0,'farBg');
      close = game.add.tileSprite(0,0,1280,720,'closeBg');
      near = game.add.tileSprite(0,0,1280,720,'nearBg');
    },

    createLand: function(){

          
      // 땅 제작 (처음 시작 땅 제작) 
      platfroms = game.add.group();
      var land1 = game.add.sprite(0,450,'land');
      var land2 = game.add.sprite(280,450,'land');
      var land3 = game.add.sprite(280*2,450,'land');
      platfroms.add(land1);
      platfroms.add(land2);
      platfroms.add(land3);
      game.physics.arcade.enable(land1);
      game.physics.arcade.enable(land2);
      game.physics.arcade.enable(land3);
      land1.body.immovable = true;   //물리에 움직이지 않고 고정됨 
      land2.body.immovable = true;    
      land3.body.immovable = true;    
      land1.body.velocity.x = -rollSpeed;
      land2.body.velocity.x = -rollSpeed;
      land3.body.velocity.x = -rollSpeed;

    },

    update: function(){
        //field.tilePosition.x -= backV;

       close.tilePosition.x -=backV;
       near.tilePosition.x -=landV;
        mummy.x = 100;            // 주인공 플레이어의 위치를 강제로 100에 맞춤( 안그러면 계속 달려감 )
      game.physics.arcade.collide(mummy,platfroms);  // 플레이어 캐릭터와 땅의 콜리젼
      
      game.physics.arcade.overlap(weapon.bullets, mob, this.damageMob, null, this);
      //game.physics.arcade.collide(mob,weapon);

      if( !pipe ){
        //console.log("비어 있음");
      }else{
        //console.log("값이 있음");
        game.physics.arcade.collide(mummy,this.pipes);  // 플레이어와 플랫폼의 충돌
        game.physics.arcade.collide(mob,this.pipes);  // 몬스터와 플랫폼의 충돌
      }

      if(pipe < 0)
      {
        //console.log("플랫폼 삭제");
        this.pipes.remove(pipe);
      }


      if(mummy.y > 700){

        if(playerLife == true){
          this.death();
          playerLife = false;
        }
        
      }
      
    },

    death: function()
    {
      //game.state.start('Game');
      //game.time.events.remove(this.updateCounter);
      game.time.events.stop();
      var currentCount = counter;
      console.log("죽었습니다.");
      popup = game.add.sprite(game.world.centerX, game.world.centerY, 'mainpopup');
      popup.anchor.setTo(0.5, 0.5);
      score = game.add.text(0,0, currentCount + "M", { font: "36px Arial", fill: "#ffffff", align: "center" });
      score.anchor.setTo(0.5, 0.5);
      
      popup.addChild(score);


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
            mummy.body.velocity.y = -400;
            playerJump++;
          
        }

       // weapon.fire();
    },

    addOnePipe: function(x,y){
        pipe = game.add.sprite(x, y,'pipe');
        //this.pipe = game.add.sprite(200,245,'pipe');
        this.pipes.add(pipe);   // 생성된 그룹에 추가
        game.physics.arcade.enable(pipe);  // 파이프에 물리 적용 함
        pipe.body.immovable = true;
        pipe.body.velocity.x = -platfromMoveSpeed; // 파이프 생성 후 왼쪽으로 이동
        pipe.checkWorldBounds = true;  
        pipe.outOfBoundsKill = true;  
    },

    addRowOfPipes: function() {
        //var hole = Math.floor(Math.random() * 2) + 1;
         var rand = game.rnd.realInRange(0,3); 
         var hole = game.rnd.realInRange(300,470);
       
         for(var i =0; i< rand; i++){
            this.addOnePipe(i * 50 + 1200, hole);
         }

         var rateAddMob = game.rnd.realInRange(0,100);
        
         if(rateAddMob > 50){
            mob = game.add.sprite(1200,hole-50,'mummy'); // 몹 생성
            game.physics.arcade.enable(mob);          //몹에 물리를 적용함
                      
            mob.animations.play('walk',30,true);

            mob.enableBody = true;
            mob.physicsBodyType = Phaser.Physics.ARCADE;
            mob.body.velocity.x = -platfromMoveSpeed;

        } 
    },

    updateCounter : function(){
      counter++;
      text.setText('Counter: ' + counter + "M");
    },

    damageMob : function(bullet, mob){
      console.log("Damage Monster");
      bullet.kill();
      mob.kill();
    },

    autoAttack : function(){
      weapon.fire();
    },

    
    
};