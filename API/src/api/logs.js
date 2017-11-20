import resource from 'resource-router-middleware';
import Log from '../models/logs';
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
		update({ log, body }, res) {
			for (let key in body) {
				if (key!=='id') {
					log[key] = body[key];
				}
				log.save(()=>{
					res.sendStatus(204);
				})
			}
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

function trash(log) {
	console.log(log.id)
	return
}
