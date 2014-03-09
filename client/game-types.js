"use strict";




//define Vec2
function Vec2(vecX,vecY)
{
	this.x = vecX;
	this.y = vecY;
	
	Object.preventExtensions(this);
}
	
Vec2.prototype.add = 		function(vecX,vecY)
							{
								this.x += vecX;
								this.y += vecY;
							};

Vec2.prototype.addR = 		function(vecX,vecY)
							{
								return new Vec2(this.x+vecX, this.y+vecY);
							};

Vec2.prototype.sub = 		function(vecX,vecY)
							{
								this.x -= vecX;
								this.y -= vecY;
							};

Vec2.prototype.subR = 		function(vecX,vecY)
							{
								return new Vec2(this.x-vecX, this.y-vecY);
							};

Vec2.prototype.addVec2 = 	function(oVec2)
							{
								this.x += oVec2.x;
								this.y += oVec2.y;
							};

Vec2.prototype.addVec2R = 	function(oVec2)
							{
								return new Vec2(this.x+oVec2.x, this.y+oVec2.y);
							};

Vec2.prototype.subVec2 = 	function(oVec2)
							{
								this.x -= oVec2.x;
								this.y -= oVec2.y;
							};

Vec2.prototype.subVec2R = 	function(oVec2)
							{
								return new Vec2(this.x-oVec2.x, this.y-oVec2.y);
							};

Vec2.prototype.dup = 		function()
							{
								return new Vec2(this.x,this.y);
							};

Object.preventExtensions(Vec2);





//define LinkedList
function LinkedList()
{
	this.list = new Array();

	//Object.preventExtensions(this);
}
	
LinkedList.prototype.insertStart = 		function(obj)
										{
											this.list.unshift(obj);
										};

LinkedList.prototype.insertEnd = 		function(obj)
										{
											this.list.push(obj);
										};
									
LinkedList.prototype.insertAfter = 		function(obj, objToInsert)
										{
											var index = this.find(obj);
											//should work with last element, "If greater than the length of the array, 
											//actual starting index will be set to the length of the array"
											this.list.splice(index+1, 0, objToInsert);
										};

LinkedList.prototype.insertBefore = 	function(obj, objToInsert)
										{
											var index = this.find(obj);

											this.list.splice(index, 0, objToInsert);
										};

LinkedList.prototype.remove = 			function(obj)
										{
											var index = this.find(obj);

											this.list.splice(index, 1);
										};

LinkedList.prototype.shift = 			function()
										{
											return this.list.shift();
										};

LinkedList.prototype.pop = 				function()
										{
											return this.list.pop();
										};

LinkedList.prototype.removeAllBefore = 	function(obj)
										{
											var index = this.find(obj);

											this.list.splice(0, index);
										};

LinkedList.prototype.shiftAllBeforeTo = function(obj, linkedList)
										{
											var index = this.find(obj);


											for(var i = 0 ; i < index ; i++)
											{
												linkedList.list.push(this.list[i]);
											}

											this.removeAllBefore(obj);
											//var newList = this.list.slice(0, index);
										};

LinkedList.prototype.removeAllAfter = 	function(obj)
										{
											var index = this.find(obj);

											this.list.splice(index, this.list.length - index);
										};

LinkedList.prototype.getAt = 			function(index)
										{
											return this.list[index];
										};

LinkedList.prototype.find = 			function(obj)
										{
											return this.list.indexOf(obj);
										};

LinkedList.prototype.length = 			function()
										{
											return this.list.length;
										};

Object.preventExtensions(LinkedList);





//define Asteroid
function Asteroid(pos,vel,size,arrayPos)
{
	this.pos = pos.dup();
	this.vel = vel.addR((Math.random() - 0.5) * ASTEROID_VELOCITY_VARIATION,
						(Math.random() - 0.5) * ASTEROID_VELOCITY_VARIATION);
	this.size = size;
	
	this.live = false;
	
	this.dead = false;
	
	this.deadTime = 0;
	
	this.explosionSize = ASTEROID_SIZE_ARRAY[size];
	
	this.arrayPos = arrayPos;
	
	Object.preventExtensions(this);
}

Object.preventExtensions(Asteroid);






//define Ship
function Ship(shipNum)
{
	this.shipNum = shipNum;
	
	
	
	this.acceleration = 50 + (playerSettings[shipNum].Acceleration-1) * 160;
	this.maxSpeed = 100  + (playerSettings[shipNum].MaxSpeed-1) * 160;
	this.rotSpeed = 0.5 + (playerSettings[shipNum].TurnSpeed-1) / 2;
	this.bulletSpeed = 50 + (playerSettings[shipNum].BulletSpeed-1) * 80;
	this.shieldStrength = MAX_SHIELDS * (playerSettings[shipNum].SpecialAbilityStrength/5);
	
	this.startPos = new Vec2(0,0);
	
	if(		shipNum % 2 == 0)
		this.startPos.x = 100;
	else if(shipNum % 2 == 1)
		this.startPos.x = 700;
	
	if(		shipNum % 4 < 2)
		this.startPos.y = 200;
	else if(shipNum % 4 >= 2)
		this.startPos.y = 400;
		
		
	
	this.pos = this.startPos.dup();
	this.rot = 0;
	this.vel = new Vec2(0,0);
	this.acc = new Vec2(0,0);
	
	this.forwards = false;
	this.back = false;
	this.left = false;
	this.right = false;
	this.fire = false;
	this.special = false;
	

//	this.engineNoise = new Audio(ASSET_FOLDER + 'engine2-repeat.ogg');
//	this.engineNoise.loop = true;
//	this.engineNoise.pause();
	
//	this.boomNoise = new Audio(ASSET_FOLDER + 'boom.ogg');
//	this.boomNoise.volume = 0.2;
//	this.boomNoise.pause();

	
	this.shields = false;
	
	this.dead = false;
	this.deadTime = 0;
	
	this.explosionSize = 15;

	this.bulletQueue = Array();

	this.bulletQueue.length = MAX_BULLETS_PER_PLAYER + 2;

	//cant be arsed to find out if this is default behaviour.
	for(var i = 0 ; i < this.bulletQueue.length ; i++)
	{
		this.bulletQueue[i] = new Bullet();
	}

	this.frontOfBulletQueue = 0;
	this.backOfBulletQueue = 0;

	this.lastBulletTime = 0;
	
	this.shipFromPeer = false;
	
	this.shipInfo = null;
	
	Object.preventExtensions(this);
}

Ship.prototype.genShipInfo = function()
							{
								//return JSON.stringify(this, shipInfoCensor);
								return shipInfoStringGen(this);
							};

Ship.prototype.recvShipInfo = 	function(shipInfo)
							{
								this.shipInfo = shipInfo;
							};

Ship.prototype.applyShipInfo = 	function()
							{
								if(this.shipInfo != null)
								{
									shipInfoStringRead(this.shipInfo, this);
									this.shipInfo = null;
								}
							};

Object.preventExtensions(Ship);


function shipInfoCensor(key, value)
{
	if(key == "protoype")
	{
		return undefined;
	}
	if(key == "__proto__")
	{
		return undefined;
	}
	if(key == "engineNoise")
	{
		return undefined;
	}
	if(key == "boomNoise")
	{
		return undefined;
	}
	if(key == "shipInfo")
	{
		return undefined;
	}
	return value;
}
function asteroidInfoCensor(key, value)
{
	if(key == "deadTime")
	{
		return thisTime - deadTime;
	}
	return value;
}


function shipInfoStringGen(ship)
{
	var result = "ship\n";
	
	result += ship.shipNum + "\n";
	result += ship.acceleration + "\n";
	result += ship.maxSpeed + "\n";
	result += ship.rotSpeed + "\n";
	result += ship.bulletSpeed + "\n";
	
	result += ship.startPos.x + "\n";
	result += ship.startPos.y + "\n";
	result += ship.pos.x + "\n";
	result += ship.pos.y + "\n";
	result += ship.rot + "\n";
	result += ship.vel.x + "\n";
	result += ship.vel.y + "\n";
	result += ship.acc.x + "\n";
	result += ship.acc.y + "\n";
	
	result += ship.forwards + "\n";
	result += ship.back + "\n";
	result += ship.left + "\n";
	result += ship.right + "\n";
	result += ship.fire + "\n";
	result += ship.special + "\n";
	
	result += ship.shields + "\n";
	result += ship.shieldStrength + "\n";
	
	result += ship.dead + "\n";
	result += ship.deadTime + "\n";

	//result += JSON.stringify(ship.bulletQueue) + "\n";
	
	for(var i = 0 ; i < ship.bulletQueue.length ; i++)
	{
		if(i != 0)
		{
			result += ":";
		}
		
		if(ship.bulletQueue[i] != null)
		{
			result += ship.bulletQueue[i].pos.x + ",";
			result += ship.bulletQueue[i].pos.y + ",";
			
			result += ship.bulletQueue[i].vel.x + ",";
			result += ship.bulletQueue[i].vel.y + ",";
			
			result += ship.bulletQueue[i].startTime;
		}
		else
		{
			result += "null";
		}
	}
	result += "\n";
	
	result += ship.frontOfBulletQueue + "\n";
	result += ship.backOfBulletQueue + "\n";
	
	result += ship.lastBulletTime + "\n";
	
	return result;
}

function shipInfoStringRead(shipInfo, ship)
{
	var infoArray = shipInfo.split("\n");
	
	var currPos = 1;
	
	ship.shipNum = parseFloat(infoArray[currPos++]);
	ship.acceleration = parseFloat(infoArray[currPos++]);
	ship.maxSpeed = parseFloat(infoArray[currPos++]);
	ship.rotSpeed = parseFloat(infoArray[currPos++]);
	ship.bulletSpeed = parseFloat(infoArray[currPos++]);
	
	ship.startPos.x = parseFloat(infoArray[currPos++]);
	ship.startPos.y = parseFloat(infoArray[currPos++]);
	ship.pos.x = parseFloat(infoArray[currPos++]);
	ship.pos.y = parseFloat(infoArray[currPos++]);
	ship.rot = parseFloat(infoArray[currPos++]);
	ship.vel.x = parseFloat(infoArray[currPos++]);
	ship.vel.y = parseFloat(infoArray[currPos++]);
	ship.acc.x = parseFloat(infoArray[currPos++]);
	ship.acc.y = parseFloat(infoArray[currPos++]);
	
	ship.forwards = (infoArray[currPos++] == "true");
	ship.back = (infoArray[currPos++] == "true");
	ship.left = (infoArray[currPos++] == "true");
	ship.right = (infoArray[currPos++] == "true");
	ship.fire = (infoArray[currPos++] == "true");
	ship.special = (infoArray[currPos++] == "true");
	
	ship.shields = (infoArray[currPos++] == "true");
	ship.shieldStrength = parseFloat(infoArray[currPos++]);
	
	ship.dead = (infoArray[currPos++] == "true");
	ship.deadTime = parseFloat(infoArray[currPos++]);

	//ship.bulletQueue = JSON.parse(infoArray[currPos++]);
	
	var bullQueueArr = infoArray[currPos++].split(":");
	
	for(var i = 0 ; i < bullQueueArr.length ; i++)
	{
		if(bullQueueArr[i].valueOf() != "null")
		{
			var bulletArr = bullQueueArr[i].split(",");
			var bulletArrPos = 0;
			
			if(ship.bulletQueue[i] == null)
			{
				//data replaced with real data below
				ship.bulletQueue[i] = new Bullet(ship, 0);
			}
			ship.bulletQueue[i].pos.x = parseFloat(bulletArr[bulletArrPos++]);
			ship.bulletQueue[i].pos.y = parseFloat(bulletArr[bulletArrPos++]);
			
			ship.bulletQueue[i].vel.x = parseFloat(bulletArr[bulletArrPos++]);
			ship.bulletQueue[i].vel.y = parseFloat(bulletArr[bulletArrPos++]);
			
			ship.bulletQueue[i].startTime = parseFloat(bulletArr[bulletArrPos++]);
		}
		else
		{
			ship.bulletQueue[i] = null;
		}
	}
	
	ship.frontOfBulletQueue = parseFloat(infoArray[currPos++]);
	ship.backOfBulletQueue = parseFloat(infoArray[currPos++]);
	
	ship.lastBulletTime = parseFloat(infoArray[currPos++]);
}


function asteroidInfoStringGen(asteroid)
{
	var result = "asteroid\n";
	
	result += asteroid.pos.x + "\n";
	result += asteroid.pos.y + "\n";
	
	result += asteroid.vel.x + "\n";
	result += asteroid.vel.y + "\n";
	
	result += asteroid.size + "\n";
	
	result += asteroid.live + "\n";
	
	result += asteroid.dead + "\n";
	
	result += asteroid.deadTime + "\n";
	
	result += asteroid.explosionSize + "\n";
	
	result += asteroid.arrayPos + "\n";
	
	return result;
}

function asteroidInfoStringRead(asteroidInfo, asteroid)
{
	var infoArray = asteroidInfo.split("\n");
	
	var currPos = 1;
	
	
	asteroid.pos.x = parseFloat(infoArray[currPos++]);
	asteroid.pos.y = parseFloat(infoArray[currPos++]);
	
	asteroid.vel.x = parseFloat(infoArray[currPos++]);
	asteroid.vel.y = parseFloat(infoArray[currPos++]);
	
	asteroid.size = parseFloat(infoArray[currPos++]);
	
	asteroid.live = (infoArray[currPos++] == "true");
	
	asteroid.dead = (infoArray[currPos++] == "true");
	
	asteroid.deadTime = parseFloat(infoArray[currPos++]);
	
	asteroid.explosionSize = parseFloat(infoArray[currPos++]);
	
	asteroid.arrayPos = parseFloat(infoArray[currPos++]);
	
}


//define Bullet
function Bullet()
{
	this.pos = new Vec2(0,0);
	this.vel = new Vec2(0,0);
	
	this.startTime = 0;
	
	Object.preventExtensions(this);
}

Bullet.prototype.fireBullet = 	function(ship, time)
								{
									//bullet is at front of ship
									this.pos.x = ship.pos.x;
									this.pos.y = ship.pos.y;
									
									this.pos.add(12 *  Math.sin(ship.rot),
												 12 * -Math.cos(ship.rot));
									
									this.vel.x = ship.bulletSpeed *  Math.sin(ship.rot);
									this.vel.y = ship.bulletSpeed * -Math.cos(ship.rot);
									
									this.vel.add((Math.random() - 0.5) * BULLET_VELOCITY_VARIATION,
												 (Math.random() - 0.5) * BULLET_VELOCITY_VARIATION );
									
									this.startTime = time;
								};


Object.preventExtensions(Bullet);



//define GameKeyFrame
function GameKeyFrame(numShips, numAsteroids)
{
	this.time = 0.0;
	
	this.active = false;
	
	this.shipInfoArray = new Array(numShips);
	
	this.asteroidInfoArray = new Array(numAsteroids);
	
	Object.preventExtensions(this);
}

GameKeyFrame.prototype.saveStateAsKeyFrame = function()
											{
												this.active = true;
												for(var i = 0 ; i < shipArray.length ; i++)
												{
													this.shipInfoArray[i] = shipInfoStringGen(shipArray[i]);
												}
												
												for(var i = 0 ; i < asteroidArray.length ; i++)
												{
													this.asteroidInfoArray[i] = asteroidInfoStringGen(asteroidArray[i]);
												}
												
												this.time = thisTime;
											};

GameKeyFrame.prototype.revertToKeyFrame = 	function()
											{
												for(var i = 0 ; i < shipArray.length ; i++)
												{
													shipInfoStringRead(this.shipInfoArray[i], shipArray[i]);
												}
												
												for(var i = 0 ; i < asteroidArray.length ; i++)
												{
													asteroidInfoStringRead(this.asteroidInfoArray[i], asteroidArray[i]);
												}
												
												thisTime = this.time;
												//avoid nasty time dilations
												lastTime = thisTime;
												
												reSimulating = true;
											};


Object.preventExtensions(GameKeyFrame);

//define GameEvent
function GameEvent()
{
	this.time = 0.0;
	
	this.apply = null;
	this.eventNumber = -1;
	this.eventString = "undefined";
	
	this.last = null;
	this.next = null;
	
	Object.preventExtensions(this);
}


Object.preventExtensions(GameEvent);
