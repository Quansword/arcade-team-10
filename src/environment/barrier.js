Berzerk.barrier = function(xPos, yPos, width, height, game, group, type)
{
	Phaser.Sprite.call(this, game, xPos, yPos, type);
	this.game = game;
	this.group = group;

	this.xPos = xPos;
	this.yPos = yPos;
	this.type = type;

	this.width = width;
	this.height = height;
	this.game.add.existing(this);
};

Berzerk.barrier.initialize = function()
{
	this.scale.setTo(this.width, this.height);
	this.game.physics.arcade.enable(this);
	this.body.immovable = true;
	this.renderable = true;
	this.group.add(this);
};

Berzerk.barrier.prototype = Object.create(Phaser.Sprite.prototype);
Berzerk.barrier.prototype.constructor = Berzerk.barrier;
Berzerk.barrier.prototype.initialize = Berzerk.barrier.initialize;