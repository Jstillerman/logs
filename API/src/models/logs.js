var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useMongoClient: true, promiseLibrary: global.Promise });


var Log = mongoose.model('Log', {
	action: String,
	what: String,
	where: String,
	when: Date,
	ongoing: Boolean,
	intensity: Number,
	duration: Number, //in minutes
	pointColor: String,
	data: String,
	endTime: String,
	who: [String],
	tags: [String],
	user: String,
	pos: Object
});


// Allow any schema
//var Log = new mongoose.model('Log', { any: mongoose.Schema.Types.Mixed });

export default Log
