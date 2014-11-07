
Attention, les commandes listés ci-dessous ne sont pas toutes prisent en charge par ripple-lib!

=>https://ripple.com/build/rippled-apis/#list-of-public-commands

Liste des commandes prisent en charge par ripple-lib:
=>https://github.com/ripple/ripple-lib/blob/develop/docs/REFERENCE.md#server-requests

Les paramètres utilisés comme exemples pour les requêtes du module se trouvent dans
=>requestParameters.js 

Les commandes nécessitant d'être signées ne sont pas traitées par ce module (payment,création de compte)

////////////////////////////////////PROBLEMES CONCERNANTS LA DOCUMENTATION///////////////////

Les paramètres en entrée de ripple-lib sont parfois différents des paramètres de l'api rippled

Exemple: 
	Ripple-lib
		ripple_path_find : {
				...
			src_account: "rGd4FaNjg22Ev..."
		}
	Rippled API
		ripple_path_find : {
				...
			source_account: "rGd4FaNjg22Ev..."
		}

Conclusion: tester des requètes avec https://ripple.com/build/websocket-tool/#ripple_path_find
ne garanti pas que la requète sera correctement formée pour ripple-lib

Vérifier dans la doc de ripple-lib et prier pour que le format de la requête soit documenté: https://github.com/ripple/ripple-lib/blob/develop/docs/REFERENCE.md#transaction-requests

Dernier écueil: la doc de ripple-lib renvoie sur le wiki pour la formation des requètes. MAIS LE WIKI DOCUMENTE l'API Rippled, pas forcément correctement l'interface ripple-lib. (exemple de mauvais doc pour ripple_find_path: https://wiki.ripple.com/JSON_Messages#path_find) 

/////////////////////////////////////NOTES/////////////////////////////////////////////////

Liste des choses qui ne marchent pas/ pètent couille à configurer

	transaction_entry => probablement paramètres mal configurés. Mal documenté.
	tx => //
	unl_list => admin ?



Liste des choses spéciales à requêter en admin

	remote.requestPeers
	unl_add
	unl_delete
	wallet_accounts

Liste des choses mystiques 

	account_balance  ==> résultat mystique, non documenté, seule référence ici :https://github.com/ripple/ripple-lib/blob/develop/src/js/ripple/amount.js    
	Responsable du mystère: https://github.com/boxbag

	ripple_balance ==> même format que account_balance. moi pas comprendre. value en drops ? sens des champs?? pas documenté

	owner_count ==> renvoie le nombre de currency du solde +1 (ex:tu possèdes xrp,btc,usd ==> 4) (hypothèse: le +1 compte pour la réserve)

Liste des choses potentiellement buguées

	transaction_entry =>{ error: 'remoteError',
  						error_message: 'Remote reported an error.',remote: 
   						{ error: 'internal',
     					error_code: 59,
     		=> Bug ripple-lib ?


