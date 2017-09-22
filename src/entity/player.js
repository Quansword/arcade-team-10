Berzerk.player = function(xPos, yPos, game)
{
	Phaser.Sprite.call(this, game, xPos, yPos, 'pRight');
	this.xPos = xPos;
	this.yPos = yPos;
	this.game = game;

	this.aim = null;
	this.pVelocityX = null;
	this.pVelocityY = null;
	this.pSpeed = null;
	this.weapon = null;
	this.lives = null;

	this.game.add.existing(this);
};

Berzerk.player.initialize = function()
{
	this.scale.setTo(1, 1);
	this.exists = true;
	this.anchor.setTo(0.5, 0.5);
	this.lives = 3;

	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.collideWorldBounds = true;

	this.aim = false;
	this.pVelocityX = 0;
	this.pVelocityY = 0;
	this.pSpeed = 500;

	this.weapon = this.game.add.weapon(100, 'testBullet');
	this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	this.weapon.bulletSpeed = 200;
	this.weapon.fireRate = 500;
};

Berzerk.player.pUpdate = function(time, keyState)
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
				this.weapon.fireAngle = 270;
			}
			else
			{
				this.weapon.fireAngle = 90;
			}

			if (keyState.isDown(Phaser.KeyCode.A))
			{
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
				this.weapon.fireAngle = 270;
			}
			if (keyState.isDown(Phaser.KeyCode.S))
			{
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
				this.weapon.fireAngle = 180;
			}
			if (keyState.isDown(Phaser.KeyCode.D))
			{
				this.weapon.fireAngle = 0;
			}
		}
		this.weapon.bulletAngleOffset = 90;
		this.weapon.fire();
	}

	this.body.velocity.y = this.pVelocityY * time;
	this.body.velocity.x = this.pVelocityX * time;

	this.aim = false;
};

Berzerk.player.prototype = Object.create(Phaser.Sprite.prototype);
Berzerk.player.prototype.constructor = Berzerk.player;
Berzerk.player.prototype.initialize = Berzerk.player.initialize;
Berzerk.player.prototype.pUpdate = Berzerk.player.pUpdate;