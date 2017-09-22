Berzerk.game = function(game)
{
    this.game = game;
    this.keyState = null;
    this.player = null;

    this.enemies = null;
    this.enemyBullets = null;

    this.walls = null;
    this.gates = null;
    this.gate1 = null;
    this.gate2 = null;
    this.gate3 = null;
    this.gate4 = null;

    this.background = null;

    this.scoreText = null;
    this.score = null;

    this.lives = null;
};

Berzerk.game.prototype = 
{
    preload: function()
    {
        this.game.load.image('pAttack', 'assets/images/placeholder/character/Testchar_side.png');
        this.game.load.image('pRight', 'assets/images/placeholder/character/Testchar_right.png');
        this.game.load.image('pLeft', 'assets/images/placeholder/character/Testchar_left.png');
        this.game.load.image('pDown', 'assets/images/placeholder/character/Testchar_down.png');
        this.game.load.image('testBullet', 'assets/images/placeholder/temp.png');

        this.game.load.image('background', 'assets/images/placeholder/environment/Maze1.png');
        this.game.load.image('wall', 'assets/images/placeholder/environment/wall.png');
        this.game.load.image('gate', 'assets/images/placeholder/environment/gate.png');
        this.game.load.image('life', 'assets/images/placeholder/life.png');
    },

    create: function()
    {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.background = this.game.add.sprite(0, 0, 'background');
        this.background.scale.setTo(6, 4.6);


        this.createWalls();
        this.createGates();

        this.player = new Berzerk.player(500, 500, this.game);
        this.player.initialize();

        this.createEnemies();

        var style = { font: "bold 64px Arial", fill: '#fff', align: "right", boundsAlignH: "right" };
        this.scoreText = this.game.add.text(this.game.world.width - 100, 5, '0', style);
        

        this.scoreText.setTextBounds(-50, 0, 100, 100);
        this.score = 0;

        this.lives = this.game.add.group();
        for (var i = 0; i < this.player.lives; i++)
        {
            var life = this.lives.create(20 + (30 * i), 30, 'life');
            life.anchor.setTo(0.5, 0.5);
        }  
    },

    update: function()
    {
        var deltatime = this.time.elapsed / 10;

        this.keystate = this.game.input.keyboard;

        this.player.pUpdate(deltatime, this.keystate);
  /*     
        this.enemies.forEach(function (enemy)
        {
            enemy.eUpdate(deltatime);
        }, this.game);
*/
        this.game.physics.arcade.collide(this.player.player, this.walls, this.killPlayer, null, this);
        this.game.physics.arcade.collide(this.enemies, this.walls);
        this.game.physics.arcade.collide(this.player.player, this.gates, this.screenTransition);

        this.game.physics.arcade.collide(this.player.weapon.bullets, this.walls, this.killBullet);
        this.game.physics.arcade.collide(this.enemybullets, this.walls, this.killBullet);

        this.game.physics.arcade.collide(this.player.player, this.enemies);
        this.game.physics.arcade.collide(this.enemies, this.enemies);

        this.game.physics.arcade.overlap(this.player.weapon.bullets, this.enemies, this.bullethitenemy, null, this);
        for (var i = 0; i < this.enemies.children.length; i++)
        {
            //this.game.physics.arcade.overlap(this.enemies.children[i].weapon.bullets, this.player, this.bullethitplayer, null, this);
            this.game.physics.arcade.collide(this.enemies.children[i], this.walls);
        }

        this.scoreText.text = this.score;
        
    },

    bulletHitPlayer: function(player, bullet)
    {
        bullet.kill();
        var life = lives.getFirstAlive();

        if (life)
        {
            life.kill();
            player.kill();
            player.lives--;
            player.reset(300, 300, 1);
        }

        if (player.lives < 1)
        {
            score = "Game Over";
            player.kill();
        }
    },

    bulletHitEnemy: function(enemy, bullet) // -----------------------------------------------------Enemy code
    {
        bullet.kill();
        enemy.kill();
        score += 50;
    },

    createEnemies: function()
    {
        this.enemies = this.add.physicsGroup();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

        this.enemyBullets = this.add.physicsGroup();
        this.enemyBullets.enableBody = true;
        this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;

        var enemy1 = new Berzerk.enemy(300, 550, this.game, this.player, this.enemies);
        enemy1.initialize();
        this.enemyBullets.add(enemy1.weapon.bullets);

        var enemy2 = new Berzerk.enemy(1000, 500, this.game, this.player, this.enemies);
        enemy2.initialize();
        this.enemyBullets.add(enemy2.weapon.bullets);

        var enemy3 = new Berzerk.enemy(1000, 200, this.game, this.player, this.enemies);
        enemy3.initialize();
        this.enemyBullets.add(enemy3.weapon.bullets);
    },

    createWalls: function()
    {
        this.walls = this.game.add.physicsGroup();

        var wall1 = new Berzerk.barrier(145, 35, 400, 10, this.game, this.walls, 'wall');
        wall1.initialize();
        var wall2 = new Berzerk.barrier(735, 35, 400, 10, this.game, this.walls, 'wall');
        wall2.initialize();

        this.walls.enableBody = true;
    },

    createGates: function()
    {
        this.gates = this.add.physicsGroup();

        this.gate1 = new Berzerk.barrier(540, 35, 200, 10, this.game, this.gates, 'gate');
        this.gate2 = new Berzerk.barrier(540, 650, 200, 10, this.game, this.gates, 'gate');
        this.gate3 = new Berzerk.barrier(145, 250, 10, 190, this.game, this.gates, 'gate');
        this.gate4 = new Berzerk.barrier(1120, 250, 10, 190, this.game, this.gates, 'gate');

        this.gates.enableBody = true;
    },

    screenTransition: function(player, gate)
    {
        gates.forEach(function (item)
        {
            item.renderable = false;
        }, this);

        if (this.player.body.touching.left && this.gate4.renderable != true)
        {
            this.player.body.position.x = 1000;
            this.player.body.position.y = 300;
            this.gate4.renderable = true;
        }
        else if (this.player.body.touching.right && this.gate3.renderable != true)
        {
            this.player.body.position.x = 300;
            this.player.body.position.y = 300;
            this.gate3.renderable = true;
        }
        else if (this.player.body.touching.down && this.gate1.renderable != true)
        {
            this.player.body.position.x = 600;
            this.player.body.position.y = 100;
            this.gate1.renderable = true;
        }
        else if (this.player.body.touching.up && this.gate2.renderable != true)
        {
            this.player.body.position.x = 600;
            this.player.body.position.y = 500;
            this.gate2.renderable = true;
        }

        this.enemies.removeAll();
        this.enemyBullets.removeAll();
        createEnemies();
    },

    killPlayer: function(player, wall)
    {
        var life = this.lives.getFirstAlive();
        if (life)
        {
            life.kill();
            this.player.player.kill();
            this.player.lives--;
            this.player.player.reset(300, 300, 1);
        }

        if (this.player.lives < 1)
        {
            this.score = "Game Over";
            this.player.player.kill();
        }
    },

    killBullet: function(bullet, wall)
    {
        bullet.kill();
    }
};