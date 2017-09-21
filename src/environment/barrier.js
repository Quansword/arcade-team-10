Berzerk.barrier = function(xPos, yPos, width, height, game, group, type)
{
	Phaser.Sprite.call(this);
	this.scale.setTo(width, height);
	game.physics.arcade.enable(this);
	this.body.immovable = true;
	this.renderable = false;
	group.add(this);
};

Berzerk.barrier.prototype =
{

};

Berzerk.barrier.prototype = Object.create(Phaser.Sprite.prototype);

Berzerk.barrier.prototype.constructor = Berzerk.barrier;