var MAP_SIZE = 500;
var SPACE_SHIP_SIZE = 20;
var ASTEROID_SIZE = 20;
var WEAPON_BLAST_SIZE = 5;
var ASTEROID_POPULATION_SIZE = 8;
var ASTEROID_WAVES = 4;

function Map() {
	this.width = MAP_SIZE;
	this.height = MAP_SIZE;
	this.level = 1;
	this.score = 0;
	this.totalAsteroidsThisLevel = 0;
	this.currentAsteroidCount = 0;
}
Map.prototype.dimensions = function() {
	return {w: this.width, h: this.height};
};
Map.prototype.increaseScore = function() {
	this.score += this.level;
	$('#Score').text('Score: ' + this.score);
};
Map.prototype.repopulateAsteroids = function(asteroids) {
	if (this.totalAsteroidsThisLevel < ASTEROID_POPULATION_SIZE * ASTEROID_WAVES) {
		//add asteroid
	}
	else this.nextLevel();
};
Map.prototype.nextLevel = function(asteroids) {

};

function SpaceShip() {
	this.acceleration = 1; //increase speed by 1px per second
	this.fireRate = 1; //fire one shot per second
	this.horizontalSpeed = 0; //pixels per second
	this.verticalSpeed = 0; //pixels per second
	this.position = { x: MAP_SIZE / 2 - SPACE_SHIP_SIZE / 2, y: MAP_SIZE / 2 - SPACE_SHIP_SIZE / 2 }; //center SpaceShip
	this.weapons = 0; //0 of 3
	this.shields = 0; //0 of 100
	this.size = SPACE_SHIP_SIZE; //h: 20px, w: 20px
	$('#SpaceShip').css({left: this.position.x + 'px', top: this.position.y + 'px'}); //place SpaceShip on Map
}
SpaceShip.prototype.move = function() {
	this.position.x += this.horizontalSpeed;
	if (this.position.x > MAP_SIZE) this.position.x = 0;
	else if (this.position.x < 0 - SPACE_SHIP_SIZE) this.position.x = MAP_SIZE;
	this.position.y += this.verticalSpeed;
	if (this.position.y > MAP_SIZE) this.position.y = 0;
	else if (this.position.y < 0 - SPACE_SHIP_SIZE) this.position.y = MAP_SIZE;
	$('#SpaceShip').css({left: this.position.x + 'px', top: this.position.y + 'px'});
};
SpaceShip.prototype.accelerate = function(type) {
	switch (type) {
		case 'u':
			this.verticalSpeed -= this.acceleration;
			break;
		case 'd':
			this.verticalSpeed += this.acceleration;
			break;
		case 'l':
			this.horizontalSpeed -= this.acceleration;
			break;
		case 'r':
			this.horizontalSpeed += this.acceleration;
			break;
	}
};
SpaceShip.prototype.fire = function(weaponBlasts) {
	weaponBlasts.counter++;
	weaponBlasts.list['wb' + weaponBlasts.counter] = new WeaponBlast('wb' + weaponBlasts.counter, { x: this.position.x, y: this.position.y }, this.verticalSpeed);
};
SpaceShip.prototype.upgradeWeapons = function() {
	if (this.weapons < 3) this.weapons++;
};
SpaceShip.prototype.upgradeShields = function() {
	if (this.shields < 100) this.shields += 33;
};

function WeaponBlast(wbId, position, verticalSpeed) {
	this.id = wbId;
	this.position = { x: position.x + WEAPON_BLAST_SIZE / 2, y: position.y }; //center WeaponBlast on SpaceShip Top
	this.size = WEAPON_BLAST_SIZE;
	if (verticalSpeed > 0) verticalSpeed = 0;
	this.verticalSpeed = verticalSpeed - 2;
	$('#Map').append('<div class="WeaponBlast" id="'+wbId+'"></div>');
	$('#'+wbId).css({left: this.position.x + 'px', top: this.position.y + 'px'});
}
WeaponBlast.prototype.move = function(weaponBlasts) {
	this.position.y += this.verticalSpeed;
	if (this.position.y < 0 - WEAPON_BLAST_SIZE) this.evaporate(weaponBlasts);
	$('#' + this.id).css({top: this.position.y + 'px'});
}
WeaponBlast.prototype.evaporate = function(weaponBlasts) {
	$('#' + this.id).remove();
	delete weaponBlasts.list[this.id];
}

function Asteroid(aId, level) {
	this.id = aId;
	var rand = Math.random();
	var xPos = yPos = 0;
	if (rand < 0.249) { //top of stage
		yPos = -ASTEROID_SIZE;
		xPos = Math.random() * MAP_SIZE;
	}
	else if (rand < 0.499) { //right of stage
		yPos = Math.random() * MAP_SIZE;
		xPos = MAP_SIZE;
	}
	else if (rand < 0.749) { //bottom of stage
		yPos = MAP_SIZE;
		xPos = Math.random() * MAP_SIZE;
	}
	else { //left of stage
		yPos = Math.random() * MAP_SIZE;
		xPos = -ASTEROID_SIZE;
	}
	this.position = { x: xPos, y: yPos };
	this.size = ASTEROID_SIZE;
	this.verticalSpeed = Math.random() > 0.5 ? level : -level;
	this.horizontalSpeed = Math.random() > 0.5 ? level : -level;
	$('#Map').append('<div class="Asteroid" id="' + aId + '"></div>');
}
Asteroid.prototype.move = function() {
	this.position.x += this.horizontalSpeed;
	if (this.position.x > MAP_SIZE) this.position.x = 0;
	else if (this.position.x < 0 - ASTEROID_SIZE) this.position.x = MAP_SIZE;
	this.position.y += this.verticalSpeed;
	if (this.position.y > MAP_SIZE) this.position.y = 0;
	else if (this.position.y < 0 - ASTEROID_SIZE) this.position.y = MAP_SIZE;
	$('#' + this.id).css({left: this.position.x + 'px', top: this.position.y + 'px'});
};
Asteroid.prototype.evaporate = function(asteroids) {
	$('#' + this.id).remove();
	delete asteroids.list[this.id];
}