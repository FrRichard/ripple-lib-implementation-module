var socket = io();
var nbrStreamInput=0;
var nbrStreamSelector=0;
var streamInput=['ledger','transactions'];
var nbrResultContainer=0;
var containerAttribution=[];
var streamConnections=[];

$('#connect').click(function() {
	removeResultContainer();
	
	
	var socketUri = $('#socketUri').val();
	var req = $('#selection').find(':selected').text().trim();
	
	if( req =='subscribe' ) {
		if(nbrStreamSelector==0) nbrStreamSelector++;
		for(i=1; i<=nbrStreamSelector; i++) {

			nbrResultContainer++;
			var stream=$('#streamSelector'+i).find(':selected').text().trim();
			if(stream=="") stream="ledger";
			$('#result').append($('<pre>').attr('id','resultContainer'+nbrResultContainer)
				.append(($('<code>').attr('id','output'+nbrResultContainer).attr('class','hljs'))));

			streamConnections.push(stream);

			streamConnections= _.unique(streamConnections);

		}
		
	} else {

		nbrResultContainer++;

		$('#result').append($('<pre>').attr('id','resultContainer'+nbrResultContainer)
			.append(($('<code>').attr('id','output'+nbrResultContainer).attr('class','hljs'))));

		
	}

	var blob = {
		socketUri:socketUri,
		req:req,
		streamConnections:streamConnections
	};

	
	socket.emit('command', blob);
	

});

function addStreamListener() {
	$('#addStream').click(function() {
		
		nbrStreamSelector++;
		$('#controller').append($('<select>').attr('id','streamSelector'+nbrStreamSelector));
		var $addSelector = $('#streamSelector'+nbrStreamSelector);

		_.each(streamInput , function(stream) {
				nbrStreamInput++;
				$addSelector.append($('<option>').text(stream).attr('id','streamInput'+nbrStreamInput));
		});
	});
};

function removeStreamListener() {
	$('#addStream').remove();
	for(i=1; i<=nbrStreamInput; i++) {
		$('#streamInput'+i).remove();
	}
	for(i=1; i<=nbrStreamSelector; i++) {
		$('#streamSelector'+i).remove();
	}
	nbrStreamInput=0;
	nbrStreamSelector=0;
};

function removeResultContainer() {

	for(i=1; i<=nbrResultContainer; i++) {
		$('#resultContainer'+i).remove();
	}
	containerAttribution=[];
	streamConnections=[];
	nbrResultContainer=0;
}	


if( $('#selection').find(':selected').text().trim() == 'subscribe' ) {
		
		$('#controller').append($('<button>').attr('id','addStream').html('add stream'));
		addStreamListener();
		
}

$('#selection').on('change' , function() {
	removeResultContainer();
	if( $('#selection').find(':selected').text().trim() == 'subscribe' ) {
		
		$('#controller').append($('<button>').attr('id','addStream').html('add stream'));
		addStreamListener();

	} else {
		removeStreamListener();
	}

});


var displayObject = function(result,divNum) {

	$('#output'+divNum).text(result);
	$('pre code').each(function(i, block) {
   		 hljs.highlightBlock(block);
  	});

};

function resultContainerAttribution() {
	var attributed=nbrResultContainer;
	console.log(attributed);
	return function() {
		if (attributed>0) {
			attributed--;
			return ++containerAttribution;
		}
	};
};



socket.on('result', function(result) {
	
	var divNum = nbrResultContainer;
	console.log(divNum);
	displayObject(result,divNum);

});

socket.on('transaction' , function(transaction) {
	var divNum = streamConnections.indexOf('transactions')+1;
	displayObject(transaction,divNum);
});

socket.on('ledger_closed' , function(ledger_closed) {
	// console.log(ledger_closed);
	var divNum = streamConnections.indexOf('ledger')+1;
	console.log(streamConnections);
	displayObject(ledger_closed,divNum);
});