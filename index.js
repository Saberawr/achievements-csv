'use strict';
const filepath = require('path');
const fs = require('fs');
require('./BigInt.js');

class acsv {
	constructor(mod) {
		this.mod = mod;
		this.command = mod.command;
		this.hook = null;
		var enabled = true;
		
		mod.command.add('acsv', () => {
			enabled = true;
			this.send(`achivements-csv is now re-enabled and your achievements will be written to a CSV file the next time you view your achievements window.`);
		});
		
		this.hook = mod.hook('S_LOAD_ACHIEVEMENT_LIST', 1, function(event) {
			if (!enabled) return;
			mod.command.message(`Your achievements are currently being written to a CSV file, please wait...`);
			
			let csvString = 'AchievementID,Completed';
			event.achievements.forEach(function(currentValue) {
				csvString += '\n';
				let timestamp = JSON.stringify(currentValue.completed);
				timestamp = timestamp.replace(/"/gi, '');
				timestamp = new Date(timestamp*1000).toLocaleString('en-US');
				timestamp = timestamp.replace(/,/gi, '');
				csvString += JSON.stringify(currentValue.id) + ',' + timestamp;
			});
			
			fs.writeFile(filepath.join(__dirname, 'achievements.csv'), csvString, err => {});
			enabled = false;
			
			mod.command.message(`Your completed achievements have been written to a CSV file, and achievements-csv is now disabled, run '/8 acsv' and open your achievements menu again if you'd like an updated copy.`);
		});
	};
	
	send(message) {
		this.command.message(': ' + message);
	};
	
	destructor() {
		this.command.remove('acsv');
		this.mod.unhook(this.hook);
		this.hook = null;
	};
};

module.exports = { NetworkMod: acsv };
