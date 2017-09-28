window.onload = function ()
{
	//  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
	//  Although it will work fine with this tutorial, it's almost certainly not the most current version.
	//  Be sure to replace it with an updated version before you start experimenting with adding your own code.
	var game = new Phaser.Game(1920, 1080, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	let keyState: Phaser.Keyboard;
	let player: Player;
	var enemies;
	let enemyBullets: Phaser.Group;

	let walls: Phaser.Group;
	var gates: Phaser.Group;
	let gate1: Barrier;
	let gate2: Barrier;
	let gate3: Barrier;
	let gate4: Barrier;
	let background: Phaser.Sprite;

	let scoreText: Phaser.Text;
	var score;

	let lives: Phaser.Group;
	var hud;

	function preload()
	{
		game.stage.backgroundColor = '#eee';
		game.load.spritesheet('pSprite', 'assets/PlayerSpritesheet.png', 128, 52, 52, 0, 2);
		game.load.image('testBullet', 'assets/temp.png');

		game.load.image('background', 'assets/Maze1.png');
		game.load.image('wall', 'assets/wall.png');
		game.load.image('life', 'assets/life.png');
		game.load.image('gate', 'assets/gate.png');

		game.load.image('heart', 'assets/Heart.png');
	}

	function create()
	{
		fullScreen();
		game.physics.startSystem(Phaser.Physics.ARCADE);
		background = game.add.sprite(0, 0, 'background');
		background.scale.setTo(4, 3);

		createWalls();
		createGates();
		player = new Player(300, 350, game);
		game.add.existing(player);

		enemies = game.add.group();
		enemies.enableBody = true;
		enemies.physicsBodyType = Phaser.Physics.ARCADE;

		enemyBullets = game.add.physicsGroup();
		enemyBullets.enableBody = true;
		enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;

		createEnemies();

		hud = game.add.group();
		hud.enableBody = false;
		for (var i = 0; i < player.maxHealth; i++)
		{
			hud.add(new Phaser.Sprite(game, 0, 0, 'heart'));
			hud.children[i].position.set((hud.children[i].width * i) + (hud.children[i].width / 2), hud.children[i].height / 2);
		}

		var style = { font: "bold 64px Arial", fill: '#fff', align: "right", boundsAlignH: "right" };
		scoreText = game.add.text(game.world.width - 100, 5, '0', style);
		scoreText.setTextBounds(-50, 0, 100, 100);
		score = 0;

		//lives = game.add.group();
		//for (var i = 0; i < player.lives; i++)
		//{
		//	var life = lives.create(20 + (30 * i), 30, 'life');
		//	life.anchor.setTo(0.5, 0.5);
		//}
	}

	function update()
	{
		let deltaTime: number = game.time.elapsed / 10;

		keyState = game.input.keyboard;

		player.pUpdate(deltaTime, keyState);
		enemies.forEach(function (enemy)
		{
			enemy.eUpdate(deltaTime);
		}, this);

		game.physics.arcade.collide(player, walls);
		game.physics.arcade.collide(enemies, walls);
		game.physics.arcade.collide(player, gates, screenTransition);

		game.physics.arcade.collide(player.weapon.bullets, walls, killBullet);
		game.physics.arcade.collide(enemyBullets, walls, killBullet);

		game.physics.arcade.overlap(player, enemies, enemyHitPlayer);

		game.physics.arcade.overlap(player.weapon.bullets, enemies, bulletHitEnemy, null, this);
		for (var i = 0; i < enemies.children.length; i++)
		{
			game.physics.arcade.overlap(enemies.children[i].weapon.bullets, player, bulletHitPlayer, null, this);

			for (var j = 0; j < player.saberHitBoxes.children.length; j++)
			{
				game.physics.arcade.overlap(player.saberHitBoxes.children[j], enemies.children[i].weapon.bullets, bulletHitSaber, null, this);
			}
		}

		scoreText.text = score;
		render();
	}

	function render()
	{

		game.debug.bodyInfo(player, 32, 32);
		game.debug.body(player);

	}

	function fullScreen()
	{
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.setGameSize(1280, 720);
	}

	function bulletHitSaber(saber, bullet: Phaser.Bullet)
	{
		bullet.body.velocity.x = -bullet.body.velocity.x;
		bullet.body.velocity.y = -bullet.body.velocity.y;
		player.weapon.bullets.add(bullet);
		bullet.rotation += Math.PI;

	}

	function bulletHitPlayer(player: Player, bullet: Phaser.Bullet)
	{
		bullet.kill();
		damagePlayer(player, 1);
	}

	function enemyHitPlayer(player: Player, enemy: Enemy)
	{
		damagePlayer(player, 1);
	}

	function damagePlayer(player: Player, dNum: number)
	{
		if (player.canDamage)
		{
			player.damage(dNum);
			hud.children[player.health].visible = false;
			if (player.health != 0)
			{
				playerInvuln();
				playerVisible();
				game.time.events.repeat(200, 3, playerVisible, this);
				game.time.events.add(800, playerInvuln, this);
			}
		}
	}

	function playerVisible()
	{
		player.visible = !player.visible;
	}

	function playerInvuln()
	{
		player.canDamage = !player.canDamage;
	}

	function healPlayer(player: Player, hNum: number)
	{
		hud.children[player.health].visible = true;
		player.heal(hNum);
	}

	function increaseHealth(player: Player)
	{
		player.maxHealth += 1;
		player.heal(1);
		hud.add(new Phaser.Sprite(game, (hud.children[0].width * (player.maxHealth - 1)) + (hud.children[0].width / 2), hud.children[0].height / 2, 'heart'));
	}

	function bulletHitEnemy(enemy: Enemy, bullet: Phaser.Bullet) // -----------------------------------------------------Enemy code
	{
		bullet.kill();
		enemy.kill();
		score += 50;
	}

	function createEnemies()
	{
		var enemy1 = new Enemy(300, 550, game, player);
		enemies.add(enemy1);
		enemyBullets.add(enemy1.weapon.bullets);

		var enemy2 = new Enemy(1000, 500, game, player);
		enemies.add(enemy2);
		enemyBullets.add(enemy2.weapon.bullets);

		var enemy3 = new Enemy(1000, 200, game, player);
		enemies.add(enemy3);
		enemyBullets.add(enemy3.weapon.bullets);
	}

	function createWalls()
	{
		walls = game.add.physicsGroup();

		var wall1 = new Barrier(145, 35, 400, 10, game, walls, 'wall');
		var wall2 = new Barrier(735, 35, 400, 10, game, walls, 'wall');
		var wall3 = new Barrier(735, 650, 400, 10, game, walls, 'wall');
		var wall4 = new Barrier(145, 650, 400, 10, game, walls, 'wall');
		var wall5 = new Barrier(145, 240, 220, 10, game, walls, 'wall');
		var wall6 = new Barrier(735, 240, 400, 10, game, walls, 'wall');
		var wall7 = new Barrier(145, 450, 220, 10, game, walls, 'wall');
		var wall8 = new Barrier(145, 35, 10, 200, game, walls, 'wall');
		var wall9 = new Barrier(145, 450, 10, 200, game, walls, 'wall');
		var wall10 = new Barrier(735, 450, 10, 200, game, walls, 'wall');
		var wall11 = new Barrier(1120, 450, 10, 200, game, walls, 'wall');
		var wall12 = new Barrier(1120, 35, 10, 200, game, walls, 'wall');
		var wall13 = new Barrier(530, 250, 10, 200, game, walls, 'wall');
		var wall14 = new Barrier(530, 440, 220, 10, game, walls, 'wall');

		walls.enableBody = true;
	}

	function createGates()
	{
		gates = game.add.physicsGroup();

		gate1 = new Barrier(540, 35, 200, 10, game, gates, 'gate');
		gate2 = new Barrier(540, 650, 200, 10, game, gates, 'gate');
		gate3 = new Barrier(145, 250, 10, 190, game, gates, 'gate');
		gate4 = new Barrier(1120, 250, 10, 190, game, gates, 'gate');

		gates.enableBody = true;
	}

	function screenTransition(player: Player, gate: Barrier)
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
	}

	function killPlayer(player: Player)
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
	}

	function killBullet(bullet: Phaser.Bullet, wall: Barrier)
	{
		bullet.kill();
	}
};

class Barrier extends Phaser.Sprite 
{
	constructor(xPos: number, yPos: number, width: number, height: number, game: Phaser.Game, group: Phaser.Group, type: string)
	{
		super(game, xPos, yPos, type);
		this.scale.setTo(width, height);
		game.physics.arcade.enable(this);
		this.body.immovable = true;
		this.renderable = false;
		group.add(this);
	}
}

class Player extends Phaser.Sprite
{
	aim: boolean;
	canDamage: boolean;

	pVelocityX: number;
	pVelocityY: number;
	pSpeed: number;
	lives: number;

	weapon: Phaser.Weapon;

	newPFrame: number | string;
	attacked: boolean;
	rAttack: Phaser.Animation;
	//lAttack: Phaser.Animation;
	//uAttack: Phaser.Animation;
	//dAttack: Phaser.Animation;
	//urAttack: Phaser.Animation;
	//ulAttack: Phaser.Animation;
	//drAttack: Phaser.Animation;
	//dlAttack: Phaser.Animation;

    saberHitBoxes: Phaser.Group;
    rightSaber: Phaser.Sprite;
    leftSaber: Phaser.Sprite;
    topSaber: Phaser.Sprite;
    topRightSaber: Phaser.Sprite;
    topLeftSaber: Phaser.Sprite;
    bottomSaber: Phaser.Sprite;
    bottomRightSaber: Phaser.Sprite;
    bottomLeftSaber: Phaser.Sprite;

	pDirEnum =
	{
		RIGHT: 0,
		LEFT: 1,
		UPRIGHT: 2,
		UPLEFT: 3,
		DOWN: 4,
		UP: 5,
		DOWNRIGHT: 6,
		DOWNLEFT: 7
	};

	constructor(xPos: number, yPos: number, game: Phaser.Game)
	{
		super(game, xPos, yPos, 'pSprite');
		this.rAttack = this.animations.add('rAttack', [6, 7, 8, 9], 10);
		//this.lAttack = this.animations.add('lAttack', [12, 13, 14, 15], 10);
		//this.uAttack = this.animations.add('uAttack', [18, 19, 20, 21], 10);
		//this.dAttack = this.animations.add('dAttack', [24, 25, 26, 27], 10);
		//this.urAttack = this.animations.add('urAttack', [30, 31, 32, 33], 10);
		//this.ulAttack = this.animations.add('ulAttack', [36, 37, 38, 39], 10);
		//this.drAttack = this.animations.add('drAttack', [42, 43, 44, 45], 10);
		//this.dlAttack = this.animations.add('dlAttack', [48, 49, 50, 51], 10);
		this.attacked = false;

		this.frame = this.pDirEnum.RIGHT;
		this.newPFrame = this.frame;

		this.smoothed = false;
		this.exists = true;
		this.anchor.setTo(0.5, 0.5);

		this.game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.setSize(24, 42, 34, 10);
		this.body.collideWorldBounds = true;
		this.maxHealth = 5;
		this.health = this.maxHealth;
		this.canDamage = true;

		this.aim = false;
		this.pVelocityX = 0;
		this.pVelocityY = 0;
		this.pSpeed = 150;

		this.weapon = game.add.weapon(100, 'testBullet');

		this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.weapon.bulletSpeed = 200;
		this.weapon.autofire = false;

		this.lives = 1;

        this.createSaberHitBoxes();
	}

    createSaberHitBoxes()
    {
        this.saberHitBoxes = this.game.add.physicsGroup();
        this.addChild(this.saberHitBoxes);

        this.rightSaber = this.game.add.sprite(5, 0, 'bleh');
        this.rightSaber.anchor.setTo(0.5, 0.5);
        this.rightSaber.scale.setTo(0.8, 1.25);
        this.game.physics.enable(this.rightSaber, Phaser.Physics.ARCADE);
        this.saberHitBoxes.addChild(this.rightSaber);
        this.rightSaber.name = "rightSaber";
        this.disableHitbox("rightSaber");

        this.leftSaber = this.game.add.sprite(-35, 0, 'bleh');
        this.leftSaber.anchor.setTo(0.5, 0.5);
        this.leftSaber.scale.setTo(0.8, 1.25);
        this.game.physics.enable(this.leftSaber, Phaser.Physics.ARCADE);
        this.saberHitBoxes.addChild(this.leftSaber);
        this.leftSaber.name = "leftSaber";
        this.disableHitbox("leftSaber");

        this.topSaber = this.game.add.sprite(-20, -30, 'bleh');
        this.topSaber.anchor.setTo(0.5, 0.5);
        this.topSaber.scale.setTo(1.25, 0.8);
        this.game.physics.enable(this.topSaber, Phaser.Physics.ARCADE);
        this.saberHitBoxes.addChild(this.topSaber);
        this.topSaber.name = "topSaber";
        this.disableHitbox("topSaber");

        this.topRightSaber = this.game.add.sprite(5, -30, 'bleh');
        this.topRightSaber.anchor.setTo(0.5, 0.5);
        this.topRightSaber.scale.setTo(1.25, 0.8);
        this.game.physics.enable(this.topRightSaber, Phaser.Physics.ARCADE);
        this.saberHitBoxes.addChild(this.topRightSaber);
        this.topRightSaber.name = "topRightSaber";
        this.disableHitbox("topRightSaber");

        this.topLeftSaber = this.game.add.sprite(-35, -30, 'bleh');
        this.topLeftSaber.anchor.setTo(0.5, 0.5);
        this.topLeftSaber.scale.setTo(1.25, 0.8);
        this.game.physics.enable(this.topLeftSaber, Phaser.Physics.ARCADE);
        this.saberHitBoxes.addChild(this.topLeftSaber);
        this.topLeftSaber.name = "topLeftSaber";
        this.disableHitbox("topLeftSaber");

        this.bottomSaber = this.game.add.sprite(-20, 30, 'bleh');
        this.bottomSaber.anchor.setTo(0.5, 0.5);
        this.bottomSaber.scale.setTo(1.25, 0.8);
        this.game.physics.enable(this.bottomSaber, Phaser.Physics.ARCADE);
        this.saberHitBoxes.addChild(this.bottomSaber);
        this.bottomSaber.name = "bottomSaber";
        this.disableHitbox("bottomSaber");

        this.bottomRightSaber = this.game.add.sprite(5, 30, 'bleh');
        this.bottomRightSaber.anchor.setTo(0.5, 0.5);
        this.bottomRightSaber.scale.setTo(1.25, 0.8);
        this.game.physics.enable(this.bottomRightSaber, Phaser.Physics.ARCADE);
        this.saberHitBoxes.addChild(this.bottomRightSaber);
        this.bottomRightSaber.name = "bottomRightSaber";
        this.disableHitbox("bottomRightSaber");

        this.bottomLeftSaber = this.game.add.sprite(-35, 30, 'bleh');
        this.bottomLeftSaber.anchor.setTo(0.5, 0.5);
        this.bottomLeftSaber.scale.setTo(1.25, 0.8);
        this.game.physics.enable(this.bottomLeftSaber, Phaser.Physics.ARCADE);
        this.saberHitBoxes.addChild(this.bottomLeftSaber);
        this.bottomLeftSaber.name = "bottomLeftSaber";
        this.disableHitbox("bottomLeftSaber");

        this.saberHitBoxes.enableBody = true;
    }

    disableHitbox(name: string)
    {
        if (name == "rightSaber")
        {
            this.rightSaber.kill();
        }
        else if (name == "leftSaber")
        {
            this.leftSaber.kill();
        }
        else if (name == "topSaber")
        {
            this.topSaber.kill();
        }
        else if (name == "topRightSaber")
        {
            this.topRightSaber.kill();
        }
        else if (name == "topLeftSaber")
        {
            this.topLeftSaber.kill();
        }
        else if (name == "bottomSaber")
        {
            this.bottomSaber.kill();
        }
        else if (name == "bottomRightSaber")
        {
            this.bottomRightSaber.kill();
        }
        else if (name == "bottomLeftSaber")
        {
            this.bottomLeftSaber.kill();
        }
    }

    enableHitbox(name: string)
    {
        if (name == "rightSaber")
        {
            this.rightSaber.reset(5, 0);
        }
        else if (name == "leftSaber")
        {
            this.leftSaber.reset(-35, 0);
        }
        else if (name == "topSaber")
        {
            this.topSaber.reset(-20, -30);
        }
        else if (name == "topRightSaber")
        {
            this.topSaber.reset(5, -30);
        }
        else if (name == "topLeftSaber")
        {
            this.topSaber.reset(-35, -30);
        }
        else if (name == "bottomSaber")
        {
            this.bottomSaber.reset(-20, 30);
        }
        else if (name == "bottomRightSaber")
        {
            this.bottomRightSaber.reset(5, 30);
        }
        else if (name == "bottomLeftSaber")
        {
            this.bottomLeftSaber.reset(-35, 30);
        }
    }

	pUpdate(time: number, keyState: Phaser.Keyboard)
	{
		if (this.alive)
		{
			this.pVelocityX = 0;
			this.pVelocityY = 0;

			if (keyState.isDown(Phaser.KeyCode.SPACEBAR) && !(this.rAttack.isPlaying)) //|| this.lAttack.isPlaying || this.uAttack.isPlaying || this.dAttack.isPlaying || this.urAttack.isPlaying || this.ulAttack.isPlaying || this.drAttack.isPlaying || this.dlAttack.isPlaying))
			{
				this.aim = true;
			}

			this.weapon.trackSprite(this, 0, 0);
			this.weapon.fireAngle = 0;

			if ((keyState.isDown(Phaser.KeyCode.W) || keyState.isDown(Phaser.KeyCode.S)) && (keyState.isDown(Phaser.KeyCode.D) || keyState.isDown(Phaser.KeyCode.A)) && !((keyState.isDown(Phaser.KeyCode.W) && keyState.isDown(Phaser.KeyCode.S)) || (keyState.isDown(Phaser.KeyCode.A) && keyState.isDown(Phaser.KeyCode.D))))
			{
				if (keyState.isDown(Phaser.KeyCode.W))
				{
					this.pVelocityY -= Math.sqrt(Math.pow(this.pSpeed, 2) / 2);
				}
				else
				{
					this.pVelocityY += Math.sqrt(Math.pow(this.pSpeed, 2) / 2);
				}

				if (keyState.isDown(Phaser.KeyCode.A))
				{
					this.pVelocityX -= Math.sqrt(Math.pow(this.pSpeed, 2) / 2);
				}
				else
				{
					this.pVelocityX += Math.sqrt(Math.pow(this.pSpeed, 2) / 2);
				}
			}
			else
			{
				if (keyState.isDown(Phaser.KeyCode.W))
				{
					this.pVelocityY -= this.pSpeed;
				}
				if (keyState.isDown(Phaser.KeyCode.S))
				{
					this.pVelocityY += this.pSpeed;
				}

				if (keyState.isDown(Phaser.KeyCode.A))
				{
					this.pVelocityX -= this.pSpeed;
				}
				if (keyState.isDown(Phaser.KeyCode.D))
				{
					this.pVelocityX += this.pSpeed;
				}
			}
			if (this.aim)
			{
				if ((keyState.isDown(Phaser.KeyCode.W) || keyState.isDown(Phaser.KeyCode.S)) && (keyState.isDown(Phaser.KeyCode.D) || keyState.isDown(Phaser.KeyCode.A)) && !((keyState.isDown(Phaser.KeyCode.W) && keyState.isDown(Phaser.KeyCode.S)) || (keyState.isDown(Phaser.KeyCode.A) && keyState.isDown(Phaser.KeyCode.D))))
				{
					if (keyState.isDown(Phaser.KeyCode.W))
					{
						//this.weapon.trackOffset.y = -this.height / 2;
						this.weapon.fireAngle = 270;
					}
					else
					{
						//this.weapon.trackOffset.y = this.height / 2;
						this.weapon.fireAngle = 90;
					}

					if (keyState.isDown(Phaser.KeyCode.A))
					{
						//this.weapon.trackOffset.x = -this.width / 2;
						if (this.weapon.fireAngle > 180)
						{
							this.weapon.fireAngle -= 45;
						}
						else
						{
							this.weapon.fireAngle += 45;
						}
					}
					else
					{
						//this.weapon.trackOffset.x = this.width / 2;
						if (this.weapon.fireAngle > 180)
						{
							this.weapon.fireAngle += 45;
						}
						else
						{
							this.weapon.fireAngle -= 45;
						}
					}
				}
				else
				{
					if (keyState.isDown(Phaser.KeyCode.W))
					{
						//this.weapon.trackOffset.y -= this.height / 2;
						this.weapon.fireAngle = 270;
					}
					if (keyState.isDown(Phaser.KeyCode.S))
					{
						//this.weapon.trackOffset.y += this.height / 2;
						if (this.weapon.fireAngle == 270)
						{
							this.weapon.fireAngle = 0;
						}
						else
						{
							this.weapon.fireAngle = 90;
						}
					}

					if (keyState.isDown(Phaser.KeyCode.A))
					{
						//this.weapon.trackOffset.x -= this.width / 2;
						this.weapon.fireAngle = 180;
					}
					if (keyState.isDown(Phaser.KeyCode.D))
					{
						//this.weapon.trackOffset.x += this.width / 2;
						this.weapon.fireAngle = 0;
					}
				}
				this.weapon.bulletAngleOffset = 90;
			}

			// ----------------------------------------------------- Determining new direction

			if (this.pVelocityX > 0)
			{
				if (this.pVelocityY > 0)
				{
					this.newPFrame = this.pDirEnum.DOWNRIGHT;
				}
				else if (this.pVelocityY < 0)
				{
					this.newPFrame = this.pDirEnum.UPRIGHT;
				}
				else
				{
					this.newPFrame = this.pDirEnum.RIGHT;
				}
			}
			else if (this.pVelocityX < 0)
			{
				if (this.pVelocityY > 0)
				{
					this.newPFrame = this.pDirEnum.DOWNLEFT;
				}
				else if (this.pVelocityY < 0)
				{
					this.newPFrame = this.pDirEnum.UPLEFT;
				}
				else
				{
					this.newPFrame = this.pDirEnum.LEFT;
				}
			}
			else
			{
				if (this.pVelocityY > 0)
				{
					this.newPFrame = this.pDirEnum.DOWN;
				}
				else if (this.pVelocityY < 0)
				{
					this.newPFrame = this.pDirEnum.UP;
				}
			}

			if (this.aim)
			{
				if (this.weapon.fireAngle == 90 || this.weapon.fireAngle == 45 || this.weapon.fireAngle == 135)
				{
					this.newPFrame = this.pDirEnum.DOWN;
					if (!this.attacked)
					{
					//	this.animations.play('dAttack');
						this.attacked = true;
                        this.enableHitbox("bottomSaber");
					}
				}
				else if (this.weapon.fireAngle == 45)
                {
                    this.newPFrame = this.pDirEnum.DOWNRIGHT;
					if (!this.attacked)
					{
					//	this.animations.play('drAttack');
						this.attacked = true;
                        this.enableHitbox("bottomRightSaber");
					}
				}
				else if (this.weapon.fireAngle == 135)
                {
                    this.newPFrame = this.pDirEnum.DOWNLEFT;
					if (!this.attacked)
					{
					//	this.animations.play('dlAttack');
						this.attacked = true;
                        this.enableHitbox("bottomLeftSaber");
					}
				}
				else if (this.weapon.fireAngle == 0)
				{
					this.newPFrame = this.pDirEnum.RIGHT;
					if (!this.attacked)
					{
						this.animations.play('rAttack');
						this.attacked = true;
						this.enableHitbox("rightSaber");
					}
				}
				else if (this.weapon.fireAngle == 180)
				{
					this.newPFrame = this.pDirEnum.LEFT;
					if (!this.attacked)
					{
					//	this.animations.play('lAttack');
						this.attacked = true;
                        this.enableHitbox("leftSaber");
					}
				}
				else if (this.weapon.fireAngle == 270)
				{
					this.newPFrame = this.pDirEnum.UP;
					if (!this.attacked)
					{
					//	this.animations.play('uAttack');
						this.attacked = true;
                        this.enableHitbox("topSaber");
					}
				}
				else if (this.weapon.fireAngle == 225)
				{
					this.newPFrame = this.pDirEnum.UPLEFT;
					if (!this.attacked)
					{
					//	this.animations.play('ulAttack');
						this.attacked = true;
                        this.enableHitbox("topLeftSaber");
					}
				}
				else if (this.weapon.fireAngle == 315)
				{
					this.newPFrame = this.pDirEnum.UPRIGHT;
					if (!this.attacked)
					{
					//	this.animations.play('urAttack');
						this.attacked = true;
                        this.enableHitbox("topRightSaber");
					}
				}
			}

			if (this.newPFrame == this.pDirEnum.DOWNLEFT || this.newPFrame == this.pDirEnum.DOWNRIGHT) // Extra check just in case, as there is no down right or down left sprite
			{
				this.newPFrame = this.pDirEnum.DOWN;
			}

			if (!(this.rAttack.isPlaying)) //|| this.lAttack.isPlaying || this.uAttack.isPlaying || this.dAttack.isPlaying || this.urAttack.isPlaying || this.ulAttack.isPlaying || this.drAttack.isPlaying || this.dlAttack.isPlaying))
			{
				if (this.newPFrame != this.frame) 
				{
					this.frame = this.newPFrame;
				}
				else if (!keyState.isDown(Phaser.KeyCode.SPACEBAR))
				{
					this.attacked = false;
				}
            }
            if (this.animations.currentAnim.isFinished)
            {
                this.disableHitbox("rightSaber");
                this.disableHitbox("leftSaber");
                this.disableHitbox("topSaber");
                this.disableHitbox("topRightSaber");
                this.disableHitbox("topLeftSaber");
                this.disableHitbox("bottomSaber");
                this.disableHitbox("bottomRightSaber");
                this.disableHitbox("bottomLeftSaber");
            }
			// -----------------------------------------------------

			this.body.velocity.y = this.pVelocityY * time;
			this.body.velocity.x = this.pVelocityX * time;

			this.aim = false;
		}
	}
}

class Enemy extends Phaser.Sprite // -----------------------------------------------------Enemy code
{
	aim: boolean;
	eVelocityX: number;
	eVelocityY: number;
	eSpeed: number;
	weapon: Phaser.Weapon;
	player: Player;

	eMoveUp: boolean;
	eMoveDown: boolean;
	eMoveLeft: boolean;
	eMoveRight: boolean;
	eAim: boolean;

	fireTimer: number;
	dead: boolean;

	constructor(xPos: number, yPos: number, game: Phaser.Game, player: Player)
	{
		super(game, xPos, yPos, 'life');
		this.smoothed = false;
		this.exists = true;
		this.anchor.setTo(0.5, 0.5);

		this.game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.collideWorldBounds = true;
		this.maxHealth = 1;

		this.aim = false;
		this.eVelocityX = 0;
		this.eVelocityY = 0;
		this.eSpeed = 50;
		this.fireTimer = this.game.time.now + 3000;

		this.weapon = game.add.weapon(100, 'testBullet');
		this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.weapon.bulletSpeed = 200;
		this.weapon.fireRate = 500;

		this.player = player;
		game.add.existing(this);
	}

	ePathfinding()
	{
		if (this.alive)
		{
			if (this.position.x < this.player.position.x - 10)
			{
				this.eMoveLeft = false;
				this.eMoveRight = true;
			}
			else if (this.position.x > this.player.position.x + 10)
			{
				this.eMoveLeft = true;
				this.eMoveRight = false;
			}
			else
			{
				this.eMoveLeft = false;
				this.eMoveRight = false;
			}

			if (this.position.y < this.player.position.y - 10)
			{
				this.eMoveUp = false;
				this.eMoveDown = true;
			}
			else if (this.position.y > this.player.position.y + 10)
			{
				this.eMoveUp = true;
				this.eMoveDown = false;
			}
			else
			{
				this.eMoveUp = false;
				this.eMoveDown = false;
			}
		}
	}

	eUpdate(time: number)
	{
		if (this.alive)
		{
			this.eVelocityX = 0;
			this.eVelocityY = 0;

			if (this.game.time.now > this.fireTimer)
			{
				this.eAim = true;
				this.fireTimer = this.game.time.now + 2000;
			}

			if (this.eAim)
			{
				this.aim = true;
			}

			this.weapon.trackSprite(this, 0, 0);
			this.weapon.fireAngle = 0;

			this.ePathfinding();
			if (!this.aim)
			{
				if ((this.eMoveUp || this.eMoveDown) && (this.eMoveLeft || this.eMoveRight) && !((this.eMoveUp && this.eMoveDown) || (this.eMoveLeft && this.eMoveRight)))
				{
					if (this.eMoveUp)
					{
						this.eVelocityY -= Math.sqrt(Math.pow(this.eSpeed, 2) / 2);
					}
					else
					{
						this.eVelocityY += Math.sqrt(Math.pow(this.eSpeed, 2) / 2);
					}

					if (this.eMoveLeft)
					{
						this.eVelocityX -= Math.sqrt(Math.pow(this.eSpeed, 2) / 2);
					}
					else
					{
						this.eVelocityX += Math.sqrt(Math.pow(this.eSpeed, 2) / 2);
					}
				}
				else
				{
					if (this.eMoveUp)
					{
						this.eVelocityY -= this.eSpeed;
					}
					if (this.eMoveDown)
					{
						this.eVelocityY += this.eSpeed;
						this.weapon.fireAngle = 90;
					}

					if (this.eMoveLeft)
					{
						this.eVelocityX -= this.eSpeed;
						this.weapon.fireAngle = 180;
					}
					if (this.eMoveRight)
					{
						this.eVelocityX += this.eSpeed;
						this.weapon.fireAngle = 0;
					}
				}
			}
			else
			{
				if ((this.eMoveUp || this.eMoveDown) && (this.eMoveLeft || this.eMoveRight) && !((this.eMoveUp && this.eMoveDown) || (this.eMoveLeft && this.eMoveRight)))
				{
					if (this.eMoveUp)
					{
						this.weapon.trackOffset.y = -this.height / 2;
						this.weapon.fireAngle = 270;
					}
					else
					{
						this.weapon.trackOffset.y = this.height / 2;
						this.weapon.fireAngle = 90;
					}

					if (this.eMoveLeft)
					{
						this.weapon.trackOffset.x = -this.width / 2;
						if (this.weapon.fireAngle > 180)
						{
							this.weapon.fireAngle -= 45;
						}
						else
						{
							this.weapon.fireAngle += 45;
						}
					}
					else
					{
						this.weapon.trackOffset.x = this.width / 2;
						if (this.weapon.fireAngle > 180)
						{
							this.weapon.fireAngle += 45;
						}
						else
						{
							this.weapon.fireAngle -= 45;
						}
					}
				}
				else
				{
					if (this.eMoveUp)
					{
						this.weapon.trackOffset.y -= this.height / 2;
						this.weapon.fireAngle = 270;
					}
					if (this.eMoveDown)
					{
						this.weapon.trackOffset.y += this.height / 2;
						if (this.weapon.fireAngle == 270)
						{
							this.weapon.fireAngle = 0;
						}
						else
						{
							this.weapon.fireAngle = 90;
						}
					}

					if (this.eMoveLeft)
					{
						this.weapon.trackOffset.x -= this.width / 2;
						this.weapon.fireAngle = 180;
					}
					if (this.eMoveRight)
					{
						this.weapon.trackOffset.x += this.width / 2;
						this.weapon.fireAngle = 0;
					}
				}
				this.weapon.bulletAngleOffset = 90;
				this.weapon.fire();
				this.eAim = false;
			}

			this.body.velocity.y = this.eVelocityY * time;
			this.body.velocity.x = this.eVelocityX * time;

			this.aim = false;
		}
	}
}