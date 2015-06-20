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
		// var request_unl= remote.request('unl_list');
		// request_unl.setServer('wss://s-east.ripple.com');
		// request_unl.request(function(err,res) {
		// 	console.log(err);
		// 	console.log(res);
		// });

		var request_server_info = remote.requestServerInfo();
		request_server_info.request(function(err,res) {
			// console.log(err,res);
		});
	// remote.orderbook(function(res) {
	// 	console.log(res);
	// });
		console.log(command);

		if( command.req == 'subscribe' ) {

		   var request = remote.request('subscribe');

		    _.each(command.streamConnections, function(stream) {
		   		request.addStream(stream); 
		    })

		    remote.on('ledger_data', function onLedgerClosed(ledgerData) {
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
		
		} else if( command.req == 'orderbook') {

			var parameters = {
				currency_gets: 'USD',
				issuer_gets:'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
				currency_pays:'XRP',
				issuer_pays:null
			};
			// var mybook_bid = remote.book(parameters);
			// var mybook_bid = remote.book(reqParameters.BASE.currency, reqParameters.BASE.issuer, reqParameters.TRADE.currency, reqParameters.TRADE.issuer);
			var mybook_bid = remote.book(parameters);
    		// var mybook_ask = remote.book(reqParameters.TRADE.currency, reqParameters.TRADE.issuer, reqParameters.BASE.currency, reqParameters.BASE.issuer);

		    mybook_bid.on("trade", handle_bids);
		    // mybook_ask.on("trade", handle_asks);  

		    function handle_bids(tg, tp)
		    {
		  //   	var parsedOffer = JSON.stringify(offers, null, 3);
				// io.emit('result', parsedOffer);
		  //       console.log(offers);
		  		if(tg.is_valid() || tp.is_valid()) {
					console.log("BID");
			        console.log("Taker_gets",tg.to_human());
			        console.log("Taker_gets ==> to_number",tg.to_number());
			        console.log("Taker_pays",tp.to_human());
			        console.log("Taker_pays ==> to_number",tp.to_number());
			        console.log("Ratio: tg/tp", tp.ratio_human(tg).to_human());
			    }
		    }

		    function handle_asks(tg, tp)
		    {
		  //   	var parsedOffer = JSON.stringify(offers, null, 3);
				// io.emit('result', parsedOffer);
				// console.log("TG_VALID",tg.is_valid());
				// console.log("TP_VALID", tp.is_valid());
				if(tg.is_valid() || tp.is_valid()) {
					console.log("ASK");
			        console.log("Taker_gets",tg.to_human());
			        console.log("Taker_gets ==> to_number",tg.to_number());
			        console.log("Taker_pays",tp.to_human());
			        console.log("Taker_pays ==> to_number",tp.to_number());
			        console.log("Ratio: tp/tg", tg.ratio_human(tp).to_human());
			    }
		    }
		}
			


		// } else if(command.req = 'payment') {

			// remote.setSecret("r3vv1aLTqFXACaA1E6mJRGAmvhWw6sizhF", "sh7kJ8pWL2t4AfCHqquJQeNz5hHbg");

			// var transaction = remote.createTransaction('Payment', {
			// 	account: "r3vv1aLTqFXACaA1E6mJRGAmvhWw6sizhF",
			// 	destination: "rGd4FaNjg22EvTuot3SRKF1suueUSc8Lhd",
			// 	amount:1,
			//     currency: "XRP"
			    
			// });

			// transaction.on('resubmitted', function() {
			// 	console.log("resubmitted");
			// });

			// transaction.submit(function(err, res) {
			// 	console.log(res);
			// 	if(err) console.log(err);
			// });

	

		// } else 
		// if(hasParameters) {
		// 	console.log("ccccccccccccccccccc",reqParameters);
		// 	var request = remote.request(command.req, reqParameters ,function(err, req) {
		// 		if(err) console.log(err);
		// 		console.log(req);	
		// 		var req = JSON.stringify(req,null,3);
		// 		io.emit('result', req);
		// 	});

		// }  else  {

		// 	remote.request(command.req, function(err, simpleReq) {
				
		// 		var simpleReq = JSON.stringify(simpleReq, null, 3);
		// 		io.emit('result', simpleReq);
		// 	});

		// }
		// console.log(hasParameters);
		
	});

});




// app.get( '/' , function( request, response ) {
// 	response.send( ' Welcome to this amazing ripple-lib test interface -> check /api to start');
// });

// app.get( '/api', function( request, response ) {
// 	response.send('index.html' );
// });