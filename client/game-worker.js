"use strict";

importScripts("game-shared-globals.js");

importScripts("game-worker-globals.js");

importScripts("game-types.js");
importScripts("game-simulate-ship.js");
importScripts("game-UI.js");
importScripts("game-worker-draw.js");


var lastSentDrawList = timeMeasure.now();

onmessage = 
function (oEvent) 
{
	var messageArray = oEvent.data.split("|");
	
	var messageTitle = messageArray[0];
	var messageBody = messageArray[1];
	
	switch(messageTitle)
	{
		case "keypress":
			AcceptKeyPress(messageBody);
			break;
		case "start":
			if(currentState == WorkerState.STOPPED)
			{
				messageBody = JSON.parse(messageBody);
				
				numPlayers = messageBody.numPlayers;
				canvasRight = messageBody.canvasRight;
				canvasBottom = messageBody.canvasBottom;
				
				playerSettings = messageBody.playerSettings;
				
				simulateStart();
				
				currentState = WorkerState.STARTED;
				
				simulateStep();
			}
			else
			{
				//console.log("State change failed, " + currentState + " to " + WorkerState.STARTED);
			}
			break;
		case "stop":
			if(currentState == WorkerState.STARTED)
			{
				clearTimeout(runTimeout);
				currentState = WorkerState.STOPPED;
			}
			else
			{
				//console.log("State change failed, " + currentState + " to " + WorkerState.STOPPED);
			}
			break;
		case "pause":
			if(currentState == WorkerState.STARTED)
			{
				clearTimeout(runTimeout);
				currentState = WorkerState.PAUSED;
			}
			else
			{
				//console.log("State change failed, " + currentState + " to " + WorkerState.PAUSED);
			}
			break;
		case "resume":
			if(currentState == WorkerState.PAUSED)
			{
				currentState = WorkerState.STARTED;
				simulateStep();
			}
			else
			{
				//console.log("State change failed, " + currentState + " to " + WorkerState.STARTED);
			}
			break;
		case "update":
			messageBody = JSON.parse(messageBody);
			
			numPlayers = messageBody.numPlayers;
			canvasRight = messageBody.canvasRight;
			canvasBottom = messageBody.canvasBottom;
			break;
		case "network":
			//console.log("Unimplemented!!!!");
			break;
		case "imageRequest":
			if(drawList != null)
			{
			
				var actualTimeNow = timeMeasure.now();
				if(actualTimeNow - thisTime < 8)
				{
					reSimulating = false;
					postMessage("drawList|" + drawList);
					lastFrameSentTime = actualTimeNow;
					lastSentDrawList = actualTimeNow;
					drawList = null;
				}
			}
			else
			{
				//We will discard the request, another will be along shortly anyway.
			}
			break;
		default:
			//console.log("Unrecognised message!");
			break;
	}
};
var eventNum = 0;
function AcceptKeyPress(message) 
{
	var messageArray = JSON.parse(message);
	
	var eventStr = "undefined";
	
	for(var i = 0 ; i < messageArray.length ; i++)
	{
		var shipNum = messageArray[i].shipNum;
		//messageArray[i].time;
		//messageArray[i].key;
		var keyPressFunction = null;
		
		var activated = messageArray[i].type;
		
		switch(messageArray[i].key)
		{
		case 0:
			eventStr = "forwards:" + (activated?"on":"off");
			if(activated)
				keyPressFunction = function(){shipArray[shipNum].forwards	= true;};
			else
				keyPressFunction = function(){shipArray[shipNum].forwards	= false;};
			break;
		case 1:
			eventStr = "right:" + (activated?"on":"off");
			if(activated)
				keyPressFunction = function(){shipArray[shipNum].right	= true;};
			else
				keyPressFunction = function(){shipArray[shipNum].right	= false;};
			break;
		case 2:
			eventStr = "back:" + (activated?"on":"off");
			if(activated)
				keyPressFunction = function(){shipArray[shipNum].back	= true;};
			else
				keyPressFunction = function(){shipArray[shipNum].back	= false;};
			break;
		case 3:
			eventStr = "left:" + (activated?"on":"off");
			if(activated)
				keyPressFunction = function(){shipArray[shipNum].left	= true;};
			else
				keyPressFunction = function(){shipArray[shipNum].left	= false;};
			break;
		case 4:
			eventStr = "fire:" + (activated?"on":"off");
			if(activated)
				keyPressFunction = function(){shipArray[shipNum].fire	= true;};
			else
				keyPressFunction = function(){shipArray[shipNum].fire	= false;};
			break;
		case 5:
			eventStr = "special:" + (activated?"on":"off");
			if(activated)
				keyPressFunction = function(){shipArray[shipNum].special	= true;};
			else
				keyPressFunction = function(){shipArray[shipNum].special	= false;};
			break;
		default:
			//console.log("Unrecognised Key Press");
		}
		//keyPressFunction();
		insertEvent(messageArray[i].time, keyPressFunction, eventNum++, eventStr);
		if(lastTime > messageArray[i].time)
		{
			var keyFrameToRevertTo = getKeyFrameBefore(messageArray[i].time);
			if(keyFrameToRevertTo != null)
			{
				//console.log("Reverting to time " + keyFrameToRevertTo.time + " for event " + (eventNum-1) + " " + eventStr);
				keyFrameToRevertTo.revertToKeyFrame();
			}
			else
			{
				//console.log("BADBADBAD");
			}
		}
	}
};

var keyFrames = new Array(10);
keyFrames.queueStart = 0;
keyFrames.queueEnd = 0;

var eventList = new LinkedList();
var deadEventList = new LinkedList();

eventList.getEventIndexBefore = 	function(time)
									{
										var theIndex = -1;

										for(var currIndex = this.list.length - 1 ; currIndex >= 0 ; currIndex--)
										{
											//console.log(currIndex+", "+this.list[currIndex]);
											if(this.list[currIndex].time < time)
											{
												theIndex = currIndex;
												break;
											}
										}

										return theIndex;
									};

eventList.getEventIndexBeforeEq = 	function(time)
									{
										var theIndex = -1;

										for(var currIndex = this.list.length - 1 ; currIndex >= 0 ; currIndex--)
										{
											//console.log(currIndex+", "+this.list[currIndex]);
											if(this.list[currIndex].time <= time)
											{
												theIndex = currIndex;
												break;
											}
										}

										return theIndex;
									};
									
eventList.getEventIndexAfter = 		function(time)
									{
										return this.getEventIndexBeforeEq(time) + 1;
									};
									
eventList.getEventIndexAfterEq = 	function(time)
									{
										return this.getEventIndexBefore(time) + 1;
									};

var lastCompletedEvent = null;

function createKeyFrame()
{
	////console.log("creatingkeyframe" + thisTime);
	var framePos = keyFrames.queueStart;
	var done = false;
	for( var i = keyFrames.queueEnd ; !done ; i = (i == 0) ? keyFrames.length-1 : i-1 )
	{
		if(keyFrames[i].time < thisTime)
		{
			framePos = (i+1)%keyFrames.length;
			//overwrite old frame
			if(keyFrames.queueStart == framePos)
			{
				keyFrames.queueStart = (keyFrames.queueStart+1)%keyFrames.length;
				
				var lastEvent = keyFrames[keyFrames.queueStart].lastEvent;
				
				//Move orphaned events into pool (orphaned == not following keyframe)
				if(lastEvent != null)
				{
					////console.log(getEventAfter(keyFrames[keyFrames.queueStart].time));
					removeEventsBefore(getEventAfter(keyFrames[keyFrames.queueStart].time));
				}
			}
			done = true;
		}
		
		if(i == keyFrames.queueStart)
			done = true;
	}
	
	keyFrames.queueEnd = framePos;
	////console.log("START" + keyFrames.queueStart + "FRAME" + framePos + "END" + keyFrames.queueEnd);
	
	keyFrames[framePos].saveStateAsKeyFrame(getEventBefore(thisTime));
}


function getKeyFrameBefore(time)
{
	for( var i = keyFrames.queueEnd ; i != keyFrames.queueStart ; i = (i == 0) ? keyFrames.length-1 : i-1 )
	{
		if(keyFrames[i].time < time)
		{
			return keyFrames[i];
		}
	}
	
	return null;
}

function removeEventsBefore(newBotEvent)
{
	//eventList.shiftAllBeforeTo(newBotEvent, deadEventList);
}

function getEventBefore(time)
{
	return eventList.getAt(eventList.getEventIndexBefore(time));
}

function getEventAfter(time)
{
	return eventList.getAt(eventList.getEventIndexAfter(time));
}

function getEventBeforeEq(time)
{
	return eventList.getAt(eventList.getEventIndexBeforeEq(time));
}

function getEventAfterEq(time)
{
	return eventList.getAt(eventList.getEventIndexAfterEq(time));
}

function insertEvent(time, applyFunction, eventNumber, eventString)
{
	//extricate newEvent from pool
	
	var newEvent = deadEventList.pop();

	if(newEvent == null)
		newEvent = new GameEvent();
	
	//now assign stuff
	
	newEvent.time = time;
	newEvent.apply = applyFunction;
	newEvent.eventNumber = eventNumber;
	newEvent.eventString = eventString;
	
	//console.log("Adding Event " + newEvent.eventNumber + " " + newEvent.eventString);
	//Inserting time.
	
	var lastEvent = getEventBeforeEq(time);

	if(lastEvent != null)
		eventList.insertAfter(lastEvent, newEvent);
	else
		eventList.insertStart(newEvent);
}


var runTimeout = null;

var drawList = null;

function simulateStart()
{
	
	for(var i = 0 ; i < keyFrames.length ; i++ )
	{
		keyFrames[i] = new GameKeyFrame();
	}
	
	for(var i = 0 ; i < 100 ; i++ )
	{
		var newEvent = new GameEvent();

		deadEventList.insertEnd(newEvent);
	}
	
	
	
	appendDrawBackground(canvasRight, canvasBottom);
	
	
	for(var i = 0 ; i < numPlayers ; i++)
	{
		shipArray[i] = new Ship(i);
	}

	
	//max number of asteroids
	asteroidArray.length = 15 * NUM_STARTING_ASTEROIDS;
	
	//asteroidNetPriorityArray.length = asteroidArray.length + 2;
	//ANPALength = asteroidNetPriorityArray.length + 1;
	
	var startSide;
	var astSize;
	for(var astNum = 0 ; astNum < asteroidArray.length ; astNum++)
	{
		astSize = astNum%15 - 1;
		astSize = astSize > 0 ? astSize%7 - 1 : astSize - 1;
		astSize = astSize > 0 ? astSize%3 - 1 : astSize - 1;
		astSize = astSize > 0 ? astSize%2 	  : astSize;
		astSize = astSize > 0 ? astSize%1 	  : astSize;
		astSize = Math.abs(astSize);
		////console.log("asteroid sizes: " + astNum + "," + astSize);
		asteroidArray[astNum] = new Asteroid(new Vec2(0, 0),new Vec2(0,0),astSize,astNum);
	}
	
	var asteroid;
	for(var astNum = 0 ; astNum < NUM_STARTING_ASTEROIDS ; astNum++)
	{
		startSide = Math.floor((Math.random()*4)); 
		
		asteroid = asteroidArray[astNum*15];
		
		if(startSide == 0)
		{
			asteroid.pos.x = 0;
			asteroid.pos.y = Math.random() * canvasBottom;
		}
		else if(startSide == 1)
		{
			asteroid.pos.x = Math.random() * canvasRight;
			asteroid.pos.y = 0;
		}
		else if(startSide == 2)
		{
			asteroid.pos.x = canvasRight;
			asteroid.pos.y = Math.random() * canvasBottom;
		}
		else if(startSide == 3)
		{
			asteroid.pos.x = Math.random() * canvasRight;
			asteroid.pos.y = canvasBottom;
		}
		
		asteroid.live = true;
		
		//pushANPA(asteroidArray[astNum*15]);
	}
	
	lastTime = timeMeasure.now();
	thisTime = timeMeasure.now();
	
	keyFrames[0].saveStateAsKeyFrame();
}

var trueLastTime = 0;
var reSimulating = false;
var lastFrameSentTime = 0;

var stackCounter = 0;

function simulateStep()
{
	if(currentState != WorkerState.STARTED)
	{
		return;
	}
	
	thisTime = timeMeasure.now();
	thisStepStartTime = thisTime;
	
//	if(keyFrames[keyFrames.queueStart].active && Math.random() < 0.01)
//		keyFrames[keyFrames.queueStart].revertToKeyFrame();
	
	if(!reSimulating && thisTime - lastTime > 32)
	{
		console.log("suspicious gap between steps of " + (thisTime - lastTime));
	}
	
	if(thisTime - lastTime < 16 && thisTime - lastFrameSentTime > 100)
	{
		console.log("bad frame gap of " + (thisTime - lastFrameSentTime));
	}
	
	if(thisTime - lastTime < 8)
	{
		runTimeout = setTimeout(simulateStep, timeToNextFrame-(thisTime - lastTime));
		return;
	}
	else if(thisTime - lastTime > 8)
	{
		thisTime = lastTime + 8;
	}
	
	var nextEvent = getEventBefore(lastTime);
	
	if(thisTime - trueLastTime != 8)
	{
		//console.log("Time dilation event!");
	}
	
	while(nextEvent != null && nextEvent.time < thisTime)
	{
		//console.log("Applying event " + nextEvent.eventNumber + " " + nextEvent.eventString);
		nextEvent.apply();
		lastCompletedEvent = nextEvent;
		nextEvent = eventList.getAt(eventList.find(nextEvent) + 1);
	}
	
	
	appendDrawBackground(canvasRight, canvasBottom);

	for(var shipNum = 0 ; shipNum < shipArray.length ; shipNum++)
	{
		simulateShip(shipArray[shipNum]);
	}
	
	for(var astNum = 0 ; astNum < asteroidArray.length ; astNum++)
	{
		var asteroid = asteroidArray[astNum];
		if(asteroid.live && !asteroid.dead)
		{
			asteroid.pos.x += asteroid.vel.x * (thisTime - lastTime)/1000;
			asteroid.pos.y += asteroid.vel.y * (thisTime - lastTime)/1000;
			
			//cover insane case
			asteroid.pos.x = asteroid.pos.x % canvasRight;
			asteroid.pos.y = asteroid.pos.y % canvasBottom;
			
			if(asteroid.pos.x > canvasRight)
			{
				asteroid.pos.x = asteroid.pos.x-canvasRight;
			}
			
			if(asteroid.pos.x < 0)
			{
				asteroid.pos.x = asteroid.pos.x+canvasRight;
			}

			if(asteroid.pos.y > canvasBottom)
			{
				asteroid.pos.y = asteroid.pos.y-canvasBottom;
			}
			
			if(asteroid.pos.y < 0)
			{
				asteroid.pos.y = asteroid.pos.y+canvasBottom;
			}
			
			appendDrawAsteroid(asteroid);
		}
		else if(asteroid.dead && thisTime - asteroid.deadTime < 1000)
		{
			appendDrawExplosion(asteroid);
		}
	}
	//draw UI
	//bit wierd to rely on draw ordering for z-index, but oh well.
	generateCanvasUI();
	
	var actualTimeNow = timeMeasure.now();
	if(actualTimeNow - thisTime < 8)
	{
		drawList = completeArrays();
	}
	
	if(actualTimeNow - thisTime > 16 && actualTimeNow - lastSentDrawList > 100)
	{
		drawList = completeArrays();
		console.log("OH SHIT TIME DIFF: " + (actualTimeNow - thisTime).toFixed(2));
		postMessage("drawList|" + drawList);
		
		//lastFrameSentTime = actualTimeNow;
		//lastSentDrawList = actualTimeNow;
		drawList = null;
	}
	
	//send to other thread
	//drawArrays(drawList);
	
	
	resetArrays();
	
	if(actualTimeNow - thisTime < 8 && actualTimeNow - lastSentDrawList > 24 )
	{
		postMessage("drawList|" + drawList);
		
		lastFrameSentTime = actualTimeNow;
		lastSentDrawList = actualTimeNow;
		drawList = null;
	}
	
	if(keyFrames[keyFrames.queueEnd].time < thisTime - 1000)
	{
		createKeyFrame();
		//var eventToOut = botEvent;
		//var outStr = "";
		
//		if(botEvent)
//			outStr += "botEvent: "+ botEvent.eventNumber + "\n";
//		if(topEvent)
//			outStr += "topEvent: "+ topEvent.eventNumber + "\n";
			
		
//		while(eventToOut != null)
//		{
//			outStr += "Event at time " + eventToOut.time + ": "+ eventToOut.eventNumber + "\n";
//			eventToOut = eventToOut.next;
//		}
		////console.log(outStr);
	}
	
	if(currentState == WorkerState.STARTED)
	{
		//8ms to limit simulation fps to about of 120. Otherwise I will melt somebodies potential children
		//8 ms from start though, otherwise we drop to 60fps on shit machines. 
		//Physics should be significantly higher than framerate.
		//calling at end so that it is behind other events if we are late. if we're going that slow, 
		//at least try to reduce latency on keypresses etc.
		
		//setTimeout is very iffy in sub-15ms chunks, 
		//so we adjust by flicking between 0 and 15ms timeouts when necessary. 
		//logic above ensures we simulate 8ms blocks even after a 15ms timeout, 
		//leaving leftovers, which eventually add up to >8ms, 
		//triggering an instant rerun to catch up
		
		if(timeMeasure.now() - thisTime >= 8)
		{
			if(false && stackCounter < 50)
			{
				stackCounter++;
				simulateStep();
			}
			else
			{
                stackCounter = 0;
				runTimeout = setTimeout(simulateStep, 0);
			}
		}
		else
			runTimeout = setTimeout(simulateStep, timeToNextFrame);
	}
	
	lastTime = thisTime;
	trueLastTime = thisTime;
}


