import resource from 'resource-router-middleware';
import Log from '../models/logs';
import Notif from '../models/notifications'
import moment from 'moment'

export default ({ config }) => {
	let rsrc = resource({

		/** Property name to store preloaded entity on `request`. */
		id : 'log',

		/** For requests with an `id`, you can auto-load the entity.
		*  Errors terminate the request, success sets `req[id] = data`.
		*/
		load(req, id, callback) {
			let log = Log.findOne({id: id}),
			err = log ? null : err;
			callback(err, log);
		},

		/** GET / - List all entities */
		index({ query }, res) {
			Log.find(query, function(err, logs){
				console.log('found');
				if(err) res.error(err)
				res.json(logs)
			})

		},

		/** POST / - Create a new entity */
		create({ body }, res) {
			//body.id = logs.length.toString(36);
			if (body.action === 'added the song') { //if its from spotify ifttt
				let guts = body.when.split(' ') // [ 'December', '9,', '2017', 'at', '08:38PM' ]
				let hours = parseInt(guts[4].substring(0, 2)) + (guts[4][5] === "P" ? 12 : 0) - 19// get the hours and if its PM, add 12, subtract 19 for timezone
				let mins = parseInt(guts[4].substring(3, 5)) // parse minutes
				body.when = moment().month(guts[0]).date(parseInt(guts[1][1])).year(guts[2]).hour(hours).minute(mins).toDate()
			}
			let loggy = new Log(body)
			loggy.save(function(err, obj){
				if(err) res.error(err)
				res.json(obj)
			})
		},

		/** GET /:id - Return a given entity */
		read(req, res) {
			Log.findById(req.params.log, function(err, log){
				if(err) return err
				res.json(log)
			})
		},

		/** PUT /:id - Update a given entity */
		update(req, res) {
			Log.findById(req.params.log, (err, log) => {
				let newComments = req.body.comments.diff(log.comments || [])
				newComments.forEach(comment => {
					let notif = new Notif(comment)
					notif.save()
				})
				for (let key in req.body) {
					if (key!=='_id') {
						log[key] = req.body[key];
					}
				}
				log.save((err, log) => {
					if(err) {
						console.log(err)
						res.send(err)
					}
					else {
						console.log('updated log ' + log._id)
						res.sendStatus(204)
					}
				})
			})
		},

		/** DELETE /:id - Delete a given entity */
		delete(req, res) {
			Log.remove({_id: req.params.log},(err) => {
				if(err) res.error(err)
				res.sendStatus(204)
			});
		}
	})

	rsrc.get('/:id/end', (req, res) => {
		Log.findById(req.params.id, function(err, log){
			log.endTime = Date()
			log.duration = moment(log.endTime).diff(moment(log.when), 'minutes')
			log.ongoing = false
			log.save()
			res.json(log)
		})
	})

	return rsrc
}

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};


function trash(log) {
	console.log(log.id)
	return
}
