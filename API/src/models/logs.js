var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useMongoClient: true, promiseLibrary: global.Promise });

var Log = mongoose.model('Log', {
	action: String,
	what: String,
	where: String,
	when: Date,
	photo: String,
	ongoing: Boolean,
	intensity: Number,
	price: Number,
	duration: Number, //in minutes
	pointColor: String,
	data: String,
	endTime: String,
	who: [String],
	tags: [String],
	user: String,
	pos: Object,
	url: String
});

// Allow any schema
//var Log = new mongoose.model('Log', { any: mongoose.Schema.Types.Mixed });

export default Log
