//   ▄██████▄     ▄████████   ▄▄▄▄███▄▄▄▄      ▄████████ 
//  ███    ███   ███    ███ ▄██▀▀▀███▀▀▀██▄   ███    ███ 
//  ███    █▀    ███    ███ ███   ███   ███   ███    █▀  
// ▄███          ███    ███ ███   ███   ███  ▄███▄▄▄     
//▀▀███ ████▄  ▀███████████ ███   ███   ███ ▀▀███▀▀▀     
//  ███    ███   ███    ███ ███   ███   ███   ███    █▄  
//  ███    ███   ███    ███ ███   ███   ███   ███    ███ 
//  ████████▀    ███    █▀   ▀█   ███   █▀    ██████████ 
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
    var enemies;
    var enemyBullets;
    var walls;
    var gates;
    var gate1;
    var gate2;
    var gate3;
    var gate4;
    var background;
    var lives;
    var healthDrops;
    var hud;
    function preload() {
        game.stage.backgroundColor = '#eee';
        game.load.spritesheet('pSprite', 'assets/PlayerSpritesheet.png', 156, 128, 54, 0, 2);
        game.load.image('testBullet', 'assets/temp.png');
        game.load.image('background', 'assets/Level1.png');
        game.load.image('wall', 'assets/wall.png');
        game.load.image('life', 'assets/life.png');
        game.load.image('gate', 'assets/gate.png');
        game.load.image('heart', 'assets/Heart.png');
        game.load.spritesheet('eSprite', 'assets/EnemySpriteSheet.png', 32, 53, 4, 0, 2);
    }
    function create() {
        fullScreen();
        game.physics.startSystem(Phaser.Physics.ARCADE);
        background = game.add.sprite(0, 0, 'background');
        background.scale.setTo(0.7, 0.7);
        createWalls();
        player = new Player(2050, 1200, game);
        game.add.existing(player);
        game.world.setBounds(0, 0, 9600 * 0.7, 4864 * 0.7);
        game.camera.follow(player);
        game.renderer.renderSession.roundPixels = true;
        healthDrops = game.add.group();
        healthDrops.enableBody = true;
        healthDrops.physicsBodyType = Phaser.Physics.ARCADE;
        for (var i = 0; i < 3; i++) {
            healthDrops.add(new Phaser.Sprite(game, -1, -1, 'heart'));
            healthDrops.children[i].kill();
        }
        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;
        enemyBullets = game.add.physicsGroup();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        createEnemies();
        hud = game.add.group();
        hud.fixedToCamera = true;
        hud.enableBody = false;
        for (var i = 0; i < player.maxHealth; i++) {
            hud.add(new Phaser.Sprite(game, 0, 0, 'heart'));
            hud.children[i].position.set((hud.children[i].width * i) + (hud.children[i].width / 2), hud.children[i].height / 2);
        }
    }
    function update() {
        var deltaTime = game.time.elapsed / 10;
        keyState = game.input.keyboard;
        player.pUpdate(deltaTime, keyState);
        enemies.forEach(function (enemy) {
            enemy.eUpdate(deltaTime);
        }, this);
        game.physics.arcade.collide(player, walls);
        game.physics.arcade.collide(enemies, walls);
        game.physics.arcade.collide(player, gates, screenTransition);
        game.physics.arcade.overlap(player, healthDrops, pickupHealth);
        game.physics.arcade.collide(player.weapon.bullets, walls, killBullet);
        game.physics.arcade.collide(enemyBullets, walls, killBullet);
        game.physics.arcade.overlap(player, enemies, enemyHitPlayer);
        game.physics.arcade.overlap(player.weapon.bullets, enemies, bulletHitEnemy, null, this);
        for (var i = 0; i < enemies.children.length; i++) {
            game.physics.arcade.overlap(enemies.children[i].weapon.bullets, player, bulletHitPlayer, null, this);
            for (var j = 0; j < player.saberHitBoxes.children.length; j++) {
                game.physics.arcade.overlap(player.saberHitBoxes.children[j], enemies.children[i].weapon.bullets, bulletHitSaber, null, this);
            }
        }
        for (var j = 0; j < player.saberHitBoxes.children.length; j++) {
            game.physics.arcade.overlap(player.saberHitBoxes.children[j], enemies, saberHitEnemy, null, this);
        }
        render();
    }
    function render() {
        game.debug.bodyInfo(player, 32, 32);
        game.debug.body(player);
        for (var i = 0; i < enemies.children.length; i++) {
            game.debug.bodyInfo(enemies.children[i], 32, 32);
            game.debug.body(enemies.children[i]);
        }
    }
    function fullScreen() {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setGameSize(1280, 720);
    }
    function bulletHitSaber(saber, bullet) {
        bullet.body.velocity.x = -bullet.body.velocity.x;
        bullet.body.velocity.y = -bullet.body.velocity.y;
        player.weapon.bullets.add(bullet);
        bullet.rotation += Math.PI;
    }
    function saberHitEnemy(saber, enemy) {
        enemy.kill();
        dropHealth(enemy.position.x, enemy.position.y);
    }
    function bulletHitPlayer(player, bullet) {
        bullet.kill();
        damagePlayer(player, 1);
    }
    function enemyHitPlayer(player, enemy) {
        damagePlayer(player, 1);
    }
    function damagePlayer(player, dNum) {
        if (player.canDamage) {
            player.damage(dNum);
            hud.children[player.health].visible = false;
            if (player.health != 0) {
                playerInvuln();
                playerVisible();
                game.time.events.repeat(200, 3, playerVisible, this);
                game.time.events.add(800, playerInvuln, this);
            }
        }
    }
    function playerVisible() {
        player.alpha = (player.alpha + 1) % 2;
    }
    function playerInvuln() {
        player.canDamage = !player.canDamage;
    }
    function healPlayer(player, hNum) {
        hud.children[player.health].visible = true;
        player.heal(hNum);
    }
    function pickupHealth(player, healthDrop) {
        if (player.health != player.maxHealth) {
            healPlayer(player, 1);
            healthDrop.kill();
        }
    }
    function increaseHealth(player) {
        player.maxHealth += 1;
        player.heal(1);
        hud.add(new Phaser.Sprite(game, (hud.children[0].width * (player.maxHealth - 1)) + (hud.children[0].width / 2), hud.children[0].height / 2, 'heart'));
    }
    function bulletHitEnemy(enemy, bullet) {
        bullet.kill();
        enemy.kill();
        dropHealth(enemy.position.x, enemy.position.y);
    }
    function createEnemies() {
        var enemy1 = new Enemy(2000, 900, game, 2, player);
        enemies.add(enemy1);
        enemyBullets.add(enemy1.weapon.bullets);
        var enemy2 = new Enemy(2000, 800, game, 2, player);
        enemies.add(enemy2);
        enemyBullets.add(enemy2.weapon.bullets);
        var enemy3 = new Enemy(2000, 700, game, 2, player);
        enemies.add(enemy3);
        enemyBullets.add(enemy3.weapon.bullets);
    }
    function createWalls() {
        walls = game.add.physicsGroup();
        //Spawn Room walls
        var wall1 = new Barrier(760, 810, 1170, 120, game, walls, 'wall');
        var wall2 = new Barrier(2100, 810, 1170, 120, game, walls, 'wall');
        var wall3 = new Barrier(2377, 1120, 896, 90, game, walls, 'wall');
        var wall4 = new Barrier(1300, 1570, 1430, 120, game, walls, 'wall');
        var wall5 = new Barrier(1300, 930, 350, 670, game, walls, 'wall');
        var wall6 = new Barrier(2377, 930, 350, 280, game, walls, 'wall');
        var wall7 = new Barrier(2380, 1380, 350, 250, game, walls, 'wall');
        // Room abve spawn room
        var wall8 = new Barrier(2100, 620, 47, 300, game, walls, 'wall');
        var wall9 = new Barrier(1882, 540, 265, 80, game, walls, 'wall');
        var wall10 = new Barrier(1300, 540, 360, 80, game, walls, 'wall');
        var wall12 = new Barrier(1300, 540, 90, 300, game, walls, 'wall');
        var wall15 = new Barrier(1882, 272, 45, 340, game, walls, 'wall');
        walls.enableBody = true;
    }
    function createGates() {
        gates = game.add.physicsGroup();
        gate1 = new Barrier(540, 35, 200, 10, game, gates, 'gate');
        gate2 = new Barrier(540, 650, 200, 10, game, gates, 'gate');
        gate3 = new Barrier(145, 250, 10, 190, game, gates, 'gate');
        gate4 = new Barrier(1120, 300, 10, 190, game, gates, 'gate');
        gates.enableBody = true;
    }
    function screenTransition(player, gate) {
        gates.forEach(function (item) {
            item.renderable = false;
        }, this);
        if (player.body.touching.left && gate4.renderable != true) {
            player.body.position.x = 1000;
            player.body.position.y = 300;
            gate4.renderable = true;
        }
        else if (player.body.touching.right && gate3.renderable != true) {
            player.body.position.x = 300;
            player.body.position.y = 300;
            gate3.renderable = true;
        }
        else if (player.body.touching.down && gate1.renderable != true) {
            player.body.position.x = 600;
            player.body.position.y = 100;
            gate1.renderable = true;
        }
        else if (player.body.touching.up && gate2.renderable != true) {
            player.body.position.x = 600;
            player.body.position.y = 500;
            gate2.renderable = true;
        }
        enemies.removeAll();
        enemyBullets.removeAll();
        createEnemies();
    }
    function killPlayer(player) {
        var life = lives.getFirstAlive();
        if (life) {
            life.kill();
            player.kill();
            player.lives--;
            player.reset(300, 300, 1);
        }
        if (player.lives < 1) {
            player.kill();
        }
    }
    function killBullet(bullet, wall) {
        bullet.kill();
    }
    function dropHealth(x, y) {
        var rand = game.rnd.integerInRange(1, 100);
        if (rand > 97) {
            for (var i = 0; i < 3; i++) {
                if (healthDrops.children[i].alive == false) {
                    healthDrops.children[i].revive();
                    healthDrops.children[i].position.x = x;
                    healthDrops.children[i].position.y = y;
                    break;
                }
            }
        }
    }
};
//▀█████████▄     ▄████████    ▄████████    ▄████████  ▄█     ▄████████    ▄████████ 
//  ███    ███   ███    ███   ███    ███   ███    ███ ███    ███    ███   ███    ███ 
//  ███    ███   ███    ███   ███    ███   ███    ███ ███▌   ███    █▀    ███    ███ 
// ▄███▄▄▄██▀    ███    ███  ▄███▄▄▄▄██▀  ▄███▄▄▄▄██▀ ███▌  ▄███▄▄▄      ▄███▄▄▄▄██▀ 
//▀▀███▀▀▀██▄  ▀███████████ ▀▀███▀▀▀▀▀   ▀▀███▀▀▀▀▀   ███▌ ▀▀███▀▀▀     ▀▀███▀▀▀▀▀   
//  ███    ██▄   ███    ███ ▀███████████ ▀███████████ ███    ███    █▄  ▀███████████ 
//  ███    ███   ███    ███   ███    ███   ███    ███ ███    ███    ███   ███    ███ 
//▄█████████▀    ███    █▀    ███    ███   ███    ███ █▀     ██████████   ███    ███ 
//                            ███    ███   ███    ███                     ███    ███ 
var Barrier = (function (_super) {
    __extends(Barrier, _super);
    function Barrier(xPos, yPos, width, height, game, group, type) {
        var _this = _super.call(this, game, xPos, yPos, type) || this;
        _this.scale.setTo(width, height);
        game.physics.arcade.enable(_this);
        _this.body.immovable = true;
        _this.renderable = true;
        group.add(_this);
        return _this;
    }
    return Barrier;
}(Phaser.Sprite));
//   ▄███████▄  ▄█          ▄████████ ▄██   ▄      ▄████████    ▄████████ 
//  ███    ███ ███         ███    ███ ███   ██▄   ███    ███   ███    ███ 
//  ███    ███ ███         ███    ███ ███▄▄▄███   ███    █▀    ███    ███ 
//  ███    ███ ███         ███    ███ ▀▀▀▀▀▀███  ▄███▄▄▄      ▄███▄▄▄▄██▀ 
//▀█████████▀  ███       ▀███████████ ▄██   ███ ▀▀███▀▀▀     ▀▀███▀▀▀▀▀   
//  ███        ███         ███    ███ ███   ███   ███    █▄  ▀███████████ 
//  ███        ███▌    ▄   ███    ███ ███   ███   ███    ███   ███    ███ 
// ▄████▀      █████▄▄██   ███    █▀   ▀█████▀    ██████████   ███    ███ 
//             ▀                                               ███    ███ 
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(xPos, yPos, game) {
        var _this = _super.call(this, game, xPos, yPos, 'pSprite') || this;
        _this.pDirEnum = {
            RIGHT: 0,
            LEFT: 1,
            UPRIGHT: 2,
            UPLEFT: 3,
            DOWN: 4,
            UP: 5,
            DOWNRIGHT: 6,
            DOWNLEFT: 7
        };
        _this.rAttack = _this.animations.add('rAttack', [6, 7, 8, 9, 10, 11], 10);
        _this.lAttack = _this.animations.add('lAttack', [12, 13, 14, 15, 16, 17], 10);
        _this.uAttack = _this.animations.add('uAttack', [18, 19, 20, 21, 22, 23], 10);
        _this.dAttack = _this.animations.add('dAttack', [24, 25, 26, 27, 28, 29], 10);
        _this.urAttack = _this.animations.add('urAttack', [30, 31, 32, 33, 34, 35], 10);
        _this.ulAttack = _this.animations.add('ulAttack', [36, 37, 38, 39, 40, 41], 10);
        _this.drAttack = _this.animations.add('drAttack', [42, 43, 44, 45, 46, 47], 10);
        _this.dlAttack = _this.animations.add('dlAttack', [48, 49, 50, 51, 52, 53], 10);
        _this.attacked = false;
        _this.frame = _this.pDirEnum.RIGHT;
        _this.newPFrame = _this.frame;
        _this.smoothed = false;
        _this.exists = true;
        _this.anchor.setTo(0.5, 0.5);
        _this.scale.setTo(1.5, 1.5);
        _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
        _this.body.setSize(24, 42, 48, 48);
        _this.body.collideWorldBounds = true;
        _this.maxHealth = 5;
        _this.health = _this.maxHealth;
        _this.canDamage = true;
        _this.aim = false;
        _this.pVelocityX = 0;
        _this.pVelocityY = 0;
        _this.pSpeed = 150;
        _this.weapon = game.add.weapon(100, 'testBullet');
        _this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        _this.weapon.bulletSpeed = 200;
        _this.weapon.autofire = false;
        _this.weapon.bulletAngleOffset = 90;
        _this.lives = 1;
        _this.createSaberHitBoxes();
        return _this;
    }
    Player.prototype.createSaberHitBoxes = function () {
        this.saberHitBoxes = this.game.add.physicsGroup();
        this.addChild(this.saberHitBoxes);
        this.rightSaber = this.game.add.sprite(10, 0);
        this.rightSaber.anchor.setTo(0.5, 0.5);
        this.rightSaber.scale.setTo(1, 1.4);
        this.game.physics.enable(this.rightSaber, Phaser.Physics.ARCADE);
        this.saberHitBoxes.addChild(this.rightSaber);
        this.rightSaber.name = "rightSaber";
        this.disableHitbox("rightSaber");
        this.leftSaber = this.game.add.sprite(-45, 0);
        this.leftSaber.anchor.setTo(0.5, 0.5);
        this.leftSaber.scale.setTo(1, 1.4);
        this.game.physics.enable(this.leftSaber, Phaser.Physics.ARCADE);
        this.saberHitBoxes.addChild(this.leftSaber);
        this.leftSaber.name = "leftSaber";
        this.disableHitbox("leftSaber");
        this.topSaber = this.game.add.sprite(-18, -23);
        this.topSaber.anchor.setTo(0.5, 0.5);
        this.topSaber.scale.setTo(1.75, 0.8);
        this.game.physics.enable(this.topSaber, Phaser.Physics.ARCADE);
        this.saberHitBoxes.addChild(this.topSaber);
        this.topSaber.name = "topSaber";
        this.disableHitbox("topSaber");
        this.topRightSaber = this.game.add.sprite(0, -10);
        this.topRightSaber.anchor.setTo(0.5, 0.5);
        this.topRightSaber.scale.setTo(1.75, 0.8);
        this.topRightSaber.rotation += 0.4;
        this.game.physics.enable(this.topRightSaber, Phaser.Physics.ARCADE);
        this.saberHitBoxes.addChild(this.topRightSaber);
        this.topRightSaber.name = "topRightSaber";
        this.disableHitbox("topRightSaber");
        this.topLeftSaber = this.game.add.sprite(-35, -10);
        this.topLeftSaber.anchor.setTo(0.5, 0.5);
        this.topLeftSaber.scale.setTo(1.75, 0.8);
        this.topLeftSaber.rotation -= 0.4;
        this.game.physics.enable(this.topLeftSaber, Phaser.Physics.ARCADE);
        this.saberHitBoxes.addChild(this.topLeftSaber);
        this.topLeftSaber.name = "topLeftSaber";
        this.disableHitbox("topLeftSaber");
        this.bottomSaber = this.game.add.sprite(-18, 33);
        this.bottomSaber.anchor.setTo(0.5, 0.5);
        this.bottomSaber.scale.setTo(1.75, 0.8);
        this.game.physics.enable(this.bottomSaber, Phaser.Physics.ARCADE);
        this.saberHitBoxes.addChild(this.bottomSaber);
        this.bottomSaber.name = "bottomSaber";
        this.disableHitbox("bottomSaber");
        this.bottomRightSaber = this.game.add.sprite(5, 20);
        this.bottomRightSaber.anchor.setTo(0.5, 0.5);
        this.bottomRightSaber.scale.setTo(1.75, 0.8);
        this.bottomRightSaber.rotation -= 0.4;
        this.game.physics.enable(this.bottomRightSaber, Phaser.Physics.ARCADE);
        this.saberHitBoxes.addChild(this.bottomRightSaber);
        this.bottomRightSaber.name = "bottomRightSaber";
        this.disableHitbox("bottomRightSaber");
        this.bottomLeftSaber = this.game.add.sprite(-35, 20);
        this.bottomLeftSaber.anchor.setTo(0.5, 0.5);
        this.bottomLeftSaber.scale.setTo(1.75, 0.8);
        this.bottomLeftSaber.rotation += 0.4;
        this.game.physics.enable(this.bottomLeftSaber, Phaser.Physics.ARCADE);
        this.saberHitBoxes.addChild(this.bottomLeftSaber);
        this.bottomLeftSaber.name = "bottomLeftSaber";
        this.disableHitbox("bottomLeftSaber");
        this.saberHitBoxes.enableBody = true;
    };
    Player.prototype.disableHitbox = function (name) {
        if (name == "rightSaber") {
            this.rightSaber.kill();
        }
        else if (name == "leftSaber") {
            this.leftSaber.kill();
        }
        else if (name == "topSaber") {
            this.topSaber.kill();
        }
        else if (name == "topRightSaber") {
            this.topRightSaber.kill();
        }
        else if (name == "topLeftSaber") {
            this.topLeftSaber.kill();
        }
        else if (name == "bottomSaber") {
            this.bottomSaber.kill();
        }
        else if (name == "bottomRightSaber") {
            this.bottomRightSaber.kill();
        }
        else if (name == "bottomLeftSaber") {
            this.bottomLeftSaber.kill();
        }
    };
    Player.prototype.enableHitbox = function (name) {
        if (name == "rightSaber") {
            this.rightSaber.reset(10, 0);
        }
        else if (name == "leftSaber") {
            this.leftSaber.reset(-45, 0);
        }
        else if (name == "topSaber") {
            this.topSaber.reset(-18, -23);
        }
        else if (name == "topRightSaber") {
            this.topRightSaber.reset(0, -10);
        }
        else if (name == "topLeftSaber") {
            this.topLeftSaber.reset(-35, -10);
        }
        else if (name == "bottomSaber") {
            this.bottomSaber.reset(-18, 33);
        }
        else if (name == "bottomRightSaber") {
            this.bottomRightSaber.reset(5, 20);
        }
        else if (name == "bottomLeftSaber") {
            this.bottomLeftSaber.reset(-35, 20);
        }
    };
    Player.prototype.pUpdate = function (time, keyState) {
        if (this.alive) {
            this.pVelocityX = 0;
            this.pVelocityY = 0;
            if (keyState.isDown(Phaser.KeyCode.SPACEBAR) && !(this.rAttack.isPlaying || this.lAttack.isPlaying || this.uAttack.isPlaying || this.dAttack.isPlaying || this.urAttack.isPlaying || this.ulAttack.isPlaying || this.drAttack.isPlaying || this.dlAttack.isPlaying)) {
                this.aim = true;
            }
            this.weapon.trackSprite(this, 0, 0);
            if ((keyState.isDown(Phaser.KeyCode.W) || keyState.isDown(Phaser.KeyCode.S)) && (keyState.isDown(Phaser.KeyCode.D) || keyState.isDown(Phaser.KeyCode.A)) && !((keyState.isDown(Phaser.KeyCode.W) && keyState.isDown(Phaser.KeyCode.S)) || (keyState.isDown(Phaser.KeyCode.A) && keyState.isDown(Phaser.KeyCode.D)))) {
                if (keyState.isDown(Phaser.KeyCode.W)) {
                    this.pVelocityY -= Math.sqrt(Math.pow(this.pSpeed, 2) / 2);
                    this.weapon.fireAngle = 270;
                }
                else {
                    this.pVelocityY += Math.sqrt(Math.pow(this.pSpeed, 2) / 2);
                    this.weapon.fireAngle = 90;
                }
                if (keyState.isDown(Phaser.KeyCode.A)) {
                    this.pVelocityX -= Math.sqrt(Math.pow(this.pSpeed, 2) / 2);
                    if (this.weapon.fireAngle > 180) {
                        this.weapon.fireAngle -= 45;
                    }
                    else {
                        this.weapon.fireAngle += 45;
                    }
                }
                else {
                    this.pVelocityX += Math.sqrt(Math.pow(this.pSpeed, 2) / 2);
                    if (this.weapon.fireAngle > 180) {
                        this.weapon.fireAngle += 45;
                    }
                    else {
                        this.weapon.fireAngle -= 45;
                    }
                }
            }
            else {
                if (keyState.isDown(Phaser.KeyCode.W)) {
                    this.pVelocityY -= this.pSpeed;
                    this.weapon.fireAngle = 270;
                }
                if (keyState.isDown(Phaser.KeyCode.S)) {
                    this.pVelocityY += this.pSpeed;
                    if (this.weapon.fireAngle == 270) {
                        this.weapon.fireAngle = 0;
                    }
                    else {
                        this.weapon.fireAngle = 90;
                    }
                }
                if (keyState.isDown(Phaser.KeyCode.A)) {
                    this.pVelocityX -= this.pSpeed;
                    this.weapon.fireAngle = 180;
                }
                if (keyState.isDown(Phaser.KeyCode.D)) {
                    this.pVelocityX += this.pSpeed;
                    this.weapon.fireAngle = 0;
                }
            }
            // ----------------------------------------------------- Determining new direction
            if (this.pVelocityX > 0) {
                if (this.pVelocityY > 0) {
                    this.newPFrame = this.pDirEnum.DOWNRIGHT;
                }
                else if (this.pVelocityY < 0) {
                    this.newPFrame = this.pDirEnum.UPRIGHT;
                }
                else {
                    this.newPFrame = this.pDirEnum.RIGHT;
                }
            }
            else if (this.pVelocityX < 0) {
                if (this.pVelocityY > 0) {
                    this.newPFrame = this.pDirEnum.DOWNLEFT;
                }
                else if (this.pVelocityY < 0) {
                    this.newPFrame = this.pDirEnum.UPLEFT;
                }
                else {
                    this.newPFrame = this.pDirEnum.LEFT;
                }
            }
            else {
                if (this.pVelocityY > 0) {
                    this.newPFrame = this.pDirEnum.DOWN;
                }
                else if (this.pVelocityY < 0) {
                    this.newPFrame = this.pDirEnum.UP;
                }
            }
            if (this.aim) {
                if (this.weapon.fireAngle == 90) {
                    this.newPFrame = this.pDirEnum.DOWN;
                    if (!this.attacked) {
                        this.animations.play('dAttack');
                        this.attacked = true;
                        this.enableHitbox("bottomSaber");
                    }
                }
                else if (this.weapon.fireAngle == 45) {
                    this.newPFrame = this.pDirEnum.DOWNRIGHT;
                    if (!this.attacked) {
                        this.animations.play('drAttack');
                        this.attacked = true;
                        this.enableHitbox("bottomRightSaber");
                    }
                }
                else if (this.weapon.fireAngle == 135) {
                    this.newPFrame = this.pDirEnum.DOWNLEFT;
                    if (!this.attacked) {
                        this.animations.play('dlAttack');
                        this.attacked = true;
                        this.enableHitbox("bottomLeftSaber");
                    }
                }
                else if (this.weapon.fireAngle == 0) {
                    this.newPFrame = this.pDirEnum.RIGHT;
                    if (!this.attacked) {
                        this.animations.play('rAttack');
                        this.attacked = true;
                        this.enableHitbox("rightSaber");
                    }
                }
                else if (this.weapon.fireAngle == 180) {
                    this.newPFrame = this.pDirEnum.LEFT;
                    if (!this.attacked) {
                        this.animations.play('lAttack');
                        this.attacked = true;
                        this.enableHitbox("leftSaber");
                    }
                }
                else if (this.weapon.fireAngle == 270) {
                    this.newPFrame = this.pDirEnum.UP;
                    if (!this.attacked) {
                        this.animations.play('uAttack');
                        this.attacked = true;
                        this.enableHitbox("topSaber");
                    }
                }
                else if (this.weapon.fireAngle == 225) {
                    this.newPFrame = this.pDirEnum.UPLEFT;
                    if (!this.attacked) {
                        this.animations.play('ulAttack');
                        this.attacked = true;
                        this.enableHitbox("topLeftSaber");
                    }
                }
                else if (this.weapon.fireAngle == 315) {
                    this.newPFrame = this.pDirEnum.UPRIGHT;
                    if (!this.attacked) {
                        this.animations.play('urAttack');
                        this.attacked = true;
                        this.enableHitbox("topRightSaber");
                    }
                }
            }
            if (this.newPFrame == this.pDirEnum.DOWNLEFT || this.newPFrame == this.pDirEnum.DOWNRIGHT) {
                this.newPFrame = this.pDirEnum.DOWN;
            }
            if (!(this.rAttack.isPlaying || this.lAttack.isPlaying || this.uAttack.isPlaying || this.dAttack.isPlaying || this.urAttack.isPlaying || this.ulAttack.isPlaying || this.drAttack.isPlaying || this.dlAttack.isPlaying)) {
                if (this.newPFrame != this.frame) {
                    this.frame = this.newPFrame;
                }
                else if (!keyState.isDown(Phaser.KeyCode.SPACEBAR)) {
                    this.attacked = false;
                }
            }
            if (this.animations.currentAnim.isFinished) {
                this.disableHitbox("rightSaber");
                this.disableHitbox("leftSaber");
                this.disableHitbox("topSaber");
                this.disableHitbox("topRightSaber");
                this.disableHitbox("topLeftSaber");
                this.disableHitbox("bottomSaber");
                this.disableHitbox("bottomRightSaber");
                this.disableHitbox("bottomLeftSaber");
            }
            // -----------------------------------------------------
            this.body.velocity.y = this.pVelocityY * time;
            this.body.velocity.x = this.pVelocityX * time;
            this.aim = false;
        }
    };
    return Player;
}(Phaser.Sprite));
//   ▄████████ ███▄▄▄▄      ▄████████   ▄▄▄▄███▄▄▄▄   ▄██   ▄   
//  ███    ███ ███▀▀▀██▄   ███    ███ ▄██▀▀▀███▀▀▀██▄ ███   ██▄ 
//  ███    █▀  ███   ███   ███    █▀  ███   ███   ███ ███▄▄▄███ 
// ▄███▄▄▄     ███   ███  ▄███▄▄▄     ███   ███   ███ ▀▀▀▀▀▀███ 
//▀▀███▀▀▀     ███   ███ ▀▀███▀▀▀     ███   ███   ███ ▄██   ███ 
//  ███    █▄  ███   ███   ███    █▄  ███   ███   ███ ███   ███ 
//  ███    ███ ███   ███   ███    ███ ███   ███   ███ ███   ███ 
//  ██████████  ▀█   █▀    ██████████  ▀█   ███   █▀   ▀█████▀ 
var Enemy = (function (_super) {
    __extends(Enemy, _super); // -----------------------------------------------------Enemy code
    function Enemy(xPos, yPos, game, enemyType, player) {
        var _this = _super.call(this, game, xPos, yPos, 'eSprite') || this;
        _this.enemyTypeEnum = {
            BASE: 0,
            RAPID: 1,
            SHOTGUN: 2,
            LASER: 3
        };
        _this.eType = enemyType;
        if (_this.eType == _this.enemyTypeEnum.RAPID) {
            _this.frame = 1;
        }
        else if (_this.eType == _this.enemyTypeEnum.LASER) {
            _this.frame = 3;
        }
        else if (_this.eType == _this.enemyTypeEnum.SHOTGUN) {
            _this.frame = 2;
        }
        _this.smoothed = false;
        _this.exists = true;
        _this.anchor.setTo(0.5, 0.5);
        _this.scale.setTo(1.5, 1.5);
        _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
        _this.body.collideWorldBounds = true;
        _this.body.setSize(28, 49, 2, 2);
        _this.maxHealth = 1;
        _this.eAim = false;
        _this.aim = false;
        _this.linedUp = false;
        _this.eVelocityX = 0;
        _this.eVelocityY = 0;
        _this.fireTimer = _this.game.time.now + 3000;
        _this.weapon = game.add.weapon(100, 'testBullet');
        _this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        _this.weapon.bulletSpeed = 200;
        _this.weapon.fireRate = 500;
        _this.weapon.bulletAngleOffset = 90;
        if (_this.eType == _this.enemyTypeEnum.BASE) {
            _this.weapon.fireRate = 2000;
            _this.eSpeed = 50;
        }
        else if (_this.eType == _this.enemyTypeEnum.RAPID) {
            _this.weapon.fireRate = 700;
            _this.eSpeed = 60;
        }
        else if (_this.eType == _this.enemyTypeEnum.LASER) {
            _this.weapon.fireRate = 100;
            _this.eSpeed = 35;
        }
        else {
            _this.weapon.fireRate = 0;
            _this.eSpeed = 35;
        }
        _this.player = player;
        game.add.existing(_this);
        return _this;
    }
    Enemy.prototype.ePathfinding = function (time) {
        this.eMoveUp = false;
        this.eMoveRight = false;
        this.eMoveLeft = false;
        this.eMoveDown = false;
        if (this.alive) {
            //if (this.eType = this.enemyTypeEnum.BASE)
            //{
            if (time < 1000) {
                if (this.position.x <= this.player.position.x) {
                    if (this.position.x < this.player.position.x - 150) {
                        this.eMoveLeft = false;
                        this.eMoveRight = true;
                    }
                    else if (this.position.x > this.player.position.x - 100) {
                        this.eMoveLeft = true;
                        this.eMoveRight = false;
                    }
                    else {
                        this.eMoveLeft = false;
                        this.eMoveRight = true;
                    }
                }
                else {
                    if (this.position.x > this.player.position.x + 150) {
                        this.eMoveLeft = true;
                        this.eMoveRight = false;
                    }
                    else if (this.position.x < this.player.position.x + 100) {
                        this.eMoveLeft = false;
                        this.eMoveRight = true;
                    }
                    else {
                        this.eMoveLeft = true;
                        this.eMoveRight = false;
                    }
                }
                if (this.position.y <= this.player.position.y) {
                    if (this.position.y < this.player.position.y - 150) {
                        this.eMoveUp = false;
                        this.eMoveDown = true;
                    }
                    else if (this.position.y > this.player.position.y - 100) {
                        this.eMoveUp = true;
                        this.eMoveDown = false;
                    }
                    else {
                        this.eMoveUp = false;
                        this.eMoveDown = true;
                    }
                }
                else {
                    if (this.position.y > this.player.position.y + 150) {
                        this.eMoveUp = true;
                        this.eMoveDown = false;
                    }
                    else if (this.position.y < this.player.position.y + 100) {
                        this.eMoveUp = false;
                        this.eMoveDown = true;
                    }
                    else {
                        this.eMoveUp = true;
                        this.eMoveDown = false;
                    }
                }
            }
            else {
                if (this.position.x <= this.player.position.x) {
                    if (this.position.x < this.player.position.x - 300) {
                        this.eMoveLeft = false;
                        this.eMoveRight = true;
                    }
                    else if (this.position.x > this.player.position.x - 200) {
                        this.eMoveLeft = true;
                        this.eMoveRight = false;
                    }
                    else {
                        this.eMoveLeft = false;
                        this.eMoveRight = true;
                    }
                }
                else {
                    if (this.position.x > this.player.position.x + 300) {
                        this.eMoveLeft = true;
                        this.eMoveRight = false;
                    }
                    else if (this.position.x < this.player.position.x + 200) {
                        this.eMoveLeft = false;
                        this.eMoveRight = true;
                    }
                    else {
                        this.eMoveLeft = true;
                        this.eMoveRight = false;
                    }
                }
                if (this.position.y <= this.player.position.y) {
                    if (this.position.y < this.player.position.y - 300) {
                        this.eMoveUp = false;
                        this.eMoveDown = true;
                    }
                    else if (this.position.y > this.player.position.y - 200) {
                        this.eMoveUp = true;
                        this.eMoveDown = false;
                    }
                    else {
                        this.eMoveUp = false;
                        this.eMoveDown = true;
                    }
                }
                else {
                    if (this.position.y > this.player.position.y + 300) {
                        this.eMoveUp = true;
                        this.eMoveDown = false;
                    }
                    else if (this.position.y < this.player.position.y + 200) {
                        this.eMoveUp = false;
                        this.eMoveDown = true;
                    }
                    else {
                        this.eMoveUp = true;
                        this.eMoveDown = false;
                    }
                }
            }
            //else if (this.eType == this.enemyTypeEnum.RAPID)
            //{
            //}
            //else if (this.eType == this.enemyTypeEnum.LASER)
            //{
            //}
            //else
            //{
            //}
            //}
        }
    };
    Enemy.prototype.eUpdate = function (time) {
        if (this.alive) {
            this.eVelocityX = 0;
            this.eVelocityY = 0;
            if (this.game.time.now > this.fireTimer) {
                if (this.eType == this.enemyTypeEnum.BASE) {
                    this.fireTimer = this.game.time.now + 2000;
                }
                else if (this.eType == this.enemyTypeEnum.RAPID) {
                    this.fireTimer = this.game.time.now + 700;
                }
                else if (this.eType == this.enemyTypeEnum.LASER) {
                    this.fireTimer = this.game.time.now + 100;
                }
                else {
                    this.fireTimer = this.game.time.now + 4000;
                }
                this.eAim = true;
            }
            if (this.eAim) {
                this.aim = true;
            }
            this.weapon.trackSprite(this, 0, 0);
            this.weapon.fireAngle = 0;
            this.ePathfinding(this.fireTimer - this.game.time.now);
            if ((this.eMoveUp || this.eMoveDown) && (this.eMoveLeft || this.eMoveRight) && !((this.eMoveUp && this.eMoveDown) || (this.eMoveLeft && this.eMoveRight))) {
                if (this.eMoveUp) {
                    this.eVelocityY -= Math.sqrt(Math.pow(this.eSpeed, 2) / 2);
                }
                else {
                    this.eVelocityY += Math.sqrt(Math.pow(this.eSpeed, 2) / 2);
                }
                if (this.eMoveLeft) {
                    this.eVelocityX -= Math.sqrt(Math.pow(this.eSpeed, 2) / 2);
                }
                else {
                    this.eVelocityX += Math.sqrt(Math.pow(this.eSpeed, 2) / 2);
                }
            }
            else {
                if (this.eMoveUp) {
                    this.eVelocityY -= this.eSpeed;
                }
                if (this.eMoveDown) {
                    this.eVelocityY += this.eSpeed;
                }
                if (this.eMoveLeft) {
                    this.eVelocityX -= this.eSpeed;
                }
                if (this.eMoveRight) {
                    this.eVelocityX += this.eSpeed;
                }
            }
            if (this.aim) {
                var fireDegree = this.game.physics.arcade.angleBetween(this, this.player);
                fireDegree = fireDegree * 57.2958;
                this.weapon.fireAngle = fireDegree;
                if (this.eType = this.enemyTypeEnum.SHOTGUN) {
                    this.weapon.fire();
                    this.weapon.fireAngle -= 30;
                    this.weapon.fire();
                    this.weapon.fireAngle += 15;
                    this.weapon.fire();
                    this.weapon.fireAngle += 30;
                    this.weapon.fire();
                    this.weapon.fireAngle += 15;
                    this.weapon.fire();
                }
                else {
                    this.weapon.fire();
                }
                this.eAim = false;
            }
            this.body.velocity.y = this.eVelocityY * time;
            this.body.velocity.x = this.eVelocityX * time;
            this.aim = false;
        }
    };
    return Enemy;
}(Phaser.Sprite // -----------------------------------------------------Enemy code
));
//# sourceMappingURL=app.js.map