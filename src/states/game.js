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
        this.load.image('pAttack', 'assets/images/placeholder/character/Testchar_side.png');
        this.load.image('pRight', 'assets/images/placeholder/character/Testchar_right.png');
        this.load.image('pLeft', 'assets/images/placeholder/character/Testchar_left.png');
        this.load.image('pDown', 'assets/images/placeholder/character/Testchar_down.png');
        this.load.image('testBullet', 'assets/images/placeholder/temp.png');

        this.load.image('background', 'assets/images/placeholder/environment/Maze1.png');
        this.load.image('wall', 'assets/images/placeholder/environment/wall.png');
        this.load.image('gate', 'assets/images/placeholder/environment/gate.png');
        this.load.image('life', 'assets/images/placeholder/life.png');
    },

    create: function()
    {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        background = this.add.sprite(0, 0, 'background');
        background.scale.setTo(6, 4.6);


        this.createWalls();/*
        this.createGates();
        player = new Berzerk.player(300, 350, this);
        this.add.existing(player);

        enemies = this.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;

        enemyBullets = this.add.physicsGroup();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;

        this.createEnemies();

        var style = { font: "bold 64px Arial", fill: '#fff', align: "right", boundsAlignH: "right" };
        scoreText = this.add.text(game.world.width - 100, 5, '0', style);
        scoreText.setTextBounds(-50, 0, 100, 100);
        score = 0;

        lives = this.add.group();
        for (var i = 0; i < player.lives; i++)
        {
            var life = lives.create(20 + (30 * i), 30, 'life');
            life.anchor.setTo(0.5, 0.5);
        }
        */
    },

    update: function()
    {
        /*
        deltatime = this.time.elapsed / 10;

        keystate = this.input.keyboard;

        player.pupdate(deltatime, keystate);
        enemies.foreach(function (enemy)
        {
            enemy.eupdate(deltatime);
        }, this);

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
        var enemy1 = new Berzerk.enemy(300, 550, this, player);
        enemies.add(enemy1);
        enemyBullets.add(enemy1.weapon.bullets);

        var enemy2 = new Berzerk.enemy(1000, 500, this, player);
        enemies.add(enemy2);
        enemyBullets.add(enemy2.weapon.bullets);

        var enemy3 = new Berzerk.enemy(1000, 200, this, player);
        enemies.add(enemy3);
        enemyBullets.add(enemy3.weapon.bullets);
    },

    createWalls: function()
    {
        walls = game.add.physicsGroup();

        var wall1 = new Berzerk.barrier(145, 35, 400, 10, this, walls, 'wall');
        var wall2 = new Berzerk.barrier(735, 35, 400, 10, this, walls, 'wall');
        var wall3 = new Berzerk.barrier(735, 650, 400, 10, this, walls, 'wall');
        var wall4 = new Berzerk.barrier(145, 650, 400, 10, this, walls, 'wall');
        var wall5 = new Berzerk.barrier(145, 240, 220, 10, this, walls, 'wall');
        var wall6 = new Berzerk.barrier(735, 240, 400, 10, this, walls, 'wall');
        var wall7 = new Berzerk.barrier(145, 450, 220, 10, this, walls, 'wall');
        var wall8 = new Berzerk.barrier(145, 35, 10, 200, this, walls, 'wall');
        var wall9 = new Berzerk.barrier(145, 450, 10, 200, this, walls, 'wall');
        var wall10 = new Berzerk.barrier(735, 450, 10, 200, this, walls, 'wall');
        var wall11 = new Berzerk.barrier(1120, 450, 10, 200, this, walls, 'wall');
        var wall12 = new Berzerk.barrier(1120, 35, 10, 200, this, walls, 'wall');
        var wall13 = new Berzerk.barrier(530, 250, 10, 200, this, walls, 'wall');
        var wall14 = new Berzerk.barrier(530, 440, 220, 10, this, walls, 'wall');

        walls.enableBody = true;
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