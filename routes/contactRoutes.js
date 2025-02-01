const 	express 		= require('express'),
		router 			= express.Router(),
		bodyParser		= require('body-parser'),
		Contact 		= require('../models/contact'),
		methodOverride	= require('method-override'),
		Group       	= require('../models/group');


router.use(methodOverride('_method'));


router.get('/',(req,res) => {
	return new Promise ((resolve) => {
		res.redirect('/contacts');
		resolve();
	})
});

router.get('/contacts',(req,res) => {
	Contact.find({})
	.then(foundContact => {
		res.render('index',{contact: foundContact});
	})
	.catch(err => {
		console.log('err');
	})
});

router.get('/contacts/new', (req,res) => {
	return new Promise ((resolve) => {
		res.render('newContact');
		resolve();
	}
)	
});


var validateNumber = /\d+/;
var inputName = "";
var inputNumber = "";
// var contactHold;

router.post('/contacts', async (req,res, next) => {
	try { 

	inputName = req.body.contact['name'];
	inputNumber = req.body.contact['number'];
	contactHold = req.body.contact;

	if (validateNumber.test(inputName)){
		req.flash('error','Formato incorrecto de nombre');
		req.flash('contactLastname',req.body.contact['lastname']);
		req.flash('contactNumber',req.body.contact['number']);
		req.flash('contactEmail',req.body.contact['email']);
		req.flash('contactGroup',req.body.contact['group']['name']);
		res.redirect('/contacts/new');
	}

	if(!validateNumber.test(inputNumber)){
		req.flash('error','Formato incorrecto de número');
		req.flash('contactName',req.body.contact['name']);
		req.flash('contactLastname',req.body.contact['lastname']);
		req.flash('contactEmail',req.body.contact['email']);
		req.flash('contactGroup',req.body.contact['group']['name']);
		res.redirect('/contacts/new');
	}

	const contact = await Contact.create(req.body.contact);

	if(req.body.contact.group){
		const newGroup = await Group.create(req.body.contact.group);
		contact.group = newGroup._id;
		await contact.save();
	}

	req.flash('success','Nuevo contacto agregado');
	res.redirect('/contacts');

	}
	catch(err) {
		console.error('Error creando contacto', err);
		req.flash('error',err);
		res.redirect('/contacts');	
	}
});

router.get('/new', (req,res) => {
	return new Promise ((resolve) => {
		res.render('newContact');
		resolve();
	})
});

router.get('/contact/:id/edit', (req,res) => {
	Contact.findById(req['params']['id']).populate('group').exec()
	.then( found => {
		res.render('edit', { contact: found });
		})
	.catch( err => {
		console.log(err);
		});

	});

router.delete('/contact/:id', (req,res) => {
	Contact.findByIdAndRemove(req['params']['id'])
		.then( deleted => {
			req.flash('success','Contacto eliminado');
			res.redirect('/contacts');
		})
		.catch( err => {			
			console.log(err);
			}
		)
});

router.put('/contact/:id', async (req,res) => {
	
	try { 

		const {name, number} = req.body.contact;
		const contactId = req.params.id;


		if(validateNumber.test(name)) {
			req.flash('error', 'Formato incorrecto de nombre');
			res.redirect(`/contact/${contactId}/edit`);
		}

		if(!Contact.validate.test(number)) {
			req.flash('error', 'Formato incorrecto de número');
			res.redirect(`/contact/${contactId}/edit`);
		}

		const editeContact = await Contact.findByIdAndUpdate(contactId, req.body.contact, {new: True});

		if (!editedContact) {
			req.flash('error', 'No se encontró el contacto');
			return res.redirect('/contacts');
		}


	req.flash('success','Contacto editado');
	res.redirect('/contacts');
} catch (err) {
	console.err('Error actualizando el contacto: ', err);
	req.flash('error','Ocurrió un error al editar el contacto');
	res.redirect((`/contact/${req.params.id}/edit`));
}


router.get('/contact/:id', (req,res) => {
	Contact.findById(req['params']['id'])
		.then( found => {
			res.render('show',{ contact: found });
		}) 
		.catch(err => {
			console.log(err);
		});
});

});


module.exports = router;