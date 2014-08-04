// Note: I am going to try and pseudocode from scratch and compare to my code here next week.  Sorry, I didn't do this first I got a little carried away.  I was just excited to make my first OOP!

// Your mission description:

// Pseudocode

// Initial Code

// Refactored Code

// Reflection


$(document).ready(function(){
	var navKeys = {
		u: false,
		r: false,
		d: false,
		l: false
	};
	var TIME_CYCLE = 33;
	var timing = function(){
		for(key in navKeys) {
			if(navKeys[key]) map.ship.accelerate(key);
		}
		map.ship.move();
		for (id in map.weaponBlasts.list) {
			map.weaponBlasts.list[id].move(map);
		}
		for (id in map.asteroids.list) {
			map.asteroids.list[id].move();
		}
		map.collisionTest();
	};
	var map = new Map();
	$('#MessageBoard').html(map.messageBoard.start);
	$('#start').click(function(){
		$('#MessageBoard').css('left','-9999em');
		map.initializeLevel();
		timingFunction = window.setInterval(timing, TIME_CYCLE);

		$(document).keydown(function(e){
			switch (e.which) {
				case 37: //left arrow
					//map.ship.accelerate('l');
					setNavKeys('l',true);
					e.preventDefault();
					break;
				case 38: //up arrow
					//map.ship.accelerate('u');
					setNavKeys('u',true);
					e.preventDefault();
					break;
				case 39: //right arrow
					//map.ship.accelerate('r');
					setNavKeys('r',true);
					e.preventDefault();
					break;
				case 40: //down arrow
					//map.ship.accelerate('d');
					setNavKeys('d',true);
					e.preventDefault();
					break;
				case 32: //space bar
					map.ship.fire(map);
					e.preventDefault();
					break;
			}
		});
		$(document).keyup(function(e){
			switch (e.which) {
				case 37: //left arrow
					//map.ship.accelerate('l');
					setNavKeys('l',false);
					e.preventDefault();
					break;
				case 38: //up arrow
					//map.ship.accelerate('u');
					setNavKeys('u',false);
					e.preventDefault();
					break;
				case 39: //right arrow
					//map.ship.accelerate('r');
					setNavKeys('r',false);
					e.preventDefault();
					break;
				case 40: //down arrow
					//map.ship.accelerate('d');
					setNavKeys('d',false);
					e.preventDefault();
					break;
				case 32: //space bar
					map.ship.fire(map);
					e.preventDefault();
					break;
			}
		});
		function setNavKeys(key,keyDown) {
			for(k in navKeys) {
				navKeys[k] = false;
			}
			if(keyDown) navKeys[key] = true;
		}
		$('#Pause').click(function(){ 
			$('#Play').removeClass('active');
			window.clearInterval(timingFunction); 
		});
		$('#Play').click(function(){ 
			if(!$(this).hasClass('active')) {
				$(this).addClass('active');
				timingFunction = window.setInterval(timing, TIME_CYCLE);
			}
		 });
		$('#Restart').click(function(){ 
			$('#Play').removeClass('active');
			map.restart(); 
			window.clearInterval(timingFunction); 
			timingFunction = window.setInterval(timing, TIME_CYCLE);
		});
		$(document).on('click','#close',function(){
			$('#MessageBoard').css('left','-9999em');
			timingFunction = window.setInterval(timing, TIME_CYCLE);
		});
	});
});