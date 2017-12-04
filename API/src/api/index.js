import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import people from './people'
import logs from './logs'
import multer from 'multer'
import Log from '../models/logs'
import moment from 'moment'


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(__dirname);
    cb(null, __dirname + '/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() +".png")
  }
})

var upload = multer({ storage: storage })

export default ({ config, db }) => {
	let api = Router();

  api.get('/logs/stats', (req, res) => {
		Log.find({}, (err, all) => {
			if(err) return err
			var stats = {
        freq: {},
        timeline: {}
      }
			all.forEach(log => {
				if(!stats.freq[log.action]) stats.freq[log.action] = 0
				stats.freq[log.action] ++
			})

      all.forEach(log => {
        if(!stats.timeline[log.action]) stats.timeline[log.action] = {}
        stats.timeline[log.action][log.when] = 0.5
      })

			res.json(stats)
		})
  })

  api.get('/logs/stats/:action', (req, res) => {
    Log.find({action: req.params.action}, (err, logs) => {
      if(err) return err
      var stats = {}
      stats.attrs = []
      logs.forEach(log => {
        for (var key in log.toObject()) {
          //console.log(`log.${prop} = ${log[prop]}`);
          key = key.toLowerCase()
          if(stats.attrs.indexOf(key) == -1) stats.attrs.push(key)
          if(key != "_id"){
            if(!stats[key]) stats[key] = {}
            if(!stats[key][log[key]]) stats[key][log[key]] = 0
            stats[key][log[key]] ++
          }

        }
      })
      res.json(stats)
    })
  })

  Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
  }

  api.get('/daydata/:time', (req, res) => {
    var d = moment(req.params.time).startOf('day').hours(5)
    console.log(req.params.time, d);
// TODO: Get This shit to actually work. when is all strings and it needs to be dates...
    Log.find({"when": {"$gte": d.toDate(), "$lt": d.add(1, 'days').toDate()}}, (err, logs) => {
      if(err) res.err(err)
      console.log('logs found:', logs.length);
      let status = {}
      status.breakfast = logs.filter(log => (log.action == "ate" && log.tags.includes('breakfast')))
      status.lunch = logs.filter(log => (log.action == "ate" && log.tags.includes('lunch')))
      status.dinner = logs.filter(log => (log.action == "ate" && log.tags.includes('dinner')))
      status.snacks = logs.filter(log => log.action == "ate").diff(status.lunch).diff(status.breakfast).diff(status.dinner)
      res.json({logs, status, date: d.format("MMM Do")})
    })
  })

  api.get('/daydata/', (req, res) => {
    Log.find({}, (err, logs) => {
      var aggr = {}
      logs.forEach(log => {
        var name = moment(log.when).add(-5, 'hours').format('MMM Do')
        if(!aggr[name]) aggr[name] = {}
        if(!aggr[name].logs) aggr[name].logs = []
        aggr[name].logs.push(log)
        aggr[name].date = name
      })
      res.json(Object.keys(aggr).map(key => aggr[key]))
    })
  })

	api.use('/logs', logs({ config, db}));
  api.use('/people', people({ config, db}));

	api.post('/upload', upload.array('img', 3), (req, res) => {
		 return res.end("File uploaded sucessfully!.");

	})

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
