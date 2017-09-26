(function()
{
    var game = new Phaser.Game(1920, 1080, Phaser.CANVAS, '');

    game.state.add('boot', Berzerk.boot);
    game.state.add('preloader', Berzerk.preloader);
    game.state.add('game', Berzerk.game);

    game.state.start('boot');
})();