import resource from 'resource-router-middleware';
import Person from '../models/people';
import moment from 'moment'

export default ({ config }) => {
	let rsrc = resource({

		/** Property name to store preloaded entity on `request`. */
		id : 'person',

		/** For requests with an `id`, you can auto-load the entity.
		*  Errors terminate the request, success sets `req[id] = data`.
		*/
		load(req, id, callback) {
			let person = Person.findOne({id: id}),
			err = person ? null : err;
			callback(err, person);
		},

		/** GET / - List all entities */
		index({ query }, res) {
			Person.find(query, function(err, people){
				if(err) res.error(err)
				res.json(people)
			})

		},

		/** POST / - Create a new entity */
		create({ body }, res) {
			let loggy = new Person(body)
			loggy.save(function(err, obj){
				if(err) res.error(err)
				res.json(obj)
			})
		},

		/** GET /:id - Return a given entity */
		read(req, res) {
			Person.findById(req.params.person, function(err, person){
				if(err) return err
				res.json(person)
			})
		},

		/** PUT /:id - Update a given entity */
		update({ person, body }, res) {
			for (let key in body) {
				if (key!=='id') {
					person[key] = body[key];
				}
			}
			res.sendStatus(204);
		},

		/** DELETE /:id - Delete a given entity */
		delete(req, res) {
			Person.remove({_id: req.params.person},(err) => {
				if(err) res.error(err)
				res.sendStatus(204)
			});
		}
	})

	rsrc.get('/:id/end', (req, res) => {
		Person.findById(req.params.id, function(err, person){
			person.endTime = Date()
			person.duration = moment(person.endTime).diff(moment(person.when), 'minutes')
			person.ongoing = false
			person.save()
			res.json(person)
		})
	})

	return rsrc
}

function trash(person) {
	console.person(person.id)
	return
}
