const 	express 		= 	require('express'),
		app 			= 	express(),
		contact 		= 	require('./routes/contactRoutes'),
		bodyParser 		= 	require('body-parser'),
		mongoose 		=	require('mongoose'),
		Group			=	require('./models/group'),
		Contact     	=	require('./models/contact'),
		session			= 	require('express-session'),
		flash			= 	require('connect-flash'),
		dotenv			= 	require('dotenv');


dotenv.config();

mongoose.connect(
	// 'mongodb://localhost:27017/contacts'
	process.env.DATABASEURL
	,{useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

db.on('error',console.error.bind(console,'Connection error: '));

db.once('open',function(){
	console.log('Connected to Database');
});

app.use(session ({cookie: {maxAge: 6000},
			secret: 'any',
			resave: false,
			saveUninitialized: false
		}));

app.use(flash());

app.use(function(req,res,next){
	res.locals.successMessage = req.flash('success');
	res.locals.errorMessage = req.flash('error');
	res.locals.contactName = req.flash('contactName');
	res.locals.contactLastname = req.flash('contactLastname');
	res.locals.contactNumber = req.flash('contactNumber');
	res.locals.contactEmail = req.flash('contactEmail');
	res.locals.contactGroup = req.flash('contactGroup');
	next();
});

// Contact.remove({},function(error,removed){
// 	console.log('contacts removed');
// });


app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine','ejs');

app.use(express.static('public'));

app.use(contact);

app.listen(process.env.PORT || 3000, process.env.IP);