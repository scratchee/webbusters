"use strict";


var workerTimeMeasure = Date;


function startGame(numPlayers)
{
	ctx = document.getElementById("myCanvas").getContext("2d");
	
	canvasRight = document.getElementById("myCanvas").width;
	canvasBottom = document.getElementById("myCanvas").height;

	worker = new Worker("game-worker.js");
	
	worker.onerror = function(event)
	{
		throw new Error(event.message + " (" + event.filename + ":" + event.lineno + ")");
	};
	
	configObj.numPlayers = numPlayers;
	configObj.canvasRight = canvasRight;
	configObj.canvasBottom = canvasBottom;
	
	configObj.playerSettings = new Array(numPlayers);
	
	keyPressArray = new Array(numPlayers);
	
	for(var i = 0 ; i < numPlayers ; i++)
	{
		configObj.playerSettings[i] = new Object();
		configObj.playerSettings[i].Acceleration = getSetting(i, "Acceleration");
		configObj.playerSettings[i].MaxSpeed = getSetting(i, "Max Speed");
		configObj.playerSettings[i].TurnSpeed = getSetting(i, "Turn Speed");
		configObj.playerSettings[i].BulletSpeed = getSetting(i, "Bullet Speed");
		configObj.playerSettings[i].SpecialAbilityStrength = getSetting(i, "Special Ability Strength");
		
		keyPressArray[i] = new Object();
		keyPressArray[i].forwards = false;
		keyPressArray[i].back = false;
		keyPressArray[i].left = false;
		keyPressArray[i].right = false;
		keyPressArray[i].fire = false;
		
		
	}
	
	
	var startObjStr = JSON.stringify(configObj);
	
	worker.postMessage("start|" + startObjStr);
	
	worker.onmessage = 
	function(event) 
	{
		var messageArray = event.data.split("|");
		
		var messageTitle = messageArray[0];
		var messageBody = messageArray[1];
		
		switch(messageTitle)
		{
			case "drawList":
				drawArrays(messageBody);
				break;
			case "workerTime":
				if(messageBody == "performance")
					workerTimeMeasure = performance;
				break;
			case "console.log":
				if(lastConsoleLogMessage != messageBody)
				{
					lastConsoleLogMessage = messageBody;
					console.log(messageBody);
				}
				break;
			case "network":
				console.log("Unimplemented");
				break;
			default:
				console.log("Unrecognised message!");
				break;
		}
	};
	
	window.requestAnimationFrame = requestAnimationFrame;
	
	
	myPeerID = document.createElement('input');
	myPeerID.id = "myPeerID";
	document.body.appendChild(myPeerID);
	
	otherPeerID = document.createElement('input');
	otherPeerID.id = "otherPeerID";
	document.body.appendChild(otherPeerID);
	
	
	myPeerID.onchange = announcePeer;
	
	otherPeerID.onchange = contactPeer;
	
	
	
	window.requestAnimationFrame(draw);
}





function keyDown(event)
{
	if(keyPressList[currentKeyPress] == null)
		keyPressList[currentKeyPress] = new Object();
	
	if(event.keyCode == 87 && keyPressArray[ownedShip].forwards != true)
	{
		keyPressArray[ownedShip].forwards = true;
		
		var keyPress = keyPressList[currentKeyPress];
		
		keyPress.shipNum = ownedShip;
		keyPress.time = workerTimeMeasure.now();
		keyPress.key = 0;
		keyPress.type = 1;
		
		currentKeyPress++;
	}
	if(event.keyCode == 83 && keyPressArray[ownedShip].back != true)
	{
		keyPressArray[ownedShip].back = true;
		
		var keyPress = keyPressList[currentKeyPress];
		
		keyPress.shipNum = ownedShip;
		keyPress.time = workerTimeMeasure.now();
		keyPress.key = 2;
		keyPress.type = 1;
		
		currentKeyPress++;
	}
	if(event.keyCode == 65 && keyPressArray[ownedShip].left != true)
	{
		keyPressArray[ownedShip].left = true;
		
		var keyPress = keyPressList[currentKeyPress];
		
		keyPress.shipNum = ownedShip;
		keyPress.time = workerTimeMeasure.now();
		keyPress.key = 3;
		keyPress.type = 1;
		
		currentKeyPress++;
	}
	if(event.keyCode == 68 && keyPressArray[ownedShip].right != true)
	{
		keyPressArray[ownedShip].right = true;
		
		var keyPress = keyPressList[currentKeyPress];
		
		keyPress.shipNum = ownedShip;
		keyPress.time = workerTimeMeasure.now();
		keyPress.key = 1;
		keyPress.type = 1;
		
		currentKeyPress++;
	}
	if(event.keyCode == 32 && keyPressArray[ownedShip].fire != true)
	{
		keyPressArray[ownedShip].fire = true;
		
		var keyPress = keyPressList[currentKeyPress];
		
		keyPress.shipNum = ownedShip;
		keyPress.time = workerTimeMeasure.now();
		keyPress.key = 4;
		keyPress.type = 1;
		
		currentKeyPress++;
	}
	
	if(!networked)
	{
		if(event.keyCode == 81 && keyPressArray[ownedShip].special != true)
		{
			keyPressArray[ownedShip].special = true;
			
			var keyPress = keyPressList[currentKeyPress];
			
			keyPress.shipNum = ownedShip;
			keyPress.time = workerTimeMeasure.now();
			keyPress.key = 5;
			keyPress.type = 1;
			
			currentKeyPress++;
		}
	}
	else
	{
		if(event.keyCode == 96 && keyPressArray[ownedShip].special != true)
		{
			keyPressArray[ownedShip].special = true;
			
			var keyPress = keyPressList[currentKeyPress];
			
			keyPress.shipNum = ownedShip;
			keyPress.time = workerTimeMeasure.now();
			keyPress.key = 5;
			keyPress.type = 1;
			
			currentKeyPress++;
		}
	}

	if(!networked)
	{
		if(event.keyCode == 38 && keyPressArray[1].forwards != true)
		{
			keyPressArray[1].forwards = true;
			
			var keyPress = keyPressList[currentKeyPress];
			
			keyPress.shipNum = 1;
			keyPress.time = workerTimeMeasure.now();
			keyPress.key = 0;
			keyPress.type = 1;
			
			currentKeyPress++;
		}
		if(event.keyCode == 40 && keyPressArray[1].back != true)
		{
			keyPressArray[1].back = true;
			
			var keyPress = keyPressList[currentKeyPress];
			
			keyPress.shipNum = 1;
			keyPress.time = workerTimeMeasure.now();
			keyPress.key = 2;
			keyPress.type = 1;
			
			currentKeyPress++;
		}
		if(event.keyCode == 37 && keyPressArray[1].left != true)
		{
			keyPressArray[1].left = true;
			
			var keyPress = keyPressList[currentKeyPress];
			
			keyPress.shipNum = 1;
			keyPress.time = workerTimeMeasure.now();
			keyPress.key = 3;
			keyPress.type = 1;
			
			currentKeyPress++;
		}
		if(event.keyCode == 39 && keyPressArray[1].right != true)
		{
			keyPressArray[1].right = true;
			
			var keyPress = keyPressList[currentKeyPress];
			
			keyPress.shipNum = 1;
			keyPress.time = workerTimeMeasure.now();
			keyPress.key = 1;
			keyPress.type = 1;
			
			currentKeyPress++;
		}
		if(event.keyCode == 96 && keyPressArray[1].fire != true)
		{
			keyPressArray[1].fire = true;
			
			var keyPress = keyPressList[currentKeyPress];
			
			keyPress.shipNum = 1;
			keyPress.time = workerTimeMeasure.now();
			keyPress.key = 4;
			keyPress.type = 1;
			
			currentKeyPress++;
		}
		if(event.keyCode == 97 && keyPressArray[1].special != true)
		{
			keyPressArray[1].special = true;
			
			var keyPress = keyPressList[currentKeyPress];
			
			keyPress.shipNum = 1;
			keyPress.time = workerTimeMeasure.now();
			keyPress.key = 5;
			keyPress.type = 1;
			
			currentKeyPress++;
		}
	}
}
function keyUp(event)
{
	if(event.keyCode == 87 && keyPressArray[ownedShip].forwards != false)
	{
		keyPressArray[ownedShip].forwards = false;
		
		var keyPress = keyPressList[currentKeyPress];
		
		keyPress.shipNum = ownedShip;
		keyPress.time = workerTimeMeasure.now();
		keyPress.key = 0;
		keyPress.type = 0;
		
		currentKeyPress++;
	}
	if(event.keyCode == 83 && keyPressArray[ownedShip].back != false)
	{
		keyPressArray[ownedShip].back = false;
		
		var keyPress = keyPressList[currentKeyPress];
		
		keyPress.shipNum = ownedShip;
		keyPress.time = workerTimeMeasure.now();
		keyPress.key = 2;
		keyPress.type = 0;
		
		currentKeyPress++;
	}
	if(event.keyCode == 65 && keyPressArray[ownedShip].left != false)
	{
		keyPressArray[ownedShip].left = false;
		
		var keyPress = keyPressList[currentKeyPress];
		
		keyPress.shipNum = ownedShip;
		keyPress.time = workerTimeMeasure.now();
		keyPress.key = 3;
		keyPress.type = 0;
		
		currentKeyPress++;
	}
	if(event.keyCode == 68 && keyPressArray[ownedShip].right != false)
	{
		keyPressArray[ownedShip].right = false;
		
		var keyPress = keyPressList[currentKeyPress];
		
		keyPress.shipNum = ownedShip;
		keyPress.time = workerTimeMeasure.now();
		keyPress.key = 1;
		keyPress.type = 0;
		
		currentKeyPress++;
	}
	if(event.keyCode == 32 && keyPressArray[ownedShip].fire != false)
	{
		keyPressArray[ownedShip].fire = false;
		
		var keyPress = keyPressList[currentKeyPress];
		
		keyPress.shipNum = ownedShip;
		keyPress.time = workerTimeMeasure.now();
		keyPress.key = 4;
		keyPress.type = 0;
		
		currentKeyPress++;
	}

	if(!networked)
	{
		if(event.keyCode == 81 && keyPressArray[ownedShip].special != false)
		{
			keyPressArray[ownedShip].special = false;
			
			var keyPress = keyPressList[currentKeyPress];
			
			keyPress.shipNum = ownedShip;
			keyPress.time = workerTimeMeasure.now();
			keyPress.key = 5;
			keyPress.type = 0;
			
			currentKeyPress++;
		}
	}
	else
	{
		if(event.keyCode == 96 && keyPressArray[ownedShip].special != false)
		{
			keyPressArray[ownedShip].special = false;
			
			var keyPress = keyPressList[currentKeyPress];
			
			keyPress.shipNum = ownedShip;
			keyPress.time = workerTimeMeasure.now();
			keyPress.key = 5;
			keyPress.type = 0;
			
			currentKeyPress++;
		}
	}
	
	if(!networked)
	{
		if(event.keyCode == 38 && keyPressArray[1].forwards != false)
		{
			keyPressArray[1].forwards = false;
			
			var keyPress = keyPressList[currentKeyPress];
			
			keyPress.shipNum = 1;
			keyPress.time = workerTimeMeasure.now();
			keyPress.key = 0;
			keyPress.type = 0;
			
			currentKeyPress++;
		}
		if(event.keyCode == 40 && keyPressArray[1].back != false)
		{
			keyPressArray[1].back = false;
			
			var keyPress = keyPressList[currentKeyPress];
			
			keyPress.shipNum = 1;
			keyPress.time = workerTimeMeasure.now();
			keyPress.key = 2;
			keyPress.type = 0;
			
			currentKeyPress++;
		}
		if(event.keyCode == 37 && keyPressArray[1].left != false)
		{
			keyPressArray[1].left = false;
			
			var keyPress = keyPressList[currentKeyPress];
			
			keyPress.shipNum = 1;
			keyPress.time = workerTimeMeasure.now();
			keyPress.key = 3;
			keyPress.type = 0;
			
			currentKeyPress++;
		}
		if(event.keyCode == 39 && keyPressArray[1].right != false)
		{
			keyPressArray[1].right = false;
			
			var keyPress = keyPressList[currentKeyPress];
			
			keyPress.shipNum = 1;
			keyPress.time = workerTimeMeasure.now();
			keyPress.key = 1;
			keyPress.type = 0;
			
			currentKeyPress++;
		}
		if(event.keyCode == 96 && keyPressArray[1].fire != false)
		{
			keyPressArray[1].fire = false;
			
			var keyPress = keyPressList[currentKeyPress];
			
			keyPress.shipNum = 1;
			keyPress.time = workerTimeMeasure.now();
			keyPress.key = 4;
			keyPress.type = 0;
			
			currentKeyPress++;
		}
		if(event.keyCode == 97 && keyPressArray[1].special != false)
		{
			keyPressArray[1].special = false;
			
			var keyPress = keyPressList[currentKeyPress];
			
			keyPress.shipNum = 1;
			keyPress.time = workerTimeMeasure.now();
			keyPress.key = 5;
			keyPress.type = 0;
			
			currentKeyPress++;
		}
	}
	
}

