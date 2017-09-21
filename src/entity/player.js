Berzerk.player = function(xPos, yPos, game)
{
	Phaser.Sprite.call(this);
	aim = null;
	pVelocityX = null;
	pVelocityY = null;
	pSpeed = null;
	weapon = null;
	lives = null;
};

Berzerk.player.prototype =
{
	init: function()
	{
		this.scale.setTo(0.5, 0.5);
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
		this.game.add.existing(this);
	},

	pUpdate: function(time, keyState)
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
};

Berzerk.player.prototype = Object.create(Phaser.Sprite.prototype);

Berzerk.player.prototype.constructor = Berzerk.player;