require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
process.chdir(require('path').join(__dirname, '..'));

var sails = require('sails');
sails.lift(require('sails/accessible/rc')('sails'));
