"use strict";





function simulateShip(ship)
{
	if(ship.dead)
	{
		//ship.engineNoise.pause();
		
		if(thisTime - ship.deadTime < 1000)
		{
			appendDrawExplosion(ship);
		}
		else
		{
			ship.dead = false;
			ship.pos.x = ship.startPos.x;
			ship.pos.y = ship.startPos.y;
			ship.vel.x = 0;
			ship.vel.y = 0;
			ship.rot = 0;
			ship.shieldStrength = MAX_SHIELDS;
		}
	}
	
	if(!ship.dead)
	{
		if(ship.special && ship.shieldStrength > SHIELD_START_COST && !ship.shields)
		{
			//will never use minshields, just being consistent
			ship.shieldStrength = Math.max(ship.shieldStrength - SHIELD_START_COST, MIN_SHIELDS);
		
			ship.shields = true;
		}
		else if(!ship.special)
		{
			ship.shields = false;
		}
		else if(ship.shields)
		{
			ship.shieldStrength = Math.max(ship.shieldStrength - SHIELD_RUN_COST * (thisTime - lastTime)/1000, MIN_SHIELDS);
			if(ship.shieldStrength < 0)
			{
				ship.shields = false;
			}
		}
	
		if(!ship.shields)
		{
			ship.shieldStrength = Math.min(ship.shieldStrength + SHIELD_REGEN * (thisTime - lastTime)/1000, 100);
		}
	
		moveShip(ship);
	}
	
	for(var bullNum = ship.frontOfBulletQueue ; bullNum != ship.backOfBulletQueue ; bullNum = (bullNum + 1) % ship.bulletQueue.length)
	{
		var bullet = ship.bulletQueue[bullNum];
		
		if(bullet != null)
		{
			if(bullet.startTime < thisTime - 1000)
			{
				//swap with front bullet and push off the queue
				ship.bulletQueue[bullNum] = ship.bulletQueue[ship.frontOfBulletQueue];
				ship.bulletQueue[ship.frontOfBulletQueue] = bullet;
				
				ship.frontOfBulletQueue = (ship.frontOfBulletQueue + 1) % ship.bulletQueue.length;
			}
			else
			{
				moveBullet(bullet);
			}
		}
	}
	
	
	if(!ship.dead)
		appendDrawShip(ship);
	
	detectCollisions(ship);
	
	if(!ship.dead)
	{
		if(ship.fire && ship.lastBulletTime < thisTime - 200)
		{
			fireBullet(ship);
		}
	}
}

function moveShip(ship)
{
	var currRotSpeed = 0;

	if(ship.left)
		currRotSpeed -= ship.rotSpeed;

	if(ship.right)
		currRotSpeed += ship.rotSpeed;

	ship.rot += currRotSpeed * (thisTime - lastTime)/1000;

	//drag moved to here, maybe?
	ship.vel.x -= ship.acceleration * ship.vel.x/ship.maxSpeed * (thisTime - lastTime)/1000;
	ship.vel.y -= ship.acceleration * ship.vel.y/ship.maxSpeed * (thisTime - lastTime)/1000;
	
	
	ship.acc.x = 0;
	ship.acc.y = 0;
	if(ship.forwards)
	{
		ship.acc.x += ship.acceleration * Math.sin(ship.rot);
		ship.acc.y += ship.acceleration * -Math.cos(ship.rot);
	
		//ship.engineNoise.play();
	}
	else
	{
		//ship.engineNoise.pause();
	}

	if(ship.back)
	{
		ship.acc.x += -ship.acceleration * Math.sin(ship.rot);
		ship.acc.y += -ship.acceleration * -Math.cos(ship.rot);
	}
	ship.vel.x += ship.acc.x * (thisTime - lastTime)/1000;
	ship.vel.y += ship.acc.y * (thisTime - lastTime)/1000;

	//recover from insanity, maybe too big a number, but what the hell, LIGHT SPEED!
	//(yes, I realise this means you can go 1.41x lightspeed. Don't think about it)
	if(ship.vel.x > 299792458)
		ship.vel.x = 299792458;
	if(ship.vel.y > 299792458)
		ship.vel.y = 299792458;


	ship.pos.x += ship.vel.x * (thisTime - lastTime)/1000;
	ship.pos.y += ship.vel.y * (thisTime - lastTime)/1000;

	//cover insane case (might cover normal case too :/)
	ship.pos.x = ship.pos.x % canvasRight;
	ship.pos.y = ship.pos.y % canvasBottom;

	if(ship.pos.x > canvasRight)
	{
		ship.pos.x = ship.pos.x-canvasRight;
	}

	if(ship.pos.x < 0)
	{
		ship.pos.x = ship.pos.x+canvasRight;
	}

	if(ship.pos.y > canvasBottom)
	{
		ship.pos.y = ship.pos.y-canvasBottom;
	}

	if(ship.pos.y < 0)
	{
		ship.pos.y = ship.pos.y+canvasBottom;
	}
}

function moveBullet(bullet)
{
	if(moveBullet.oldPos == null)
	{
		moveBullet.oldPos = new Vec2(0,0);
	}
	var oldPos = moveBullet.oldPos;
	
	oldPos.x = bullet.pos.x;
	oldPos.y = bullet.pos.y;
	bullet.pos.x += bullet.vel.x * (thisTime - lastTime)/1000;
	bullet.pos.y += bullet.vel.y * (thisTime - lastTime)/1000;
	
	var flipAround = false;
	
	if(bullet.pos.x > canvasRight)
	{
		bullet.pos.x -= canvasRight;
		flipAround = true;
	}
	if(bullet.pos.y > canvasBottom)
	{
		bullet.pos.y -= canvasBottom;
		flipAround = true;
	}
	if(bullet.pos.x < 0)
	{
		bullet.pos.x += canvasRight;
		flipAround = true;
	}
	if(bullet.pos.y < 0)
	{
		bullet.pos.y += canvasBottom;
		flipAround = true;
	}
	
	if(flipAround == false)
	{
		appendDrawBullet(oldPos,bullet.pos);
	}
	else
	{
		appendDrawBullet(null,bullet.pos);
	}
}

function fireBullet(ship)
{
	if((ship.backOfBulletQueue + 1) % ship.bulletQueue.length == ship.frontOfBulletQueue)
	{
		console.log("OGODOSHITTOOMANYBULLETS!!1!");
	}
	ship.bulletQueue[ship.backOfBulletQueue].fireBullet(ship, thisTime);
	ship.backOfBulletQueue = (ship.backOfBulletQueue + 1) % ship.bulletQueue.length;


	ship.lastBulletTime = thisTime;

	//lastPlayedFireNoise = (lastPlayedFireNoise + 1) % NUM_LAYERED_NOISES;
	//fireNoises[lastPlayedFireNoise].currentTime = 0;
	//fireNoises[lastPlayedFireNoise].play();
}


function detectCollisions(ship)
{
	for(var shipNum = 0 ; shipNum < shipArray.length && !ship.dead ; shipNum++)
	{
		var otherShip = shipArray[shipNum];
		if(otherShip != ship)
		{
			var xDist = otherShip.pos.x - ship.pos.x;
			var yDist = otherShip.pos.y - ship.pos.y;
			
			var distSq = xDist*xDist + yDist*yDist;
			
			//no sqrt for performance, dont need it
			if(distSq < 2500 && !otherShip.dead)
			{
				if(ship.shields == otherShip.shields)
				{
					ship.dead = true;
					ship.deadTime = thisTime;
					//ship.boomNoise.play();
					otherShip.dead = true;
					otherShip.deadTime = thisTime;
					//otherShip.boomNoise.play();
					break;
				}
				else if(ship.shields)
				{
					otherShip.dead = true;
					otherShip.deadTime = thisTime;
					//otherShip.boomNoise.play();
					ship.shieldStrength = Math.max(ship.shieldStrength - SHIELD_HIT_COST, MIN_SHIELDS);
				}
				else if(otherShip.shields)
				{
					ship.dead = true;
					ship.deadTime = thisTime;
					//ship.boomNoise.play();
					otherShip.shieldStrength = Math.max(otherShip.shieldStrength - SHIELD_HIT_COST, MIN_SHIELDS);
					break;
				}
			}
			else
			{
				for(var bullNum = otherShip.frontOfBulletQueue ; bullNum != otherShip.backOfBulletQueue ; bullNum = (bullNum + 1) % otherShip.bulletQueue.length)
				{
					var bullet = otherShip.bulletQueue[bullNum];
					if(bullet != null)
					{
						xDist = bullet.pos.x - ship.pos.x;
						yDist = bullet.pos.y - ship.pos.y;
						
						distSq = xDist*xDist + yDist*yDist;
						
						if(distSq < 729)
						{
							if(ship.shields)
							{
								ship.shieldStrength = Math.max(ship.shieldStrength - SHIELD_HIT_COST, MIN_SHIELDS);
							}
							else
							{
								ship.dead = true;
								ship.deadTime = thisTime;
								//ship.boomNoise.play();
							}
							
							//swap with front bullet and push off the queue
							otherShip.bulletQueue[bullNum] = otherShip.bulletQueue[otherShip.frontOfBulletQueue];
							otherShip.bulletQueue[otherShip.frontOfBulletQueue] = bullet;
							
							otherShip.frontOfBulletQueue = (otherShip.frontOfBulletQueue + 1) % otherShip.bulletQueue.length;
							break;
						}
					}
				}
			}
		}
	}
	
	for(var astNum = 0 ; astNum < asteroidArray.length ; astNum++)
	{
		var asteroid = asteroidArray[astNum];
		if(asteroid.live && !asteroid.dead)
		{
			var skipAsteroid = false;
			for(var bullNum = ship.frontOfBulletQueue ; bullNum != ship.backOfBulletQueue ; bullNum = (bullNum+1) % ship.bulletQueue.length)
			{
				var bullet = ship.bulletQueue[bullNum];
				if(bullet != null)
				{
					xDist = bullet.pos.x - asteroid.pos.x;
					yDist = bullet.pos.y - asteroid.pos.y;
					
					distSq = xDist*xDist + yDist*yDist;
					
					if(distSq < (ASTEROID_SIZE_ARRAY[asteroid.size] + 2) * 
								(ASTEROID_SIZE_ARRAY[asteroid.size] + 2))
					{
						asteroid.dead = true;
						asteroid.deadTime = thisTime;
						//pushANPA(asteroid);
						
						//lastPlayedBangNoise = (lastPlayedBangNoise + 1) % NUM_LAYERED_NOISES;
						//bangNoises[lastPlayedBangNoise].currentTime = 0;
						//bangNoises[lastPlayedBangNoise].play();
						
						if(asteroid.size != 0)
						{
							var child1Num = astNum + 1;
							var child2Num = astNum + Math.pow(2,asteroid.size);
							var newAst;
							
							newAst = asteroidArray[child1Num];
							newAst.pos.x = asteroid.pos.x;
							newAst.pos.y = asteroid.pos.y;
							newAst.vel.addVec2(asteroid.vel);
							newAst.live = true;
							
							//pushANPA(newAst);
							
							newAst = asteroidArray[child2Num];
							newAst.pos.x = asteroid.pos.x;
							newAst.pos.y = asteroid.pos.y;
							newAst.vel.addVec2(asteroid.vel);
							newAst.live = true;
							
							//pushANPA(newAst);
						}
						
						//swap with front bullet and push off the queue
						ship.bulletQueue[bullNum] = ship.bulletQueue[ship.frontOfBulletQueue];
						ship.bulletQueue[ship.frontOfBulletQueue] = bullet;
						
						ship.frontOfBulletQueue = (ship.frontOfBulletQueue + 1) % ship.bulletQueue.length;
						
						skipAsteroid = true;
						break;
					}
				}
			}
			
			if(skipAsteroid)
				continue;
				
			xDist = asteroid.pos.x - ship.pos.x;
			yDist = asteroid.pos.y - ship.pos.y;
			
			distSq = xDist*xDist + yDist*yDist;
			
			if(!ship.dead && 
				distSq < (ASTEROID_SIZE_ARRAY[asteroid.size] + 25) * 
						 (ASTEROID_SIZE_ARRAY[asteroid.size] + 25))
			{
				if(ship.shields)
				{
					ship.shieldStrength = Math.max(ship.shieldStrength - SHIELD_HIT_COST, MIN_SHIELDS);
				}
				else
				{
					ship.dead = true;
					ship.deadTime = thisTime;
					//ship.boomNoise.play();
				}
				
				asteroid.dead = true;
				asteroid.deadTime = thisTime;
				//pushANPA(asteroid);
				
				//lastPlayedBangNoise = (lastPlayedBangNoise + 1) % NUM_LAYERED_NOISES;
				//bangNoises[lastPlayedBangNoise].currentTime = 0;
				//bangNoises[lastPlayedBangNoise].play();
				
				if(asteroid.size != 0)
				{
					var child1Num = astNum + 1;
					var child2Num = astNum + Math.pow(2,asteroid.size);
					var newAst;
					
					newAst = asteroidArray[child1Num];
					newAst.pos.x = asteroid.pos.x;
					newAst.pos.y = asteroid.pos.y;
					newAst.vel.addVec2(asteroid.vel);
					newAst.live = true;
					
					//pushANPA(newAst);
					
					newAst = asteroidArray[child2Num];
					newAst.pos.x = asteroid.pos.x;
					newAst.pos.y = asteroid.pos.y;
					newAst.vel.addVec2(asteroid.vel);
					newAst.live = true;
					
					//pushANPA(newAst);
				}
				break;
			}
		}
	}
}
