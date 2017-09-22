Berzerk.preloader = function(game)
{
	this.ready = false;
	this.game = game;
};

Berzerk.preloader.prototype = 
{
	preload: function()
	{
		this.game.loadingBar = new Berzerk.load(this.game);
		this.game.load.setPreloadSprite(this.game.loadingBar.bar);

		this.game.loadingBar.background.tint = 0x7edcfc;
		this.game.loadingBar.bar.tint = 0xdcfc7e;

		var i = 2500;
		while(i--)
		{
			this.game.load.image('image' + i, 'assets/images/loading/loading-bar.png');
		}
	},

	create: function()
	{
		this.game.loadingBar.bar.cropEnabled = false;
	},

	update: function()
	{
			this.ready = true;
			this.game.state.start('game');
	}
};