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
    let s = new Log({action: 'told Google Assistant', what: "\""+req.params.sentence+"\"", when: Date(), where: 'my room', user: "Jason Stillerman"})
    s.save((err, log) => {
      if(err) return err
      res.json(log)
    })
  })

	return assistant;
}
