var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useMongoClient: true, promiseLibrary: global.Promise });


var Notif = mongoose.model('Notification', {
	log: String, // ID string
	user: String,
	actor: String,
	action: String, // Commented, Posted, Starred etc
	when: Date,
	content: String
});


// Allow any schema
//var Log = new mongoose.model('Log', { any: mongoose.Schema.Types.Mixed });

export default Notif
