const app = require('express')()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const dataStore = require('nedb')

const  tasks = new dataStore({filename:'tasks.db', autoload: true}),
	projects = new dataStore({filename:'projects.db', autoload: true})

app.use(cors())
app.use(bodyParser.json())

if (process.env.DEBUG !== undefined) {
	app.use(morgan((tokens, req, res) => {
		return [
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			JSON.stringify(req.body),
			tokens['response-time'](req, res), 'ms'
		].join(' ')
	}))
	console.log("Console debug logging on.")
}

// Providing RESTful API

// GET

app.get('/', (req, res) => res.send(''))

app.get('/projects', (req, res) => {
	projects.find({}).sort({ index: 1, time: 1}).exec((err, docs) =>  {
		res.send(docs)
	})
})

app.get('/tasks', (req, res) => {
	tasks.find({}).sort({ project: 1, index: 1 }).exec((err, docs) => {
		res.send(docs)
	})
})

// DELETE

app.delete('/task', (req, res) => {
	tasks.remove({_id:req.body._id}, {}, (err, docs) =>
		res.sendStatus(err === null ? 200 : 400)
	)
})

app.delete('/project', (req, res) => {
	projects.remove({_id:req.body._id}, {}, (err, docs) =>
		res.sendStatus(err === null ? 200 : 400)
	)
})

// POST

app.post('/project', (req, res) => {
	if (!ProjectIsValid(req.body))
		return res.sendStatus(400)

	req.body.created = new Date()
	req.body.modified = req.body.created

	projects.count({}, (err, count) => {
		req.body.index = count + 1

		projects.insert(req.body, (err) =>
			res.sendStatus(err === null ? 200 : 400)
		)
	})
})

app.post('/task', (req, res) => {
	if (!TaskIsValid(req.body))
		return res.sendStatus(400)

	req.body.created = new Date()
	req.body.modified = req.body.created
	req.body.status = true

	tasks.count({project: req.body.project}, (err, count) => {
		req.body.index = count + 1
	
		tasks.insert(req.body, (err) => 
			res.sendStatus(err === null ? 200 : 400)
		)
	})
})

// PUT

app.put('/project', (req, res) => {
	if (!ProjectIsValid(req.body))
		return res.sendStatus(400)

	req.body.modified = new Date()

	project.update({_id:req.body._id}, req.body, (err, num) =>
		res.sendStatus(err === null ? 200 : 400)
	)
})

app.put('/task', (req, res) => {
	if (!TaskIsValid(req.body))
		return res.sendStatus(400)
	
	req.body.modified = new Date()

	tasks.update({_id:req.body._id}, req.body, (err, num) => 
		res.sendStatus(err === null ? 200 : 400)
	)
})

app.listen(GetPort(), () =>
	console.log('Server listening port %s', GetPort())
)

function GetPort() {
	const port = process.env.PORT ? process.env.PORT : 2323

	if (port >> 16)
		console.log('Port is 16 bit long.')
	else if (!process.env.SUDO_UID && port < 1024)
		console.log('Ports < 1024 are reserved for system use.')
	else
		return port

	process.exit()
}

function TaskIsValid(task) {
	return task.desc !== undefined && task.project !== undefined
}

function ProjectIsValid(task) {
	return task.name !== undefined
}