Berzerk.load = function(game, parent)
{
	this.game = game;
	var load = this.game.add.group();

	this.background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loadingBarBg');
	this.background.anchor.setTo(0.5, 0.5);
	load.add(this.background);

	this.bar = this.game.add.sprite(this.game.world.centerx - 175, this.game.world.centerY - 16, 'loadingBar');
	load.add(this.bar);
};

Berzerk.load.prototype.constructor = Berzerk.load;