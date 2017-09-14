window.onload = function ()
{
		//  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
		//  Although it will work fine with this tutorial, it's almost certainly not the most current version.
		//  Be sure to replace it with an updated version before you start experimenting with adding your own code.
		var game = new Phaser.Game(1920, 1080, Phaser.AUTO, '', { preload: preload, create: create, update: update});
		
		var keyState;
		var player;
		var playerSpeed = 500;
		var pVelocityX;
		var pVelocityY;

		var scoreText;
		function preload()
		{
			game.stage.backgroundColor = '#eee';
			game.load.image('logo', 'asset/phaser.png');
		}

		function create()
		{
			fullScreen();
			game.physics.startSystem(Phaser.Physics.ARCADE);

			keyState = game.input.keyboard.createCursorKeys();
			player = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
			player.anchor.setTo(0.5, 0.5);

			game.physics.enable(player, Phaser.Physics.ARCADE);
			player.body.collideWorldBounds = true;

			scoreText = game.add.text(5, 3, score);
		}

		function update(time)
		{
			pVelocityX = 0;
			pVelocityY = 0;

			if ((keyState.up.isDown || keyState.down.isDown) && (keyState.right.isDown || keyState.left.isDown) && !((keyState.up.isDown && keyState.down.isDown) || (keyState.left.isDown && keyState.right.isDown)))
			{
				if (keyState.up.isDown)
				{
					pVelocityY -= Math.sqrt(Math.pow(playerSpeed, 2) / 2);
				}
				else
				{
					pVelocityY += Math.sqrt(Math.pow(playerSpeed, 2) / 2);
				}

				if (keyState.left.isDown)
				{
					pVelocityX -= Math.sqrt(Math.pow(playerSpeed, 2) / 2);
				}
				else
				{
					pVelocityX += Math.sqrt(Math.pow(playerSpeed, 2) / 2);
				}
			}
			else
			{
				if (keyState.up.isDown)
				{
					pVelocityY -= playerSpeed;
				}
				if (keyState.down.isDown)
				{
					pVelocityY += playerSpeed;
				}

				if (keyState.left.isDown)
				{
					pVelocityX -= playerSpeed;
				}
				if (keyState.right.isDown)
				{
					pVelocityX += playerSpeed;
				}
			}

			player.body.velocity.y = pVelocityY;
			player.body.velocity.x = pVelocityX;
		}

		function fullScreen()
		{
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			game.scale.setScreenSize(true);
		}
	};