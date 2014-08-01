$(document).ready(function(){
	var map = new Map();
	var ship = new SpaceShip();
	var weaponBlasts = {
		counter: 0,
		list: {}
	};
	var asteroids = {
		counter: 0,
		list: {}
	};

	for(var i = 0; i < 8; i++) {
		asteroids.counter++;
		asteroids.list['a' + asteroids.counter] = new Asteroid('a' + asteroids.counter, map.level);
	}

	window.setInterval(function(){
		ship.move();
		for (id in weaponBlasts.list) {
			weaponBlasts.list[id].move(weaponBlasts);
		}
		for (id in asteroids.list) {
			asteroids.list[id].move();
		}
		collision_test(ship, weaponBlasts, asteroids, WEAPON_BLAST_SIZE, ASTEROID_SIZE, map);
	}, 33);

	$(document).keydown(function(e){
		switch (e.which) {
			case 37: //left arrow
				ship.accelerate('l');
				e.preventDefault();
				break;
			case 38: //up arrow
				ship.accelerate('u');
				e.preventDefault();
				break;
			case 39: //right arrow
				ship.accelerate('r');
				e.preventDefault();
				break;
			case 40: //down arrow
				ship.accelerate('d');
				e.preventDefault();
				break;
			case 32: //space bar
				ship.fire(weaponBlasts);
				e.preventDefault();
				break;
		}
	});

	function collision_test(ship, weaponBlasts, asteroids, WEAPON_BLAST_SIZE, ASTEROID_SIZE, map) {
		collisionLoop: for (wbId in weaponBlasts.list) {
			for (aId in asteroids.list) {
				wbXMin = weaponBlasts.list[wbId].position.x;
				wbXMax = weaponBlasts.list[wbId].position.x + WEAPON_BLAST_SIZE;
				wbYMin = weaponBlasts.list[wbId].position.y;
				wbYMax = weaponBlasts.list[wbId].position.y + WEAPON_BLAST_SIZE;
				aXMin = asteroids.list[aId].position.x;
				aXMax = asteroids.list[aId].position.x + ASTEROID_SIZE;
				aYMin = asteroids.list[aId].position.y;
				aYMax = asteroids.list[aId].position.y + ASTEROID_SIZE;
				if (!(wbXMax < aXMin || aXMax < wbXMin || wbYMax < aYMin || aYMax < wbYMin)) {
					weaponBlasts.list[wbId].evaporate(weaponBlasts);
					asteroids.list[aId].evaporate(asteroids);
					map.increaseScore();
					break collisionLoop;
				}
			}
		}
	}
});