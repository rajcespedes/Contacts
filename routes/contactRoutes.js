const 	express 		= require('express'),
		router 			= express.Router(),
		bodyParser		= require('body-parser'),
		Contact 		= require('../models/contact'),
		methodOverride	= require('method-override'),
		Group       	= require('../models/group'),
		session			= require('express-session'),
		flash			= require('connect-flash');



router.use(session ({cookie: {maxAge: 6000},
			secret: 'any',
			resave: false,
			saveUninitialized: false
		}));

router.use(flash());

router.use(function(req,res,next){
	res.locals.successMessage = req.flash('success');
	res.locals.errorMessage = req.flash('error');
	next();
});

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


var validateNumber = /\d+/;
var inputNumber = "";

router.post('/contacts',function(req,res){
	inputNumber = req.body.contact['number'];
	console.log(validateNumber.test(inputNumber));
	// if(validateNumber.test(inputNumber)) {
	Contact.create(req.body.contact,function(err,contact){
		if(!err){
			Group.create(req.body.contact['group'],function(err,newGroup){
				if(!err) {
					res.redirect('/contacts');		
				}
			});
			contact.group.name = req.body.contact['group'];
			contact.save();
			req.flash('success','Nuevo contacto agregado');
			res.redirect('/contacts');
		} else {
			console.log(err);
			
		}
	});
	// } else {
		// req.flash('error','Formato incorrecto de número');
	// }
});

router.get('/new',function(req,res){
	res.render('newContact');
});

router.get('/contact/:id/edit',function(req,res){
	Contact.findById(req['params']['id']).populate('group').exec(function(err,found){
		if(!err){
			res.render('edit', { contact: found });
		} else {
			console.log(err);
		}
	});
});

router.delete('/contact/:id',function(req,res){
	Contact.findByIdAndRemove(req['params']['id'],function(err,deleted){
		if(!err) {
			res.redirect('/contacts');
		} else {
			console.log(err);
		}
	});
});

router.put('/contact/:id',function(req,res){
	inputNumber = req.body.contact['number'];
	console.log(validateNumber.test(inputNumber));
	Contact.findByIdAndUpdate(req['params']['id'],req.body.contact,function(err,edited){
		if(!err){
				res.redirect('/contacts');		
		}
		 else {
			console.log(err);
		}
	});
});



router.get('/contact/:id',function(req,res){
	Contact.findById(req['params']['id'],function(err,found){
		if(!err){
			res.render('show',{ contact: found });
		} else {
			console.log(err);
		}

	});
});


module.exports = router;