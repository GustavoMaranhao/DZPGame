/*
	File where the assets for the first level are loaded and start the game
*/

//If DZPGame exists use it, if it doesn’t exist initiate it as an empty object	
var DZPGame = DZPGame || {};

//Overriding the original function
DZPGame.Preload = function(){};

//Show the loading screen and load assets for the actual level
DZPGame.Preload.prototype = {
	preload: function() {
		//Show the loading screen
		this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
		this.preloadBar.anchor.setTo(0.5);
		
		//Make it act like a loading bar
		this.load.setPreloadSprite(this.preloadBar);
		
		//Load game assets
		this.load.tilemap('level1', 'assets/tilemaps/ShipMap.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('shipTiles', 'assets/images/ShipTileset.gif');
		this.load.image('ropePiece', 'assets/images/ropePiece.png');
		//Placeholder assets
		this.load.image('player', 'assets/player.png');		
	},
	create: function() {
		//Start the next state
		this.state.start('Game');
	}
}