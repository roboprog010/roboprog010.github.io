var MAP_SIZE = 500;
var SPACE_SHIP_SIZE = 20;
var ASTEROID_SIZE = 20;
var WEAPON_BLAST_SIZE = 5;
var ASTEROID_POPULATION_SIZE = 8;
var ASTEROID_WAVES = 4;

function Map() {
	this.width = MAP_SIZE;
	this.height = MAP_SIZE;
	this.level = 0;
	this.score = 0;
	this.totalAsteroidsThisLevel = 0;
	this.currentAsteroidCount = 0;
	this.ship = new SpaceShip();
	this.pauseValues = {};
	this.weaponBlasts = {
		counter: 0,
		list: {}
	};
	this.asteroids = {
		counter: 0,
		list: {}
	};
	this.messageBoard = {
		start: '<h1>This webpage has been <em>invaided</em> by asteroids! Be a true Web Dev Hero and <em>destroy</em> those '+
				'asteroids with your PULSE CANON!</h1><h1>User your arrow keys to navigate and the space bar to FIRE!</h1>'+
				'<h1 id="start">Start</h1>',
		end: '<h1>Good Job!<br>Your Final Score is:<br><span id="final_score">0</span></h1><h1 id="close">Close</h1>'
	};
}
Map.prototype.increaseScore = function() {
	this.score += this.level;
	$('#Score').text('Score: ' + this.score);
};
Map.prototype.repopulateAsteroids = function(asteroids) {
	if (this.totalAsteroidsThisLevel < ASTEROID_POPULATION_SIZE * ASTEROID_WAVES) {
		this.totalAsteroidsThisLevel++;
		this.asteroids.list['a' + this.totalAsteroidsThisLevel] = new Asteroid('a' + this.totalAsteroidsThisLevel, this.level);
	}
	else this.initializeLevel();
};
Map.prototype.initializeLevel = function() {
	for (wbId in this.weaponBlasts.list) {
		$('#'+wbId).remove();
	}
	for (aId in this.asteroids.list) {
		$('#'+aId).remove();
	}
	this.ship.initialize();
	this.level++;
	$('#Level').text('Level: ' + this.level);
	$('#Score').text('Score: ' + this.score);
	this.totalAsteroidsThisLevel = 0;
	this.currentAsteroidCount = 0;
	this.weaponBlasts.counter = 0;
	this.weaponBlasts.list = {};
	this.asteroids.counter = 0;
	this.asteroids.list = {};
	this.pauseValues = {};
	for(var i = 0; i < ASTEROID_POPULATION_SIZE; i++) {
		this.totalAsteroidsThisLevel++;
		this.asteroids.list['a' + this.totalAsteroidsThisLevel] = new Asteroid('a' + this.totalAsteroidsThisLevel, this.level);
	}
}
Map.prototype.collisionTest = function() {
	var collisionFound = false;
	ssXMin = this.ship.position.x;
	ssXMax = this.ship.position.x + SPACE_SHIP_SIZE;
	ssYMin = this.ship.position.y;
	ssYMax = this.ship.position.y + SPACE_SHIP_SIZE;
	for (aId in this.asteroids.list) {
		aXMin = this.asteroids.list[aId].position.x;
		aXMax = this.asteroids.list[aId].position.x + ASTEROID_SIZE;
		aYMin = this.asteroids.list[aId].position.y;
		aYMax = this.asteroids.list[aId].position.y + ASTEROID_SIZE;
		if (!(ssXMax < aXMin || aXMax < ssXMin || ssYMax < aYMin || aYMax < ssYMin)) {
			this.level = 0;
			this.score = 0;
			this.initializeLevel();
			collisionFound = true;
			break;
		}
	}
	collisionLoop: for (wbId in this.weaponBlasts.list) {
		for (aId in this.asteroids.list) {
			wbXMin = this.weaponBlasts.list[wbId].position.x;
			wbXMax = this.weaponBlasts.list[wbId].position.x + WEAPON_BLAST_SIZE;
			wbYMin = this.weaponBlasts.list[wbId].position.y;
			wbYMax = this.weaponBlasts.list[wbId].position.y + WEAPON_BLAST_SIZE;
			aXMin = this.asteroids.list[aId].position.x;
			aXMax = this.asteroids.list[aId].position.x + ASTEROID_SIZE;
			aYMin = this.asteroids.list[aId].position.y;
			aYMax = this.asteroids.list[aId].position.y + ASTEROID_SIZE;
			if (!(wbXMax < aXMin || aXMax < wbXMin || wbYMax < aYMin || aYMax < wbYMin)) {
				this.weaponBlasts.list[wbId].evaporate(this);
				this.asteroids.list[aId].evaporate(this);
				this.currentAsteroidCount--;
				this.repopulateAsteroids();
				this.increaseScore();
				collisionFound = true;
				break collisionLoop;
			}
		}
	}
	if (collisionFound) {
		$('#MessageBoard').html(this.messageBoard.end).css('left','50px');
	}
}
Map.prototype.restart = function() {
	this.level = 0;
	this.score = 0;
	this.initializeLevel();
}

function SpaceShip() {
	this.acceleration = 1; //increase speed by 1px per second
	this.fireRate = 1; //fire one shot per second
	this.size = SPACE_SHIP_SIZE; //h: 20px, w: 20px
	this.horizontalSpeed = 0; //pixels per second
	this.verticalSpeed = 0; //pixels per second
	this.position = { x: MAP_SIZE / 2 - SPACE_SHIP_SIZE / 2, y: MAP_SIZE / 2 - SPACE_SHIP_SIZE / 2 }; //center SpaceShip
	this.weapons = 0; //0 of 3
	this.shields = 0; //0 of 100
	$('#SpaceShip').css({left: this.position.x + 'px', top: this.position.y + 'px'}); //place SpaceShip on Map
}
SpaceShip.prototype.initialize = function() {
	this.horizontalSpeed = 0;
	this.verticalSpeed = 0;
	this.position = { x: MAP_SIZE / 2 - SPACE_SHIP_SIZE / 2, y: MAP_SIZE / 2 - SPACE_SHIP_SIZE / 2 };
	this.weapons = 0;
	this.shields = 0;
	$('#SpaceShip').css({left: this.position.x + 'px', top: this.position.y + 'px'});
};
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
SpaceShip.prototype.fire = function(map) {
	map.weaponBlasts.counter++;
	map.weaponBlasts.list['wb' + map.weaponBlasts.counter] = new WeaponBlast('wb' + map.weaponBlasts.counter, { x: this.position.x, y: this.position.y }, this.verticalSpeed);
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
WeaponBlast.prototype.move = function(map) {
	this.position.y += this.verticalSpeed;
	if (this.position.y < 0 - WEAPON_BLAST_SIZE) this.evaporate(map);
	$('#' + this.id).css({top: this.position.y + 'px'});
}
WeaponBlast.prototype.evaporate = function(map) {
	$('#' + this.id).remove();
	delete map.weaponBlasts.list[this.id];
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
Asteroid.prototype.evaporate = function(map) {
	$('#' + this.id).remove();
	delete map.asteroids.list[this.id];
}