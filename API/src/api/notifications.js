import resource from 'resource-router-middleware';
import Notif from '../models/notifications';
import moment from 'moment'

export default ({ config }) => {
	let rsrc = resource({

		/** Property name to store preloaded entity on `request`. */
		id : 'notification',

		/** For requests with an `id`, you can auto-load the entity.
		*  Errors terminate the request, success sets `req[id] = data`.
		*/
		load(req, id, callback) {
			let notif = Notif.findOne({_id: id}),
			err = notif ? null : err;
			callback(err, notif);
		},

		/** GET / - List all entities */
		index({ query }, res) {
			Notif.find(query, function(err, notifs){
				if(err) res.json(err)
				res.json(notifs)
			})

		},

		/** POST / - Create a new entity */
		create({ body }, res) {
			let notif = new Notif(body)
			notif.save(function(err, notifSave){
				if(err) res.error(err)
				res.json(notifSave)
			})
		},

		/** GET /:id - Return a given entity */
		read(req, res) {
			Notif.findById(req.params.notification, function(err, notif){
				if(err) return err
				res.json(notif)
			})
		},

		/** PUT /:id - Update a given entity */
		update({ notification, body }, res) {
			for (let key in body) {
				if (key!=='id') {
					notification[key] = notification[key];
				}
			}
			res.sendStatus(204);
		},

		/** DELETE /:id - Delete a given entity */
		delete(req, res) {
			Notif.remove({_id: req.params.id},(err) => {
				if(err) res.error(err)
				res.sendStatus(204)
			});
		}
	})

	return rsrc
}
