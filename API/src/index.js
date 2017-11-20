import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import assistant from './assistant'
import config from './config.json';
import path from 'path'
import Log from './models/logs'

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({
	limit : config.bodyLimit
}));

app.use('/', express.static(path.join(__dirname, '../dist-client')));

// connect to db
initializeDb( db => {

	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));

	app.use('/assistant', assistant({ config, db }))

	app.post('/payload', (req, res) => {
		let e = new Log({user: "Jason Stillerman", action: "pushed to", what: "logs", when: Date()})
		e.save((err, log) => {
			if(err) return err
			res.json(log)
		})
	})
	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});
});

app.use('*', express.static(path.join(__dirname, '../dist-client')));
export default app;
