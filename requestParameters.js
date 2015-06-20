var requestParameters= {
	book_offers :  {
		taker_gets: {
	    	'currency':'XRP'
		},
		taker_pays: {
		    'currency':'USD',
		    'issuer': 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'
		}
	},

	orderbook : {
		BASE : {
            'currency':'USD',
            'issuer': 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',                 
        },
        TRADE : {
           	'currency':'XRP',
           	'issuer': null,
        }
	},

	ledger : {
	    command: "ledger",
	    full : true
	},

	ledger_entry : {
		id:1,
	    command: "ledger_entry",
	    ledger_index: {
  			type:"index",
  			index:9791313
	  	}

	},

	account_info : {
		account:"rGd4FaNjg22EvTuot3SRKF1suueUSc8Lhd"
	},

	account_lines : {
	    command: "account_lines",
	    account: "rGd4FaNjg22EvTuot3SRKF1suueUSc8Lhd",
	    ledger: "current",
	    limit:1
	},

	account_offers : {
	    command: "account_offers",
	    account: "rGd4FaNjg22EvTuot3SRKF1suueUSc8Lhd",
	    ledger: "current"
	},

	account_tx : {
	   command: "account_tx",
	   account: "rGd4FaNjg22EvTuot3SRKF1suueUSc8Lhd",
	   ledger_index_min: -1,
	   ledger_index_max: -1,
	   binary: false,
	   count: false,
	   descending: false,
	   offset: 0,
	   limit: 100,
	   forward: false
	},

	account_balance : {
		account: "rGd4FaNjg22EvTuot3SRKF1suueUSc8Lhd",
		ledger: "current"
	},
	owner_count : {
		account: "rGd4FaNjg22EvTuot3SRKF1suueUSc8Lhd",
		ledger: "current"
	},
	ripple_balance : {
		account: "rpsye7YABTmx881KEqeb6SADCLzJkGevHe",
		issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
		currency: "USD",
		ledger: "current"
	},
	transaction_entry : {		
		transaction_hash: "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
		ledger_hash:"231EAB18A13087D1E10E55EAAEAC8C6A5ED813C63028D2C0E045E573DC7BD687"
	},
	tx : {
		id: 5,
		command: "tx",
		transaction: "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7"
	},
	ripple_path_find : {
		id: 1,
		command: "ripple_path_find",
		src_account: "rGd4FaNjg22EvTuot3SRKF1suueUSc8Lhd",
		src_currencies: [
		    {
		      currency: "USD"
		    }
		  ],
		dst_account: "rpsye7YABTmx881KEqeb6SADCLzJkGevHe",
		dst_amount: {
		    value: "0.001",
		    currency: "USD",
		    issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
		  }
	}

};

module.exports = requestParameters;