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

    lives = null;
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

        this.enemies = this.add.physicsGroup();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

        this.enemyBullets = this.add.physicsGroup();
        this.enemyBullets.enableBody = true;
        this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;

        this.createEnemies();
/*
        var style = { font: "bold 64px Arial", fill: '#fff', align: "right", boundsAlignH: "right" };
        scoreText = this.add.text(this.game.world.width - 100, 5, '0', style);
        scoreText.setTextBounds(-50, 0, 100, 100);
        score = 0;

        lives = this.add.group();
        for (var i = 0; i < this.player.lives; i++)
        {
            var life = lives.create(20 + (30 * i), 30, 'life');
            life.anchor.setTo(0.5, 0.5);
        }
        */
    },

    update: function()
    {
        
        var deltatime = this.time.elapsed / 10;

        this.keystate = this.game.input.keyboard;

        this.player.pUpdate(deltatime, this.keystate);
        /*
        enemies.foreach(function (enemy)
        {
            enemy.eUpdate(deltatime);
        }, this.game);

        this.physics.arcade.collide(player, walls, killplayer);
        this.physics.arcade.collide(enemies, walls);
        this.physics.arcade.collide(player, gates, screentransition);

        this.physics.arcade.collide(player.weapon.bullets, walls, killbullet);
        this.physics.arcade.collide(enemybullets, walls, killbullet);

        this.physics.arcade.collide(player, enemies);
        this.physics.arcade.collide(enemies, enemies);

        this.physics.arcade.overlap(player.weapon.bullets, enemies, bullethitenemy, null, this);
        for (var i = 0; i < enemies.children.length; i++)
        {
            this.physics.arcade.overlap(enemies.children[i].weapon.bullets, player, bullethitplayer, null, this);
        }

        scoretext.text = score;
        */
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
        var enemy1 = new Berzerk.enemy(300, 550, this.game, this.player);
        enemy1.initialize();
        this.enemies.add(enemy1);
        this.enemyBullets.add(enemy1.weapon.bullets);
/*
        var enemy2 = new Berzerk.enemy(1000, 500, this.game, this.player);
        enemy2.initialize();
        this.enemies.add(enemy2);
        enemyBullets.add(enemy2.weapon.bullets);

        var enemy3 = new Berzerk.enemy(1000, 200, this.game, this.player);
        enemy3.initialize();
        this.enemies.add(enemy3);
        enemyBullets.add(enemy3.weapon.bullets);
        */
    },

    createWalls: function()
    {
        this.walls = this.game.add.physicsGroup();

        var wall1 = new Berzerk.barrier(145, 35, 400, 10, this.game, this.walls, 'wall');
        wall1.initialize();
        
        var wall2 = new Berzerk.barrier(735, 35, 400, 10, this.game, this.walls, 'wall');
        wall2.initialize();
        var wall3 = new Berzerk.barrier(735, 650, 400, 10, this.game, this.walls, 'wall');
        wall3.initialize();
        var wall4 = new Berzerk.barrier(145, 650, 400, 10, this.game, this.walls, 'wall');
        wall4.initialize();
        var wall5 = new Berzerk.barrier(145, 240, 220, 10, this.game, this.walls, 'wall');
        wall5.initialize();
        var wall6 = new Berzerk.barrier(735, 240, 400, 10, this.game, this.walls, 'wall');
        wall6.initialize();
        var wall7 = new Berzerk.barrier(145, 450, 220, 10, this.game, this.walls, 'wall');
        wall7.initialize();
        var wall8 = new Berzerk.barrier(145, 35, 10, 200, this.game, this.walls, 'wall');
        wall8.initialize();
        var wall9 = new Berzerk.barrier(145, 450, 10, 200, this.game, this.walls, 'wall');
        wall9.initialize();
        var wall10 = new Berzerk.barrier(735, 450, 10, 200, this.game, this.walls, 'wall');
        wall10.initialize();
        var wall11 = new Berzerk.barrier(1120, 450, 10, 200, this.game, this.walls, 'wall');
        wall11.initialize();
        var wall12 = new Berzerk.barrier(1120, 35, 10, 200, this.game, this.walls, 'wall');
        wall12.initialize();
        var wall13 = new Berzerk.barrier(530, 250, 10, 200, this.game, this.walls, 'wall');
        wall13.initialize();
        var wall14 = new Berzerk.barrier(530, 440, 220, 10, this.game, this.walls, 'wall');
        wall14.initialize();

        this.walls.enableBody = true;
    },

    createGates: function()
    {
        gates = this.add.physicsGroup();

        gate1 = new Berzerk.barrier(540, 35, 200, 10, this, gates, 'gate');
        gate2 = new Berzerk.barrier(540, 650, 200, 10, this, gates, 'gate');
        gate3 = new Berzerk.barrier(145, 250, 10, 190, this, gates, 'gate');
        gate4 = new Berzerk.barrier(1120, 250, 10, 190, this, gates, 'gate');

        gates.enableBody = true;
    },

    screenTransition: function(player, gate)
    {
        gates.forEach(function (item)
        {
            item.renderable = false;
        }, this);

        if (player.body.touching.left && gate4.renderable != true)
        {
            player.body.position.x = 1000;
            player.body.position.y = 300;
            gate4.renderable = true;
        }
        else if (player.body.touching.right && gate3.renderable != true)
        {
            player.body.position.x = 300;
            player.body.position.y = 300;
            gate3.renderable = true;
        }
        else if (player.body.touching.down && gate1.renderable != true)
        {
            player.body.position.x = 600;
            player.body.position.y = 100;
            gate1.renderable = true;
        }
        else if (player.body.touching.up && gate2.renderable != true)
        {
            player.body.position.x = 600;
            player.body.position.y = 500;
            gate2.renderable = true;
        }

        enemies.removeAll();
        enemyBullets.removeAll();
        createEnemies();
    },

    killPlayer: function(player, wall)
    {
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

    killBullet: function(bullet, wall)
    {
        bullet.kill();
    }
};