
	var settings = Array("Turn Speed", "Acceleration", "Max Speed",
				         "Bullet Speed", "Special Ability Strength");

	var settings_div = document.createElement('div');
	settings_div.id = "settings_div";
	
	var num_ships = 0;

	function getSetting(player_num, setting_name)
	{
		try
		{
			return document.getElementById(player_num+"_"+setting_name).value;
		}
		catch(err)
		{
		  txt="There was an error on this page.\n\n";
		  txt+="Error description: " + err.message + "\n\n";
		  txt+="Did you request a player number that does not exists or did you request";
		  txt+="a setting that does not exist yet?!";
		  alert(txt);
		}
	}

	function valueChanged(value, id) {
		document.getElementById(id + '_txt').innerHTML = value;
	}

	function initSettings() {
		num_ships = document.getElementById('num_ships').value;
		// remove welcome 
		var welcome = document.getElementById('greeting');
		document.body.removeChild(welcome)

		for ( var x = 0; x < num_ships; x++) {
			var sub_container = document.createElement('div');
			sub_container.className = "container";
			sub_container.id = x;

			var header = document.createElement('h2');
			var num = x + 1
			header.innerHTML = "Player " + num;
			sub_container.appendChild(header);

			_addSettings(sub_container, x);
			
			settings_div.appendChild(sub_container);
		}
		
		document.body.appendChild(settings_div);		

		// play section 
		var sub_container = document.createElement('div');
		sub_container.className = "container";
		
		// button here!
		var play = document.createElement('button');
		play.onclick = initCanvas;
		play.innerHTML = "Play >";
		sub_container.appendChild(play);
		settings_div.appendChild(sub_container);
	}	

	function _addSettings(container, num) {

		for ( var x = 0; x < settings.length; x++) {
			// column one 
			var name_txt = document.createElement('p');
			name_txt.innerHTML = settings[x];
			var c1 = document.createElement('td');
			c1.appendChild(name_txt);
			// column two 
			var input_range = document.createElement('input');
			input_range.id = num + "_" + settings[x];
			input_range.type = "range";
			input_range.min = 1;
			input_range.max = 10;
			input_range.value = 5;
			input_range.onchange = function() 
											{
												valueChanged(this.value, this.id);
											};
			var c2 = document.createElement('td');
			c2.appendChild(input_range);
			// column three
			var value_txt = document.createElement('p');
			value_txt.innerHTML = 5;
			value_txt.id = num + "_" + settings[x] + '_txt'
			var c3 = document.createElement('td');
			c3.appendChild(value_txt);
			// add columns to row
			var row = document.createElement('tr');
			row.appendChild(c1);
			row.appendChild(c2);
			row.appendChild(c3);
			// add row to table 
			container.appendChild(row);
		}
	}	

	function initCanvas(){
		// hide settings div
		var settings_div = document.getElementById('settings_div');
		settings_div.style.display="none";
		// create canvas
		var canvas = document.createElement('canvas');
	    canvas.id = "myCanvas";
		// resize the canvas to fill browser window dynamically
		window.addEventListener('resize', resizeCanvas, false);
		
		function resizeCanvas() {
				canvas.width = window.innerWidth-25;
				canvas.height = window.innerHeight-60;
		}
		resizeCanvas();
		//canvas.width = 1200;
		//canvas.height = 900;
		canvas.className = "canvas_style";
		document.body.appendChild(canvas);
		startGame(num_ships);
	}
