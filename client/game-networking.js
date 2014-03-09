"use strict";


var rrPing = 0;

var lastMetricPacketTime = null;
var packetsSentOurMetric = null;
var packetsRecvOurMetric = null;

function genMetricsPacket()
{
	var metrics = new Object();
	
	metrics.time = timeMeasure.now();
	metrics.lastTime = lastMetricPacketTime;
	lastMetricPacketTime = metrics.time;
	
	metrics.packetsSent = packetsSentOurMetric;
	packetsSentOurMetric = 0;
	
	metrics.packetsRecv = packetsRecvOurMetric;
	packetsRecvOurMetric = 0;
	
	metrics.currPing = rrPing;
	
	var result = JSON.stringify(metrics);
	
	console.log("metric\n" + result);
	netConn.send("metric\n" + result);
	setTimeout(genMetricsPacket, 10000);
}


var lastRecvMetricPacketTime = null;
var packetsSentTheirMetric = null;
var packetsRecvTheirMetric = null;

function recvMetricsPacket(metrics)
{
	var metricsResp = new Object();
	
	metricsResp.metricSentTime = metrics.time;
	
	metricsResp.time = timeMeasure.now();
	metricsResp.lastTime = lastMetricPacketTime;
	lastMetricPacketTime = metricsResp.time;
	
	metricsResp.packetsSent = packetsSentTheirMetric;
	packetsSentTheirMetric = 0;
	
	metricsResp.packetsRecv = packetsRecvTheirMetric;
	packetsRecvTheirMetric = 0;
	
	metricsResp.currPing = rrPing;
	
	var result = JSON.stringify(metricsResp);
	
	console.log("metricResp\n" + result);
	netConn.send("metricResp\n" + result);
}



function recvMetricsResponse(metricsResp)
{
	rrPing = timeMeasure.now() - metricsResp.metricSentTime;
	console.log("Ping = " + rrPing);
}



function announcePeer()
{
	peer = new Peer(myPeerID.value, {key: '3yxyadgjlh00be29'});
	
	peer.on('connection', onRecvConnection);
	
	console.log("myPeerID.onchanged");
}

function onRecvConnection(connection)
{
	netConn = connection;
	shipArray[0].shipFromPeer = false;
	shipArray[1].shipFromPeer = true;
	connection.on('data', onRecvData);
}

function contactPeer()
{
	netConn = peer.connect(otherPeerID.value);
	
	netConn.on('open', onRecvConnectionResp);
	console.log("otherPeerID.onchanged");
}

function onRecvConnectionResp() 
{
	netConn.send('Hello World!');
	ownedShip = 1;
	shipArray[0].shipFromPeer = true;
	shipArray[1].shipFromPeer = false;
	netConn.send(shipArray[ownedShip].genShipInfo());

	netConn.on('data', onRecvData);
}

function onRecvData(data) 
{
	if(data.valueOf() == 'Hello World!'.valueOf())
	{
		console.log('Got data:', data);
		
		if(!networked)
			netConn.send('Hello World!');
		
		networked = true;
		//setTimeout(sendNetworkData, 50);
		
		//begin sending performance data
		setTimeout(genMetricsPacket, 1000);
	}
	else
	{
		if(data.substring(0,4).valueOf() == "ship".valueOf())
		{
			var peeredShipNum = data.split("\n")[1];
			shipArray[peeredShipNum].recvShipInfo(data);
			//var otherShipInfo = JSON.parse(data);
			//var peeredShipNum = otherShipInfo.shipNum;
			
			//shipArray[peeredShipNum].recvShipInfo(otherShipInfo);
		}
		else if(data.substring(0,7).valueOf() == "metric\n".valueOf())
		{
			var metricPacketJSON = data.split("\n")[1];
			var metricPacket = JSON.parse(metricPacketJSON);
			recvMetricsPacket(metricPacket)
		}
		else if(data.substring(0,11).valueOf() == "metricResp\n".valueOf())
		{
			var metricRespJSON = data.split("\n")[1];
			var metricResp = JSON.parse(metricRespJSON);
			recvMetricsResponse(metricResp);
		}
		else
		{
			recvAsteroidArray = data;
			recvAsteroid();
		}
	}
}

function sendNetworkData()
{
	netConn.send(shipArray[ownedShip].genShipInfo());
	
	if(ownedShip == 0)
	{
		var priorityAsteroid = shiftANPA();
		var asteroidStr = null;
		if(priorityAsteroid != null)
			asteroidStr = priorityAsteroid.arrayPos + "\n" + JSON.stringify(priorityAsteroid);
		else
			asteroidStr = asteroidArraySendPos + "\n" + JSON.stringify(asteroidArray[asteroidArraySendPos]);
		
		if(asteroidStr != null)
			netConn.send(asteroidStr);
		
		asteroidArraySendPos = (asteroidArraySendPos + 1) % asteroidArray.length;
	}
	
	for(var shipNum = 0 ; shipNum < shipArray.length ; shipNum++)
	{
		shipArray[shipNum].applyShipInfo();
	}
	

	setTimeout(sendNetworkData, 100);
}

function recvAsteroid()
{
	if(recvAsteroidArray != null)
	{
		var recvAsteroidStrs = recvAsteroidArray.split("\n");
		var sentAsteroid = recvAsteroidStrs[0];
		if(recvAsteroidStrs[1].valueOf() === 'undefined'.valueOf())
		{
			asteroidArray[sentAsteroid] = null;
		}
		else
		{
			var recvAsteroid = JSON.parse(recvAsteroidStrs[1]);
			if(recvAsteroid != null)
			{
				if(asteroidArray[sentAsteroid] == null)
				{
					//we'll fix this shim data in a second, so it doesn't matter
					asteroidArray[sentAsteroid] = new Asteroid(new Vec2(0,0),new Vec2(0,0),1,sentAsteroid);
				}
				asteroidArray[sentAsteroid].pos.x = recvAsteroid.pos.x;
				asteroidArray[sentAsteroid].pos.y = recvAsteroid.pos.y;
				
				asteroidArray[sentAsteroid].vel.x = recvAsteroid.vel.x;
				asteroidArray[sentAsteroid].vel.y = recvAsteroid.vel.y;
				
				asteroidArray[sentAsteroid].size = recvAsteroid.size;
				
				asteroidArray[sentAsteroid].dead = recvAsteroid.dead;
				asteroidArray[sentAsteroid].live = recvAsteroid.live;
				
				asteroidArray[sentAsteroid].deadTime = thisTime - recvAsteroid.deadTime;
			}
			else
			{
				asteroidArray[sentAsteroid] = null;
			}
		}
		recvAsteroidArray = null;
	}
}

function pushANPA(asteroid)
{
	for(var i = ANPAStart ; i != ANPAEnd ; i = (i+1)%ANPALength)
	{
		if(asteroid == asteroidNetPriorityArray[i])
		{
			//console.log("Asteroid already in array");
			return;
		}
	}
	if((ANPAEnd+1)%ANPALength != ANPAStart)
	{
		ANPAEnd = (ANPAEnd + 1)%ANPALength
		asteroidNetPriorityArray[ANPAEnd] = asteroid;
	}
	else
		console.log("OMG! TOO MANY ASTEROIDS!!1!");
}


function shiftANPA()
{
	var result = null;

	if(ANPAStart != ANPAEnd)
	{
		result = asteroidNetPriorityArray[ANPAStart];
		
		ANPAStart = (ANPAStart + 1)%ANPALength;
	}
	
	return result;
}