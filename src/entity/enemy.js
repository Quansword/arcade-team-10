Berzerk.enemy = function(xPos, yPos, game, player)
{
	aim = null;
	eVelocityX = null;
	eVelocityY = null;
	eSpeed = null;
	weapon = null;
	player = null;

	eMoveUp = null;
	eMoveDown = null;
	eMoveLeft = null;
	eMoveRight = null;
	eAim = null;

	fireTimer = null;
	dead = null;
};

Berzerk.barrier.prototype =
{
	ePathfinding: function()
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
	},

	eUpdate: function(time)
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
};

Berzerk.barrier.prototype = Object.create(Phaser.Sprite.prototype);

Berzerk.barrier.prototype.constructor = Berzerk.barrier;