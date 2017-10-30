var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useMongoClient: true, promiseLibrary: global.Promise });


var Person = mongoose.model('Person', {
	name: String
});


// Allow any schema
//var Log = new mongoose.model('Log', { any: mongoose.Schema.Types.Mixed });

export default Person
