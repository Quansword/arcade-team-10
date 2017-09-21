Berzerk.barrier = function(xPos, yPos, width, height, game, group, type)
{
	this.game = game;
	this.group = group;

	this.xPos = xPos;
	this.yPos = yPos;
	this.type = type;

	this.width = width;
	this.height = height;
};

Berzerk.barrier.prototype =
{
	initialize: function()
	{
		var barrier = this.game.add.sprite(this.xPos, this.yPos, this.type);
		barrier.scale.setTo(this.width, this.height);
		this.game.physics.arcade.enable(barrier);
		barrier.body.immovable = true;
		barrier.renderable = true;
		this.group.add(barrier);
	},
};

Berzerk.barrier.prototype.constructor = Berzerk.barrier;