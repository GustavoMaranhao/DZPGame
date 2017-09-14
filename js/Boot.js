/*
	File where the assets for the loading screen are loaded ,
	a few level configurations are made and start the Preload state
*/

//If DZPGame exists use it, if it doesn’t exist initiate it as an empty object	
var DZPGame = DZPGame || {};

//Overriding the original function
DZPGame.Boot = function(){};

//Set the game configuration and load assets for the loading screen
DZPGame.Boot.prototype = {
	preload: function(){
		//Preload the assets that will be used
		this.load.image('preloadbar', 'assets/images/preloader-bar.png');
	},
	create: function(){
		//Loading screen with a black background
		this.game.stage.background = '#000';
		
		//Scaling options
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		
		//Center the map horizontally
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		
		//Start the physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//Start the next state
		this.state.start('Preload');
	}
}