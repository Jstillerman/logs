import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import people from './people'
import logs from './logs'
import multer from 'multer'
import notifs from './notifications'
import Log from '../models/logs'
import Notif from '../models/notifications'
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
		Log.find(req.query, (err, all) => {
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
    Log.find({action: req.params.action, user: req.query.user}, (err, logs) => {
      if(err) return err
      var stats = {}
      stats.attrs = []
      logs.forEach(log => {
        Object.keys(log.toObject()).forEach(key => {
          if(stats.attrs.indexOf(key) == -1) stats.attrs.push(key)
          if(Array.isArray(log[key])) {
            log[key].forEach(val => {
              if(!stats[key]) stats[key] = {}
              if(!stats[key][val]) stats[key][val] = 0
              stats[key][val] ++
            })
          }
          else if(key != "_id"){
            let val = log[key].toString().toLowerCase()
            if(!stats[key]) stats[key] = {}
            if(!stats[key][val]) stats[key][val] = 0
            stats[key][val] ++
          }

        })
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
    Log.find({"when": {"$gte": d.toDate(), "$lt": d.add(1, 'days').toDate()}, user: req.query.user}, (err, logs) => {
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
    Log.find({user: req.query.user}, (err, logs) => {
      var aggr = {}
      logs.forEach(log => {
        var name = moment(log.when).add(-5, 'hours').format('ddd MMM Do')
        if(!aggr[name]) aggr[name] = {}
        if(!aggr[name].logs) aggr[name].logs = []
        aggr[name].logs.push(log)
        aggr[name].date = name
      })
      res.json(Object.keys(aggr).map(key => aggr[key]))
    })
  })

  api.get('/alacazam', (req, res) => {
    Log.find({action: 'worked on', what: 'logs'}, (err, logs) => {
      logs.forEach(log => {
        log.what = 'lumberjack'
        log.save()
      })
      res.json(logs)
    })

    Notif.remove({})
  })

  api.get('/weekdata/', (req, res) => {
    Log.find({user: req.query.user}, (err, logs) => {
      var aggr = {}
      logs.forEach(log => {
        var name = moment(log.when).add(-5, 'hours').format('ddd MMM Do')
        var keyname = moment(log.when).add(-5, 'hours').week()
        if(!aggr[keyname]) aggr[keyname] = {}
        if(!aggr[keyname].logs) aggr[keyname].logs = []
        aggr[keyname].logs.push(log)
        aggr[keyname].date = name
      })
      res.json(Object.keys(aggr).map(key => aggr[key]))
    })
  })

  api.get('/aggrdata/:days', (req, res) => {
    Log.find({user: req.query.user}, (err, logs) => {
      var thisYear = (new Date()).getFullYear();
      var start = new Date("1/1/" + thisYear);
      var defaultStart = moment(start.valueOf())

      var aggr = {}
      logs.forEach(log => {
        //var name = moment(log.when).add(-5, 'hours').format('ddd MMM Do')
        var keyname = Math.floor(moment(log.when).add(-5, 'hours').diff(defaultStart, 'days') / req.params.days)
        if(!aggr[keyname]) aggr[keyname] = {}
        if(!aggr[keyname].logs) aggr[keyname].logs = []
        aggr[keyname].logs.push(log)
      //  aggr[keyname].date = name
      })

      Object.keys(aggr).forEach(key => {
        //Get the first part of the date
        aggr[key].date = moment(aggr[key].logs[0].when).format('ddd MMM Do')
        //and the second
        aggr[key].date += (' - ' + moment(aggr[key].logs[aggr[key].logs.length - 1].when).format('ddd MMM Do'))
      })
      res.json(Object.keys(aggr).map(key => aggr[key]))
    })
  })

	api.use('/logs', logs({ config, db}));
  api.use('/people', people({ config, db}));
  api.use('/notifications', notifs({ config, db}));

	api.post('/upload', upload.array('img', 3), (req, res) => {
		 return res.end("File uploaded sucessfully!.");

	})

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
