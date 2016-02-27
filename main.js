var async = require('async');

function importDatabase(jsonData, Set, Card) {
	return new Promise(function(resolve, reject) {
		var setList = [];

		for (var setKey in jsonData) {
			setList.push(jsonData[setKey]);
		}

		// Remove the old sets
		console.log('Removing old sets');
		Set.remove({}, function(err) {
			if (err) { throw err; }
			console.log('Sucessfully removed old sets, re-adding');
			async.each(setList, function(set, setCallback) {
				// Remove cards from the set
				var cards = set.cards;
				delete set.cards;

				// Create and save new set
				var newSet = new Set(set);
				newSet.save(function(err) {
					if (err) { throw err; }
					console.log('Saved set: ' + set.name + ', saving cards...');

					async.each(cards, function(card, cardCallback) {
						// Create and save each individual card
						var newCard = new Card(card);
						newCard.save(function(err) {
							if (err) { throw err; }
							cardCallback();
						});
					}, setCallback);
				});
			}, function() {
				console.log('Import complete');
			});
		});
	});
}

module.exports = importDatabase;
