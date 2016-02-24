var async = require('async');
var Set = require('node-mongo-mtg-card-models').Set.model;

function importDatabase(jsonData) {
	return new Promise(function(resolve, reject) {
		var setList = [];

		for (var setKey in jsonDatabase) {
			setList.push(jsonData[setKey]);
		}

		// Remove the old sets
		console.log('Removing old sets');
		Set.remove({}, function(err) {
			if (err) { throw err; }
			console.log('Sucessfully removed old sets, re-adding');
			async.eachSeries(setList, function(set, callback) {
				var newSet = new Set(set);
				newSet.save(function(err) {
					if (err) { throw err; }
					console.log('Saved set: ' + set.name);
					callback();
				});
			});
		});
	}
}

module.exports = importDatabase;
