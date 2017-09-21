var Berzerk = {};

Berzerk.boot = function(game){};
	
Berzerk.boot.prototype = 
{
	init: function()
	{
		this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.setScreenSize(true);
	},

	preload: function()	
	{
		this.load.image('loadingBar', 'assets/images/loading/loading-bar.png');
		this.load.image('loadingBarBg', 'assets/images/loading/loading-bar-bg.png');

		this.load.script('load', 'src/load.js');
	},

	update: function ()
	{
		this.state.start('preloader');
	},
};