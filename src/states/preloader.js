Berzerk.preloader = function(game)
{
	this.ready = false;
};

Berzerk.preloader.prototype = 
{
	preload: function()
	{
		this.loadingBar = new Berzerk.load(this.game);
		this.load.setPreloadSprite(this.loadingBar.bar);

		this.loadingBar.background.tint = 0x7edcfc;
		this.loadingBar.bar.tint = 0xdcfc7e;
	},

	create: function()
	{
		this.loadingBar.bar.cropEnabled = false;
	},

	update: function()
	{
			this.ready = true;
			this.state.start('game');
	}
};