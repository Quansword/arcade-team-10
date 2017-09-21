Berzerk.load = function(game, parent)
{
	this.game = game;
	Phaser.Group.call(this, game, parent);

	this.background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loadingBarBg');
	this.background.anchor.setTo(0.5, 0.5);
	this.add(this.background);

	this.bar = this.game.add.sprite(this.game.world.centerx - 175, this.game.world.centerY - 16, 'loadingBar');
	this.add(this.bar);
};

Berzerk.load.prototype = Object.create(Phaser.Group.prototype);
Berzerk.load.prototype.constructor = Berzerk.load;