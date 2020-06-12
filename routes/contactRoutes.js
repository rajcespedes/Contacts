const 	express 		= require('express'),
		router 			= express.Router(),
		bodyParser		= require('body-parser'),
		Contact 		= require('../models/contact'),
		methodOverride	= 	require('method-override');




router.use(methodOverride('_method'));


router.get('/',function(req,res){
	res.redirect('/contacts');
});

router.get('/contacts',function(req,res){
	Contact.find({},function(err,foundContact){
		if(!err){
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
	Contact.create(req.body.contact,function(err,contact){
		if(!err){
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

router.get('/contact/:id/edit',function(req,res){
	Contact.findById(req['params']['id']).populate('group').exec(function(err,found){
		if(!err){
			console.log(found.group.name);
			res.render('edit', { contact: found });
		} else {
			console.log(err);
		}
	});
});

router.delete('/contact/:id',function(req,res){
	// alert('¿Está seguro?');
	// res.redirect('/contacts');
	res.send('reached delete route');
});

router.put('/contact/:id',function(req,res){
	Contact.findByIdandUpdate(req['params']['id'],contact,function(err,edited){
		if(!err){
			res.redirect('/contacts');
		} else {
			console.log(err);
		}
	});
});



router.get('/contact/:id',function(req,res){
	Contact.findById(req['params']['id'],function(err,found){
		if(!err){
			res.render('show',{contact: found});
		} else {
			console.log(err);
		}

	});
});


module.exports = router;