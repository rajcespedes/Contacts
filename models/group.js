 const express = require('express'),
 		router = express.Router(),
 		mongoose = require('mongoose');



 var groupSchema = new mongoose.Schema({
 	name: String
 });


 module.exports = mongoose.model('Group',groupSchema);