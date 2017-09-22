Berzerk.player = function(xPos, yPos, game)
{
	this.xPos = xPos;
	this.yPos = yPos;
	this.game = game;

	this.aim = null;
	this.pVelocityX = null;
	this.pVelocityY = null;
	this.pSpeed = null;
	this.weapon = null;
	this.lives = null;

	this.player = null;
};

Berzerk.player.prototype =
{
	initialize: function()
	{
		this.player = this.game.add.sprite(this.xPos, this.yPos, 'pRight');
		this.player.scale.setTo(1, 1);
		this.player.exists = true;
		this.player.anchor.setTo(0.5, 0.5);
		this.lives = 3;

		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.body.collideWorldBounds = true;

		this.aim = false;
		this.pVelocityX = 0;
		this.pVelocityY = 0;
		this.pSpeed = 500;

		this.weapon = this.game.add.weapon(100, 'testBullet');
		this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.weapon.bulletSpeed = 200;
		this.weapon.fireRate = 500;

	},

	pUpdate: function(time, keyState)
	{
		this.pVelocityX = 0;
		this.pVelocityY = 0;

		if (keyState.isDown(Phaser.KeyCode.SPACEBAR))
		{
			this.aim = true;
		}

		this.weapon.trackSprite(this.player, 0, 0);
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

		this.player.body.velocity.y = this.pVelocityY * time;
		this.player.body.velocity.x = this.pVelocityX * time;

		this.aim = false;
	}
};

Berzerk.player.prototype.constructor = Berzerk.player;