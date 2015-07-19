// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var ExpApp = angular.module('Expenses', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });

})

ExpApp.controller( 'ExpCtrl', 
	function( $scope ){

		// connect to LOCAL PouchDB
		$scope.db = new PouchDB('pdbExpenses');

		// connect to REMOTE PouchDB
		$scope.rdb = new PouchDB('https://alexeyr.cloudant.com/pdbexpenses');
		//$scope.rdb.info().then(function (info) { console.log(info); }) // log rdb info
		
		$scope.repl2rem = function () {

			$scope.db.replicate.to($scope.rdb).on('complete', function () {
			  // yay, we're done!
			  //alert( "Replication TO looks good!")
			  console.log( "Сохранено!")
			}).on('error', function (err) {
			  // boo, something went wrong!
			  console.log( "Error replication:\n" + err + "\n----------\n")
			});
		
		}

		$scope.repl2loc = function () {

			$scope.db.replicate.from($scope.rdb).on('complete', function () {
			  // yay, we're done!
			  alert( "Загружено!")
			  console.log( "Replication FROM looks good!")
			}).on('error', function (err) {
			  // boo, something went wrong!
			  console.log( "Error replication:\n" + err + "\n----------\n")
			});
		
		}
		
		// predefined categories
		$scope.aCats = ['Еда', 'Напитки', 'Вкусное', 'Спитрное', 'Телефон', 
					'Интернет', 'Развлечения', 'Книги', 'Учеба', 'Транспорт',
					'Машина', 'Квартира', 'Хобби', 'Медицина', 'Бытовые' ];
		
		// set to $scope
		$scope.nCost = {val:null};

		// Reset to NULL cost
		$scope.ClearCost = function() {
			$scope.nCost.val = null;
		}

		
		// Loaded list of expenses
		$scope.aExpList = []; // test to see in functions [{ExpId:-1, ExpName:"none"}];
		
		$scope.getExp = function() {
			//alert( "Нажали!" );
			// Single doc from db
			/*$scope.db.get('TS1437259962972').then(function (doc) {
				console.log( JSON.parse( JSON.stringify(doc) ) );
				alert( "Got doc: " //+ JSON.stringify(doc) 
					+ "Name: \"" + doc.ExpName + "\" with id: " + doc.ExpId )
			});
			*/
			
		};

		$scope.getAllExp = function() {
			// All docs from db
			$scope.db.allDocs( {include_docs: true} ).then(function (doc) {

				//$scope.nCost = -500;
				//console.log( "Nums: " + doc.rows.length + "\n" + doc.rows );

				$scope.aExpList = [];
				for( var i=0; i < doc.rows.length; i++) {
								
					$scope.aExpList.push( doc.rows[i].doc );
					console.log( "Explist ["+ i +"] "+ $scope.aExpList[i] );
			
					/*console.log( "["+ doc.rows[i].doc.ExpId +"]: "
					+ doc.rows[i].doc.ExpName + " > "
					+ doc.rows[i].doc._id +" > "
					+ doc.rows[i].doc._rev +"\n");*/
				}
					
				//console.log( JSON.stringify(doc) );
				//console.log( JSON.parse( JSON.stringify(doc) ) );
			});

		}

		
		$scope.addExp = function( item ) {
			
			var ts = new Date().getTime();
			var milliseconds = "TS" + ts;

			var dDate = new Date;
			
			var nYear = dDate.getFullYear();
			var nDay = dDate.getDate();
			var nMon = dDate.getMonth();
			if( nMon < 10 ) { nMon = "0" + (nMon+1) }
			if( nDay < 10 ) { nDay = "0" + (nDay+1) }
			var ExpDate = nYear + "-" + nMon + "-" + nDay;

			var nHour = dDate.getHours();
			var nMin = dDate.getMinutes();
			if( nHour < 10 ) { nHour = "0" + (nHour+1) }
			if( nMin < 10 ) { nMin = "0" + (nMin+1) }
			var ExpTime = nHour + ":" + nMin;
		
			//alert("EspDate: " + ExpDate + "ExpTime: " + ExpTime );

			var doc = { 
				"_id" : milliseconds,
				"ExpId" : item,
				"ExpName" : $scope.aCats[item],
				"ExpCost" : $scope.nCost.val,
				"ExpDate" : ExpTime,
				"ExpTime" : ExpDate
				}
			
			$scope.db.put( doc ).then( $scope.getAllExp() );
			//console.log( "Added: " + JSON.stringify( doc ) );
			
			$scope.nCost.val = null;
			
			/*$scope.db.info().then(function (info) {
				console.log(info);
			})*/

			//$scope.getAllExp(); // load list of expenses
		}
		

		/* Init variables */
		$scope.getAllExp(); // load list of expenses
		
	});


