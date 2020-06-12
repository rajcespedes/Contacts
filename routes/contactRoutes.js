const 	express 	= require('express'),
		router 		= express.Router(),
		bodyParser	= require('body-parser'),
		Contact 	= require('../models/contact');




router.get('/',function(req,res){
	res.redirect('/contacts');
});

router.get('/contacts',function(req,res){
	Contact.find({},function(err,foundContact){
		if(!err){
			console.log(foundContact._id);
			res.render('index',{contact: foundContact});
		} else {
			console.log('err');
		}
	});
	
});

router.get('/contacts/new',function(req,res){
	res.render('newContact');
});

router.post('/contacts',function(req,res){
	// console.log('contact is: ' + req.body.contact['name']);
	Contact.create(req.body.contact,function(err,contact){
		if(!err){
			// console.log('new contact added! ' + );
			contact.group.name = req.body.contact['group'];
			contact.save();
			res.redirect('/contacts');
		} else {
			console.log(err);
			
		}
	});
});

router.get('/new',function(req,res){
	res.render('newContact');
});

router.get('/contact/:id',function(req,res){
	console.log('id is: ' + req['params']['id']);
	Contact.findById(req['params']['id'],function(err,found){
		console.log(found);
		if(!err){
			res.render('show',{contact: found});
		} else {
			console.log(err);
		}

	});
	// res.send('show route');
	// Contact.findById(req['params']['id']).populate('group').exec(function(err,foundContact){
	// 	console.log(foundContact);
	// 	if(!err){
	// 		res.render('show',{contact: foundContact});
	// 	} else {
	// 		console.log(err);
	// 	}
	// });
});


module.exports = router;