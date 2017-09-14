/*
	File with the core mechanics of the first level of the game
*/

//If DZPGame exists use it, if it doesn’t exist initiate it as an empty object	
var DZPGame = DZPGame || {};

//Overriding the original function
DZPGame.Game = function(){};

//Core game mechanics
DZPGame.Game.prototype = {	
	//Show the assets of the level
	create: function(){
		//Set the variables
		this.playerBaseSpeed = 100;
		
		//Fix for choppy player movement
		this.game.renderer.renderSession.roundPixels = true;
		
		//Create a tilemap for the ship
		this.map = this.game.add.tilemap('level1');
		
		//The first parameter is the tileset name in Tiled, the second is the key to the asset
		this.map.addTilesetImage('ShipBackground', 'shipTiles');
		
		//Create the tileset layers
		this.oceanLayer = this.map.createLayer('Ocean');
		this.backgroundLayer = this.map.createLayer('ShipMedium');
		this.blockedLayer = this.map.createLayer('ShipMediumBlocked');
		
		//Set the collision on the blocked layer
		//The .psd file has 1600x1600 pixels, so the last tile should be (50,50) => Tile 2500
		//Collide only with the tile bellow the ocean tile
		this.map.setCollisionByExclusion([76], true, this.blockedLayer);
		
		//Resize the world map to match the layer dimensions
		this.backgroundLayer.resizeWorld();
		
		//Create the sprites from the Tiled object layer
		this.createItens();
		
		//Create the player on top of the other sprites
		this.spawnPlayer();
	},
	
	//Main game Loop
	update: function(){		
		//Increase speed if the player is sprinting
		if (this.isSprinting.isDown){
			playerSpeed = this.playerBaseSpeed * 2;
		} else {
			playerSpeed = this.playerBaseSpeed;
		}
		
		//Reset player movement in the frame
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
		
		//Capture the player's intention
		if (this.cursors.up.isDown || this.cursorsAlternative.up.isDown) {
			this.player.body.velocity.y -= playerSpeed;
		}
		if (this.cursors.down.isDown || this.cursorsAlternative.down.isDown) {
			this.player.body.velocity.y += playerSpeed;
		}
		if (this.cursors.left.isDown || this.cursorsAlternative.left.isDown) {
			this.player.body.velocity.x -= playerSpeed;
		}
		if (this.cursors.right.isDown || this.cursorsAlternative.right.isDown) {
			this.player.body.velocity.x += playerSpeed;
		}
		
		//Check for collision
		this.game.physics.arcade.collide(this.player, this.blockedLayer);
		this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this); //Object1, Object2, CallbackFunction, AllowCallbackCall, Context
	},
	
	collect: function(player, collectable){
		console.log('Found a puzzle piece!');
		
		//Remove the collectable
		collectable.destroy();
	},
	
	//Create the player and its characteristics
	spawnPlayer: function(){
		//Get the player initial location from Tiled
		var result = this.findObjectsByType('playerStart', this.map, 'ShipMediumObjects');
		
		//Assuming only one result
		this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
		this.game.physics.arcade.enable(this.player);
		this.player.body.setSize(32, 32, -8, -8);
		
		//Make the camera follow the player
		this.game.camera.follow(this.player);
		
		//Enable player controls with arrows (Phaser default) or WASD
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.cursorsAlternative = {	
									   up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
									 down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
									 left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
									right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
								  };
								  
		//Enable other keys
		this.isSprinting = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
	},
	
	//Create the items that will be used in the game
	createItens: function(){
		//Create a group to keep the collectible items
		this.items = this.game.add.group();
		this.items.enableBody = true;
		
		//Find all objects of this group type and create them
		var item;
		result = this.findObjectsByType('puzzlePiece',this.map,'ShipMediumObjects');
		result.forEach(function(element){
			this.createFromTiledObject(element, this.items);
		}, this);		
	},
	
	//Find objects in a Tiled layer that containt a property called "type" equal to a certain value passed to the function
	findObjectsByType: function(type, map, layer) {
	var result = new Array();	
	//Loop through all the elements in the object layer adding them to an array
	map.objects[layer].forEach(function(element){
	  if(element.properties.type === type) {
		//Phaser uses top left, Tiled bottom left so we have to adjust the y position
		element.y -= map.tileHeight;
		result.push(element);
	  }      
	});
	
	return result;
	},
	
	//Create a sprite from an object
	createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);	
      //Copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
	}
}
