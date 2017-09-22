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

    this.hud = null;
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
        this.game.load.image('heart', 'assets/images/ui/Heart.png'); 
    },

    create: function()
    {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.background = this.game.add.sprite(0, 0, 'background');
        this.background.scale.setTo(6, 4.6);


        //this.createWalls();
        //this.createGates();

        this.player = new Berzerk.player(500, 500, this.game);
        this.player.initialize();

        this.createEnemies();

        this.hud = this.game.add.group();
        this.hud.enableBody = false;
        for (var i = 0; i < this.player.maxHealth; i++)
        {
            this.hud.add(new Phaser.Sprite(this.game, 0, 0, 'heart'));
            this.hud.children[i].position.set((this.hud.children[i].width * i) + (this.hud.children[i].width / 2), this.hud.children[i].height / 2);
        }

        var style = { font: "bold 64px Arial", fill: '#fff', align: "right", boundsAlignH: "right" };
        this.scoreText = this.game.add.text(this.game.world.width - 100, 5, '0', style);
        

        this.scoreText.setTextBounds(-50, 0, 100, 100);
        this.score = 0;
    },

    update: function()
    {
        var deltatime = this.time.elapsed / 10;

        this.keystate = this.game.input.keyboard;

        this.player.pUpdate(deltatime, this.keystate);

        this.enemies.forEach(function (enemy)
        {
            enemy.eUpdate(deltatime);
        }, this.game);

        this.game.physics.arcade.collide(this.player, this.walls);
        this.game.physics.arcade.collide(this.enemies, this.walls);
        this.game.physics.arcade.collide(this.player, this.gates, this.screenTransition, null, this);

        this.game.physics.arcade.collide(this.player.weapon.bullets, this.walls, this.killBullet);
        this.game.physics.arcade.collide(this.enemybullets, this.walls, this.killBullet);

        this.game.physics.arcade.collide(this.player, this.enemies, this.enemyHitPlayer, null, this);

        this.game.physics.arcade.overlap(this.player.weapon.bullets, this.enemies, this.bulletHitEnemy, null, this);
        for (var i = 0; i < this.enemies.children.length; i++)
        {
            this.game.physics.arcade.overlap(this.enemies.children[i].weapon.bullets, this.player, this.bulletHitPlayer, null, this);
    }

        this.scoreText.text = this.score;
        
    },

    enemyHitPlayer: function(player, enemy)
    {
        this.damagePlayer(player, 1);
    },

    bulletHitPlayer: function(player, bullet)
    {
        bullet.kill();
        this.damagePlayer(player, 1); 
    },

    bulletHitEnemy: function(enemy, bullet) // -----------------------------------------------------Enemy code
    {
        bullet.kill();
        enemy.kill();
        this.score += 50;
    },

    damagePlayer: function(player, dNum)
    {
        if (this.player.canDamage)
        {
            this.player.damage(dNum);
            this.hud.children[this.player.health].visible = false;
            this.playerInvuln();
            this.playerVisible();
            this.game.time.events.repeat(200, 3, this.playerVisible, this);
            this.game.time.events.add(800, this.playerInvuln, this);
        }
    },

    playerVisible: function()
    {
        this.player.visible = !this.player.visible;
    },

    playerInvuln: function()
    {
        this.player.canDamage = !this.player.canDamage;
    },

    healPlayer: function(player, hNum)
    {
        this.hud.children[this.player.health].visible = true;
        this.player.heal(hNum);
    },

    increaseHealth: function(player)
    {
        this.player.maxHealth += 1;
        this.player.heal(1);
        this.hud.add(new Phaser.Sprite(this.game, (this.hud.children[0].width * (this.player.maxHealth - 1)) + (this.hud.children[0].width / 2), this.hud.children[0].height / 2, 'heart'));
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
        this.gates = this.game.add.physicsGroup();

        this.gate1 = new Berzerk.barrier(540, 35, 200, 10, this.game, this.gates, 'gate');
        this.gate1.initialize();
        this.gate2 = new Berzerk.barrier(540, 650, 200, 10, this.game, this.gates, 'gate');
        this.gate2.initialize();
        this.gate3 = new Berzerk.barrier(145, 250, 10, 190, this.game, this.gates, 'gate');
        this.gate3.initialize();
        this.gate4 = new Berzerk.barrier(1120, 250, 10, 190, this.game, this.gates, 'gate');
        this.gate4.initialize();

        this.gates.enableBody = true;
        this.gates.physicsBodyType = Phaser.Physics.ARCADE;
    },

    screenTransition: function(player, gate)
    {
        this.gates.forEach(function (item)
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
        this.createEnemies();
    },

    killPlayer: function(player)
    {
        var life = this.lives.getFirstAlive();
        if (life)
        {
            life.kill();
            this.player.kill();
            this.player.lives--;
            this.player.reset(300, 300, 1);
        }

        if (this.player.lives < 1)
        {
            this.score = "Game Over";
            this.player.kill();
        }
    },

    killBullet: function(bullet, wall)
    {
        bullet.kill();
    }
};