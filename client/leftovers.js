function drawShipImg(pos, ship) 
{
	ctx.save();
	ctx.translate(pos.x, pos.y);
	ctx.rotate(ship.rot);
	
	ctx.globalAlpha = 1;
	ctx.drawImage(SHIP_IMG, -(SHIP_IMG.width/2), -(SHIP_IMG.height/2));
	
	if(ship.forwards)
	{
		ctx.fillStyle="#ff4500";
		
		ctx.beginPath();  
		ctx.moveTo(-3, 14);
		ctx.lineTo( 3, 14);
		var rnd = Math.random();
		ctx.lineTo( 0, rnd * (50 - 16) + 16);
		ctx.globalAlpha = 1-rnd;
		ctx.closePath();
		ctx.fill();
		
		//ctx.fillRect(-2,18,4,-4);
	}
	
	/*ctx.fillStyle="#FF0000";
	ctx.fillRect(-10,-10,20,20);
	if(!ship.forwards)
	{
		ctx.fillStyle="#0000FF";
		ctx.fillRect(-15,15,5,-5);
		ctx.fillStyle="#0000FF";
		ctx.fillRect(15,15,-5,-5);
	}
	else
	{
		ctx.fillStyle="#0000FF";
		ctx.fillRect(-15,20,5,-10);
		ctx.fillStyle="#0000FF";
		ctx.fillRect(15,20,-5,-10);
	}
	ctx.fillStyle="#0000FF";
	ctx.fillRect(2.5,15,-5,-5);
	ctx.fillStyle="#00A000";
	ctx.fillRect(2.5,-15,-5,5);*/
	
	if(ship.shields)
	{
		ctx.fillStyle="#0000FF";
		ctx.globalAlpha = 0.5;
		ctx.beginPath();
		ctx.arc(0,0,25,0,2*Math.PI);
		ctx.fill();
	}
	ctx.restore();
}

function drawAsteroidImg(posX, posY, image)
{
	ctx.save();
	ctx.translate(pos.x, pos.y);
	//ctx.globalAlpha = 1;
	ctx.drawImage(	  image, 
					-(image.width/2), 
					-(image.height/2));
	
	/*
	ctx.fillStyle="#AAAA55";
	ctx.beginPath();
	ctx.arc(0,0,ASTEROID_SIZE_ARRAY[asteroid.size],0,2*Math.PI);
	ctx.fill();
	*/
	ctx.restore();
}


									/*this.pos.x = this.shipInfo.pos.x;
									this.pos.y = this.shipInfo.pos.y;
									this.vel.x = this.shipInfo.vel.x;
									this.vel.y = this.shipInfo.vel.y;
									this.rot   = this.shipInfo.rot;
									this.acc.x = this.shipInfo.acc.x;
									this.acc.y = this.shipInfo.acc.y;
									
									this.forwards 	= this.shipInfo.forwards;	
									this.back 		= this.shipInfo.back;
									this.left 		= this.shipInfo.left;
									this.right 		= this.shipInfo.right;
									this.fire 		= this.shipInfo.fire;
									this.special 	= this.shipInfo.special;
									
									this.shields = this.shipInfo.shields;
									this.shieldStrength = this.shipInfo.shieldStrength;
									
									this.dead = this.shipInfo.dead;
									this.deadTime = this.shipInfo.deadTime;
									
									
									for(var i = 0 ; i < this.bulletQueue.length ; i++)
									{
										this.bulletQueue[i] = this.shipInfo.bulletQueue[i];
									}

									this.frontOfBulletQueue = this.shipInfo.frontOfBulletQueue;
									this.backOfBulletQueue = this.shipInfo.backOfBulletQueue;

									this.lastBulletTime = this.shipInfo.lastBulletTime;
									*/