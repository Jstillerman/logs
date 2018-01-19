import { version } from '../../package.json';
import { Router } from 'express';
import multer from 'multer'
import Log from '../models/logs'
import moment from 'moment'

export default ({ config, db }) => {
	let assistant = Router();


	// perhaps expose some API metadata at the root
	assistant.get('/', (req, res) => {
		res.json({ version });
	});

  assistant.get('/:sentence', (req, res) => {
		let newLog = {}
		let sen = req.params.sentence.toLowerCase()
		if (sen.startsWith(' ')) sen = sen.substring(1)
		if (sen.includes('shower')) {
			newLog = {
				action: 'took a shower',
				where: 'bathroom',
				user: 'Jason Stillerman',
				ongoing: true,
				when: Date()
			}
		}
		else if (sen.includes('teeth') && sen.incudes('brush')) {
			newLog = {
				action: 'brushed teeth',
				user: 'Jason Stillerman',
				when: Date()
			}
		}
		else if (sen.startsWith('i ate')) {
			let food = sen.split(' ').slice(2) // drop the first two guys
			newLog = {
				action: 'ate',
				user: 'Jason Stillerman',
				when: Date(),
				what: food
			}
		}
		else {
			newLog = {action: 'told Google Assistant', what: "\""+req.params.sentence+"\"", when: Date(), where: 'my room', user: "Jason Stillerman"}
		}
    let s = new Log(newLog)
    s.save((err, log) => {
      if(err) return err
      res.json(log)
    })
  })

	return assistant;
}
