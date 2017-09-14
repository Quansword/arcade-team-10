    window.onload = function() {
        //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
        //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
        //  Be sure to replace it with an updated version before you start experimenting with adding your own code.
        var game = new Phaser.Game(1600, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update});
        
        var keyState;
        var player;
        var playerSpeed = 175;

        var scoreText;
        function preload () {
            game.stage.backgroundColor = '#eee';
            game.load.image('logo', 'asset/phaser.png');
        }

        function create () {
            game.physics.startSystem(Phaser.Physics.ARCADE);

            keyState = game.input.keyboard.createCursorKeys();
            player = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
            player.anchor.setTo(0.5, 0.5);

            game.physics.enable(player, Phaser.Physics.ARCADE);
            player.body.collideWorldBounds = true;

            scoreText = game.add.text(5, 3, score);
        }

        function update(){
            if(keyState.up.isDown){
                player.body.velocity.y = -playerSpeed;
            }
            else if (keyState.down.isDown) {
                player.body.velocity.y = playerSpeed;
            }
            else {
                player.body.velocity.y = 0;
            }

            if (keyState.left.isDown) {
                player.body.velocity.x = -playerSpeed;
            }
            else if (keyState.right.isDown) {
                player.body.velocity.x = playerSpeed;
            }
            else {
                player.body.velocity.x = 0;
            }
        }
    };