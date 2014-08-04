//I am going to try and pseudocode from scratch and compare to my code here next week.  Sorry I didn't do this first I got a little carried away.  I was just excited to make my first OOP!

$(document).ready(function(){
	var map = new Map();
	$('#MessageBoard').html(map.messageBoard.start);
	$('#start').click(function(){
		$('#MessageBoard').css('left','-9999em');
		map.initializeLevel();
		timingFunction = window.setInterval(function(){
			map.ship.move();
			for (id in map.weaponBlasts.list) {
				map.weaponBlasts.list[id].move(map);
			}
			for (id in map.asteroids.list) {
				map.asteroids.list[id].move();
			}
			map.collisionTest();
		}, 33);

		$(document).keydown(function(e){
			switch (e.which) {
				case 37: //left arrow
					map.ship.accelerate('l');
					e.preventDefault();
					break;
				case 38: //up arrow
					map.ship.accelerate('u');
					e.preventDefault();
					break;
				case 39: //right arrow
					map.ship.accelerate('r');
					e.preventDefault();
					break;
				case 40: //down arrow
					map.ship.accelerate('d');
					e.preventDefault();
					break;
				case 32: //space bar
					map.ship.fire(map);
					e.preventDefault();
					break;
			}
		});
		$('#Pause').click(function(){ 
			$('#Play').removeClass('active');
			window.clearInterval(timingFunction); 
		});
		$('#Play').click(function(){ 
			if(!$(this).hasClass('active')) {
				$(this).addClass('active');
				timingFunction = window.setInterval(function(){
					map.ship.move();
					for (id in map.weaponBlasts.list) {
						map.weaponBlasts.list[id].move(map);
					}
					for (id in map.asteroids.list) {
						map.asteroids.list[id].move();
					}
					map.collisionTest();
				}, 33);
			}
		 });
		$('#Restart').click(function(){ 
			$('#Play').removeClass('active');
			map.restart(); 
			window.clearInterval(timingFunction); 
			timingFunction = window.setInterval(function(){
				map.ship.move();
				for (id in map.weaponBlasts.list) {
					map.weaponBlasts.list[id].move(map);
				}
				for (id in map.asteroids.list) {
					map.asteroids.list[id].move();
				}
				map.collisionTest();
			}, 33);
		});
	});
});