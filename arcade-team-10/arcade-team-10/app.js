var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
window.onload = function () {
    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.
    var game = new Phaser.Game(1920, 1080, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    var keyState;
    var player;
    var pAim;
    var scoreText;
    function preload() {
        game.stage.backgroundColor = '#eee';
        game.load.image('pAttack', 'assets/Testchar_side.png');
        game.load.image('pRight', 'assets/Testchar_right.png');
        game.load.image('pLeft', 'assets/Testchar_left.png');
        game.load.image('pDown', 'assets/Testchar_down.png');
        game.load.image('pAim', 'assets/phaser.png');
    }
    function create() {
        fullScreen();
        game.physics.startSystem(Phaser.Physics.ARCADE);
        player = new Player(game);
        game.add.existing(player);
        pAim = game.add.sprite(player.x + player.width / 2, player.y, 'pAim');
        pAim.anchor.setTo(0.5, 0.5);
        pAim.scale.setTo(0.2);
        //scoreText = game.add.text(5, 3, score);
    }
    function update() {
        var deltaTime = game.time.elapsed / 10;
        keyState = game.input.keyboard;
        player.pUpdate(deltaTime, keyState, pAim);
    }
    function fullScreen() {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setGameSize(1280, 720);
    }
};
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(game) {
        var _this = _super.call(this, game, screen.width / 2, screen.height / 2, 'pRight') || this;
        _this.exists = true;
        _this.anchor.setTo(0.5, 0.5);
        _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
        _this.body.collideWorldBounds = true;
        _this.maxHealth = 5;
        _this.aim = false;
        _this.pVelocityX = 0;
        _this.pVelocityY = 0;
        _this.pSpeed = 500;
        return _this;
    }
    Player.prototype.pUpdate = function (time, keyState, pAim) {
        this.pVelocityX = 0;
        this.pVelocityY = 0;
        if (keyState.isDown(Phaser.KeyCode.SPACEBAR)) {
            this.aim = true;
        }
        pAim.position.setTo(this.position.x, this.position.y);
        if (!this.aim) {
            if ((keyState.isDown(Phaser.KeyCode.W) || keyState.isDown(Phaser.KeyCode.S)) && (keyState.isDown(Phaser.KeyCode.D) || keyState.isDown(Phaser.KeyCode.A)) && !((keyState.isDown(Phaser.KeyCode.W) && keyState.isDown(Phaser.KeyCode.S)) || (keyState.isDown(Phaser.KeyCode.A) && keyState.isDown(Phaser.KeyCode.D)))) {
                if (keyState.isDown(Phaser.KeyCode.W)) {
                    this.pVelocityY -= Math.sqrt(Math.pow(this.pSpeed, 2) / 2);
                }
                else {
                    this.pVelocityY += Math.sqrt(Math.pow(this.pSpeed, 2) / 2);
                }
                if (keyState.isDown(Phaser.KeyCode.A)) {
                    this.pVelocityX -= Math.sqrt(Math.pow(this.pSpeed, 2) / 2);
                }
                else {
                    this.pVelocityX += Math.sqrt(Math.pow(this.pSpeed, 2) / 2);
                }
            }
            else {
                if (keyState.isDown(Phaser.KeyCode.W)) {
                    this.pVelocityY -= this.pSpeed;
                }
                if (keyState.isDown(Phaser.KeyCode.S)) {
                    this.pVelocityY += this.pSpeed;
                }
                if (keyState.isDown(Phaser.KeyCode.A)) {
                    this.pVelocityX -= this.pSpeed;
                }
                if (keyState.isDown(Phaser.KeyCode.D)) {
                    this.pVelocityX += this.pSpeed;
                }
            }
        }
        else {
            if ((keyState.isDown(Phaser.KeyCode.W) || keyState.isDown(Phaser.KeyCode.S)) && (keyState.isDown(Phaser.KeyCode.D) || keyState.isDown(Phaser.KeyCode.A)) && !((keyState.isDown(Phaser.KeyCode.W) && keyState.isDown(Phaser.KeyCode.S)) || (keyState.isDown(Phaser.KeyCode.A) && keyState.isDown(Phaser.KeyCode.D)))) {
                if (keyState.isDown(Phaser.KeyCode.W)) {
                    pAim.position.y = pAim.position.y - this.height / 2;
                }
                else {
                    pAim.position.y = pAim.position.y + this.height / 2;
                }
                if (keyState.isDown(Phaser.KeyCode.A)) {
                    pAim.position.x = pAim.position.x - this.width / 2;
                }
                else {
                    pAim.position.x = pAim.position.x + this.width / 2;
                }
            }
            else {
                if (keyState.isDown(Phaser.KeyCode.W)) {
                    pAim.position.y = pAim.position.y - this.height / 2;
                }
                if (keyState.isDown(Phaser.KeyCode.S)) {
                    pAim.position.y = pAim.position.y + this.height / 2;
                }
                if (keyState.isDown(Phaser.KeyCode.A)) {
                    pAim.position.x = pAim.position.x - this.width / 2;
                }
                if (keyState.isDown(Phaser.KeyCode.D)) {
                    pAim.position.x = pAim.position.x + this.width / 2;
                }
            }
        }
        this.body.velocity.y = this.pVelocityY * time;
        this.body.velocity.x = this.pVelocityX * time;
        this.aim = false;
    };
    return Player;
}(Phaser.Sprite));
//# sourceMappingURL=app.js.map