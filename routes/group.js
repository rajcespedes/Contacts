const mongoose = require('mongoose');


var groupSchema = new mongoose.Schema({
	name: String
});


module.exports = mongoose.model('Group',groupSchema);