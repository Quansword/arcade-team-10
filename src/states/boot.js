var Berzerk = {};

Berzerk.boot = function(game)
{
	this.game = game;
};
	
Berzerk.boot.prototype = 
{
	init: function()
	{
		this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.setScreenSize(true);
	},

	preload: function()	
	{
		this.game.load.image('loadingBar', 'assets/images/loading/loading-bar.png');
		this.game.load.image('loadingBarBg', 'assets/images/loading/loading-bar-bg.png');

		this.game.load.script('load', 'src/load.js');
	},

	update: function ()
	{
		this.game.state.start('preloader');
	},
};