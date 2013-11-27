// create input
var sdpMyClient;
var sdpMyServer;
var sdpTheirClient;
var sdpTheirServer;
var ourRecievePort;
var ourSendPort;
var theirRecievePort;
var theirSendPort;
var webSocket;
	
	// create input
	sdpMyClient = document.createElement('input');
	sdpMyClient.id = "sdpMyClient";
	document.body.appendChild(sdpMyClient);
	
	ourRecievePort = document.createElement('input');
	ourRecievePort.id = "ourRecievePort";
	document.body.appendChild(ourRecievePort);
	
	sdpTheirServer = document.createElement('input');
	sdpTheirServer.id = "sdpTheirServer";
	document.body.appendChild(sdpTheirServer);
	
	theirSendPort = document.createElement('input');
	theirSendPort.id = "theirSendPort";
	document.body.appendChild(theirSendPort);
	
	
	sdpMyServer = document.createElement('input');
	sdpMyServer.id = "sdpMyServer";
	document.body.appendChild(sdpMyServer);
	
	ourSendPort = document.createElement('input');
	ourSendPort.id = "ourSendPort";
	document.body.appendChild(ourSendPort);

	
	sdpTheirClient = document.createElement('input');
	sdpTheirClient.id = "sdpTheirClient";
	document.body.appendChild(sdpTheirClient);
	
	theirRecievePort = document.createElement('input');
	theirRecievePort.id = "theirRecievePort";
	document.body.appendChild(theirRecievePort);

	if(typeof mozRTCPeerConnection == 'function')
	{
		ourRecievePort.onchange = function()
		{
			console.log("ourRecievePort.onchanged");
			
		}
		
		ourSendPort.onchange = function()
		{
			console.log("ourSendPort.onchanged");
			
		}
		
		theirRecievePort.onchange = function()
		{
			console.log("theirRecievePort.onchanged");
			var osp = parseInt(ourSendPort.value);
			var trp = parseInt(theirRecievePort.value);
			
			console.log("ourSendPort = " + osp + " theirRecievePort = " + trp);
			server.connectDataConnection(osp, trp);
		}
		
		theirSendPort.onchange = function()
		{
			console.log("theirSendPort.onchanged");
			var orp = parseInt(ourRecievePort.value);
			var tsp = parseInt(theirSendPort.value);
			
			console.log("ourRecievePort = " + orp + " theirSendPort = " + tsp);
			
			client.connectDataConnection(orp, tsp);
			console.log("theirSendPort.onchanged");
			client.connectDataConnection(parseInt(ourRecievePort.value), parseInt(theirSendPort.value));
		}
		
		sdpTheirClient.onchange = function()
		{
			console.log("sdpTheirClient.onchanged");
			var description = JSON.parse(sdpTheirClient.value);
			//var description = mozRTCSessionDescription({type:"offer", sdp:sdpTheirClient.value});
			
			//description.type = "offer";
			//description.sdp = sdpTheirClient.value;
			
			
			server.setRemoteDescription(description, function () 
			{
				console.log("server remote description set");
				server.createAnswer(answer);
			},errback);
		};
		
		sdpTheirServer.onchange = function()
		{
			console.log("sdpTheirServer.onchanged");
			var description = JSON.parse(sdpTheirServer.value);
			//var description = mozRTCSessionDescription({type:"answer", sdp:sdpTheirServer.value});
			
			//description.type = "answer";
			//description.sdp = sdpTheirServer.value;
			
			client.setRemoteDescription(description, function () 
			{
				console.log("client remote description set");
			},errback);
		};
		
		
		try
		{
			
			webSocket = new WebSocket("ws://localhost:9000");
			
			webSocket.onmessage = function(e) 
			{
				console.log("Got echo: " + e.data);
			}
			
			webSocket.onopen = function(e) 
			{
				webSocket.send("Hello, world!");
			}
			
			
			media = {};
			media.fake = media.audio = true;
			client = new mozRTCPeerConnection;
			server = new mozRTCPeerConnection;

			client.onconnection = function () {
				console.log("client.onconnection");
				var channel = client.createDataChannel("chat", {outOfOrderAllowed: true, maxRetransmitNum: 0 });

				channel.onmessage = function (event) {
					console.log("Server: " + event.data);
				};

				channel.onopen = function () {
					console.log("client.channel.onopen");
					channel.send("Hello Server!");
				};
			};

			server.ondatachannel = function (channel) {
				console.log("server.ondatachannel");
				channel.onmessage = function (event) {
					console.log("Client: " + event.data);
				};

				channel.onopen = function () {
					console.log("server.channel.onopen");
					channel.send("Hello Client!");
				};
			};

			navigator.mozGetUserMedia(media, callback, errback);
		}
		catch(err)
		{
			console.log("webrtc failed!");
			console.log(err);
		}
	}

function callback(fakeAudio) {
	server.addStream(fakeAudio);
	client.addStream(fakeAudio);
	client.createOffer(offer);
}

function errback(error) {
	console.log("Error occured! Description: " + error);
}

function offer(description) {
	console.log("offer");
	sdpMyClient.value = JSON.stringify(description);
	client.setLocalDescription(description, function () {
	});
}

function answer(description) {
	console.log("answer");
	sdpMyServer.value = JSON.stringify(description);
	server.setLocalDescription(description, function () {

	});
}
