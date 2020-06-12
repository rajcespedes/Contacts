const mongoose = require('mongoose');



var contactSchema = new mongoose.Schema({
	name: String,
	lastname: String,
	number: String,
	email: String,
	group: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Groups'
		},
		name: String
	}
});


module.exports = mongoose.model('Contact',contactSchema);