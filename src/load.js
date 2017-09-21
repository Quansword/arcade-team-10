Berzerk.load = function(game, parent)
{
	Phaser.Group.call(this, game, parent);

	this.background = game.add.sprite(game.world.centerX, game.world.centerY, 'loadingBarBg');
	this.background.anchor.setTo(0.5, 0.5);
	this.add(this.background);

	this.bar = game.add.sprite(game.world.centerx - 175, game.world.centerY - 16, 'loadingBar');
	this.add(this.bar);
};

Berzerk.load.prototype = Object.create(Phaser.Group.prototype);
Berzerk.load.prototype.constructor = Berzerk.load;