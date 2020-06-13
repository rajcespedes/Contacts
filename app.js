const 	express 		= 	require('express'),
		app 			= 	express(),
		contact 		= 	require('./routes/contactRoutes'),
		bodyParser 		= 	require('body-parser'),
		mongoose 		=	require('mongoose'),
		Group			=	require('./models/group'),
		Contact     	=	require('./models/contact');


// mongoose.connect('mongodb://localhost:27017/contacts',{useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connect('mongodb+srv://user1:FKOWAHu7yrGXuOvT@cluster0-wmsar.mongodb.net/contacts?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

db.on('error',console.error.bind(console,'Connection error: '));

db.once('open',function(){
	console.log('Connected to Database');
});


app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine','ejs');

app.use(express.static('public'));

app.use(contact);

app.listen(3000);


// Contact.remove({},function(err){
// 	console.log('contacts removed');
// });

// Group.create({
// 	name: 'players'
// },function(err,createdGroup){
// 	if(!err) {
// 		console.log(createdGroup);
// 	} else {
// 		console.log(err);
// 	}
// });  