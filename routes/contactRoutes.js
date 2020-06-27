const 	express 		= require('express'),
		router 			= express.Router(),
		bodyParser		= require('body-parser'),
		Contact 		= require('../models/contact'),
		methodOverride	= require('method-override'),
		Group       	= require('../models/group');


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
var inputName = "";
var inputNumber = "";
// var contactHold;

router.post('/contacts',function(req,res){
	inputName = req.body.contact['name'];
	inputNumber = req.body.contact['number'];
	contactHold = req.body.contact;
	if (!validateNumber.test(inputName)){
			if(validateNumber.test(inputNumber)) {
				Contact.create(req.body.contact,function(err,contact){
				if(!err){
					Group.create(req.body.contact['group'],function(err,newGroup){
						if(!err) {

						} else {
							console.log(err);
						}
					});
					contact.group.name = req.body.contact['group']['name'];
					contact.save();
					req.flash('success','Nuevo contacto agregado');
					res.redirect('/contacts');
				} else {
					req.flash('error',err);
					res.redirect('/contacts');			
				}
				});
			} else {
				req.flash('error','Formato incorrecto de número');
				req.flash('contactName',req.body.contact['name']);
				req.flash('contactLastname',req.body.contact['lastname']);
				req.flash('contactEmail',req.body.contact['email']);
				req.flash('contactGroup',req.body.contact['group']['name']);
				res.redirect('/contacts/new');
				}
	} else {
		req.flash('error','Formato incorrecto de nombre');
		req.flash('contactLastname',req.body.contact['lastname']);
		req.flash('contactNumber',req.body.contact['number']);
		req.flash('contactEmail',req.body.contact['email']);
		req.flash('contactGroup',req.body.contact['group']['name']);
		res.redirect('/contacts/new');
	}

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
			req.flash('success','Contacto eliminado');
			res.redirect('/contacts');
		} else {
			console.log(err);
		}
	});
});

router.put('/contact/:id',function(req,res){
	inputName = req.body.contact['name'];
	inputNumber = req.body.contact['number'];
	if(!validateNumber.test(inputName)) {
		if(validateNumber.test(inputNumber)) {
			Contact.findByIdAndUpdate(req['params']['id'],req.body.contact,function(err,edited){
				if(!err){
					req.flash('success','Contacto editado');
					res.redirect('/contacts');		
				} else {
					console.log(err);
					}
			});

		} else {
			req.flash('error','Formato incorrecto de número');
			res.redirect(`/contact/${req['params']['id']}/edit`)
		}

	} else {
		req.flash('error','Formato incorrecto de nombre');
		res.redirect(`/contact/${req['params']['id']}/edit`);
	}

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