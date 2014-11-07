var application_root = __dirname,
	express = require( 'express' ),
	path = require( 'path' ),
	_ = require('underscore'),
	requestParameters = require('./requestParameters.js');


var app = express();
app.use( express.static( application_root ));
app.use( express.bodyParser() );
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = 4711;
http.listen( port, function()  {
	console.log( 'Express server is listenting in %d port in %s mode',port ,app.settings.env );
});

io.on('connection', function(socket) {
	console.log("Client Connected");

	socket.on('command',function(command) {
		var reqParameters=_.find(requestParameters, function(obj,key) {			
			return key==command.req;
		});
		var hasParameters = reqParameters != undefined ? true : false;

		var Remote = require('ripple-lib').Remote;
		
		var remote = new Remote({
			servers: [ command.socketUri ]
		});

		remote.connect(function() { 
			console.log("WS Connected to " + command.socketUri);
		});
		// remote.requestPeers(function(res) { //no permission
		// 	console.log(res);
		// });
	// remote.orderbook(function(res) {
	// 	console.log(res);
	// });
		console.log(command);

		if( command.req == 'subscribe' ) {

		   var request = remote.request('subscribe');

		    _.each(command.streamConnections, function(stream) {
		   		request.addStream(stream); 
		    })

		    remote.on('ledger_closed', function onLedgerClosed(ledgerData) {
		    	var ledgerData = JSON.stringify(ledgerData,null,3);
				io.emit('ledger_closed', ledgerData);
				console.log(ledgerData);
		    });

		    remote.on('transaction', function onTransaction(transaction) {
		   		var transaction = JSON.stringify(transaction,null,3);
				io.emit('transaction', transaction);
		    	//console.log(transaction);
		    });

		    request.request(function(err,success) {
		        if (err) {
		        	console.log("EROOOOOOR",err);
		        } else {
		        	console.log("Request OK");
		        	console.log(success);
		        }
		    });
		
		}  else if(hasParameters) {

			var request = remote.request(command.req, reqParameters ,function(err, req) {
				if(err) console.log(err);
				console.log(req);	
				var req = JSON.stringify(req,null,3);
				io.emit('result', req);
			});

		}  else  {

			remote.request(command.req, function(err, simpleReq) {
				console.log(simpleReq);	
				var simpleReq = JSON.stringify(simpleReq, null, 3);
				io.emit('result', simpleReq);
			});

		}
		
	});

});




// app.get( '/' , function( request, response ) {
// 	response.send( ' Welcome to this amazing ripple-lib test interface -> check /api to start');
// });

// app.get( '/api', function( request, response ) {
// 	response.send('index.html' );
// });