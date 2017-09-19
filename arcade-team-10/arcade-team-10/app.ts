window.onload = function ()
{
	//  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
	//  Although it will work fine with this tutorial, it's almost certainly not the most current version.
	//  Be sure to replace it with an updated version before you start experimenting with adding your own code.
	var game = new Phaser.Game(1920, 1080, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	let keyState: Phaser.Keyboard;
	let player: Player;

	let walls: Phaser.Group;
	var gates;
	let gate1: Gate;
	let gate2: Gate;
	let gate3: Gate;
	let gate4: Gate;
	let background: Phaser.Sprite;

	let scoreText: Phaser.Text;
	var score;

	let lives: Phaser.Group;

	function preload()
	{
		game.stage.backgroundColor = '#eee';
		game.load.image('pAttack', 'assets/Testchar_side.png');
		game.load.image('pRight', 'assets/Testchar_right.png');
		game.load.image('pLeft', 'assets/Testchar_left.png');
		game.load.image('pDown', 'assets/Testchar_down.png');
		game.load.image('testBullet', 'assets/temp.png');

		game.load.image('background', 'assets/Maze1.png');
		game.load.image('wall', 'assets/wall.png');
		game.load.image('life', 'assets/life.png');
		game.load.image('gate', 'assets/gate.png');
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

		var style = { font: "bold 64px Arial", fill: '#fff', align: "right", boundsAlignH: "right" };
		scoreText = game.add.text(game.world.width - 100, 5, '0', style);
		scoreText.setTextBounds(-50, 0, 100, 100);
		score = 0;

		lives = game.add.group();
		for (var i = 0; i < player.lives; i++)
		{
			var life = lives.create(20 + (30 * i), 30, 'life');
			life.anchor.setTo(0.5, 0.5);
		}
	}

	function update()
	{
		let deltaTime: number = game.time.elapsed / 10;

		keyState = game.input.keyboard;

		player.pUpdate(deltaTime, keyState);
		game.physics.arcade.collide(player, walls, killPlayer);
		game.physics.arcade.collide(player, gates, screenTransition);
		game.physics.arcade.collide(player.weapon.bullets, walls, killBullet);

		scoreText.text = score;
	}

	function fullScreen()
	{
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.setGameSize(1280, 720);
	}

	function createWalls()
	{
		walls = game.add.physicsGroup();

		var wall1 = new Wall(145, 35, 400, 10, game, walls);
		var wall2 = new Wall(735, 35, 400, 10, game, walls);
		var wall3 = new Wall(735, 650, 400, 10, game, walls);
		var wall4 = new Wall(145, 650, 400, 10, game, walls);
		var wall5 = new Wall(145, 240, 220, 10, game, walls);
		var wall6 = new Wall(735, 240, 400, 10, game, walls);
		var wall7 = new Wall(145, 450, 220, 10, game, walls);
		var wall8 = new Wall(145, 35, 10, 200, game, walls);
		var wall9 = new Wall(145, 450, 10, 200, game, walls);
		var wall10 = new Wall(735, 450, 10, 200, game, walls);
		var wall11 = new Wall(1120, 450, 10, 200, game, walls);
		var wall12 = new Wall(1120, 35, 10, 200, game, walls);
		var wall13 = new Wall(530, 250, 10, 200, game, walls);
		var wall14 = new Wall(530, 440, 220, 10, game, walls);

		walls.enableBody = true;
	}

	function createGates()
	{
		gates = game.add.physicsGroup();

		gate1 = new Gate(540, 35, 200, 10, game, gates);
		gate2 = new Gate(540, 650, 200, 10, game, gates);
		gate3 = new Gate(145, 250, 10, 190, game, gates);
		gate4 = new Gate(1120, 250, 10, 190, game, gates);

		gates.enableBody = true;
	}

	function screenTransition(player: Player, gate: Gate)
	{
		gates.forEach(function (item)
		{
			item.renderable = false;
		});

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
	}

	function killPlayer(player: Player, wall: Wall)
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

	function killEnemy()
	{
		score += 50;
	}

	function killBullet(bullet: Phaser.Bullet, wall: Wall)
	{
		bullet.kill();
	}
};

class Wall
{
	constructor(xPos: number, yPos: number, width: number, height: number, game: Phaser.Game, walls)
	{
		var wall = game.add.sprite(xPos, yPos, 'wall');
		wall.scale.setTo(width, height);
		game.physics.arcade.enable(wall);
		wall.body.immovable = true;
		wall.renderable = false;
		walls.add(wall);
	}
}

class Gate extends Phaser.Sprite
{
	direction: number;

	constructor(xPos: number, yPos: number, width: number, height: number, game: Phaser.Game, gates)
	{
		super(game, xPos, yPos, 'gate');
		this.scale.setTo(width, height);
		game.physics.arcade.enable(this);
		this.body.immovable = true;
		this.renderable = false;
		gates.add(this);
	}
}

class Player extends Phaser.Sprite
{
	aim: boolean;
	pVelocityX: number;
	pVelocityY: number;
	pSpeed: number;
	weapon: Phaser.Weapon;
	lives: number;

	constructor(xPos: number, yPos: number, game: Phaser.Game)
	{
		super(game, xPos, yPos, 'pRight');
		this.scale.setTo(0.5, 0.5);
		this.exists = true;
		this.anchor.setTo(0.5, 0.5);

		this.game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.collideWorldBounds = true;
		this.maxHealth = 1;

		this.aim = false;
		this.pVelocityX = 0;
		this.pVelocityY = 0;
		this.pSpeed = 300;

		this.weapon = game.add.weapon(100, 'testBullet');
		this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.weapon.bulletSpeed = 200;
		this.weapon.fireRate = 500;

		this.lives = 3;
	}

	pUpdate(time: number, keyState: Phaser.Keyboard)
	{
		this.pVelocityX = 0;
		this.pVelocityY = 0;

		if (keyState.isDown(Phaser.KeyCode.SPACEBAR))
		{
			this.aim = true;
		}

		this.weapon.trackSprite(this, 0, 0);
		this.weapon.fireAngle = 0;

		if (!this.aim)
		{
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
					this.weapon.fireAngle = 90;
				}

				if (keyState.isDown(Phaser.KeyCode.A))
				{
					this.pVelocityX -= this.pSpeed;
					this.weapon.fireAngle = 180;
				}
				if (keyState.isDown(Phaser.KeyCode.D))
				{
					this.pVelocityX += this.pSpeed;
					this.weapon.fireAngle = 0;
				}
			}
		}
		else
		{
			if ((keyState.isDown(Phaser.KeyCode.W) || keyState.isDown(Phaser.KeyCode.S)) && (keyState.isDown(Phaser.KeyCode.D) || keyState.isDown(Phaser.KeyCode.A)) && !((keyState.isDown(Phaser.KeyCode.W) && keyState.isDown(Phaser.KeyCode.S)) || (keyState.isDown(Phaser.KeyCode.A) && keyState.isDown(Phaser.KeyCode.D))))
			{
				if (keyState.isDown(Phaser.KeyCode.W))
				{
					this.weapon.trackOffset.y = -this.height / 2;
					this.weapon.fireAngle = 270;
				}
				else
				{
					this.weapon.trackOffset.y = this.height / 2;
					this.weapon.fireAngle = 90;
				}

				if (keyState.isDown(Phaser.KeyCode.A))
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
				if (keyState.isDown(Phaser.KeyCode.W))
				{
					this.weapon.trackOffset.y -= this.height / 2;
					this.weapon.fireAngle = 270;
				}
				if (keyState.isDown(Phaser.KeyCode.S))
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

				if (keyState.isDown(Phaser.KeyCode.A))
				{
					this.weapon.trackOffset.x -= this.width / 2;
					this.weapon.fireAngle = 180;
				}
				if (keyState.isDown(Phaser.KeyCode.D))
				{
					this.weapon.trackOffset.x += this.width / 2;
					this.weapon.fireAngle = 0;
				}
			}
			this.weapon.bulletAngleOffset = 90;
			this.weapon.fire();
		}

		this.body.velocity.y = this.pVelocityY * time;
		this.body.velocity.x = this.pVelocityX * time;

		this.aim = false;
	}
}
