const 	express 		= 	require('express'),
		app 			= 	express(),
		contact 		= 	require('./routes/contactRoutes'),
		bodyParser 		= 	require('body-parser'),
		mongoose 		=	require('mongoose'),
		Group			=	require('./models/group'),
		Contact     	=	require('./models/contact');


mongoose.connect(process.env.DATABASEURL,{useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

db.on('error',console.error.bind(console,'Connection error: '));

db.once('open',function(){
	console.log('Connected to Database');
});


app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine','ejs');

app.use(express.static('public'));

app.use(contact);

app.listen(process.env.PORT || 3000, process.env.IP);