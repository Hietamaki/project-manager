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
	app.use(morgan('tiny'))
	console.log("Console debug logging on.")
}

// Käsitellään API kutsut

// GET

app.get('/', (req, res) => res.send(''))

app.get('/projects', (req, res) => {
	projects.find({}, (err, docs) => 
		res.send(docs)
	)
})

app.get('/tasks', (req, res) => {
	tasks.find({}, (err, docs) =>
		res.send(docs)
	)
})

// POST

app.post('/delete_task', (req, res) => {

	tasks.update({_id:req.body.taskid}, {}, (err, docs) => 
		res.sendStatus(err === null ? 200 : 400)
	)
})

app.post('/new_project', (req, res) => {

	if (req.body.name === undefined)
		return res.sendStatus(400)
	
	req.body.time = new Date()
	projects.insert(req.body, (err) => 
		res.sendStatus(err === null ? 200 : 400)
	)
})

app.post('/new_task', (req, res) => {

	if (!TaskIsValid(req.body))
		return res.sendStatus(400)

	req.body.time = new Date()
	req.body.status = true

	tasks.insert(req.body, (err) => 
		res.sendStatus(err === null ? 200 : 400)
	)
})

app.post('/update_task', (req, res) => {
	
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
	return task.desc === undefined || task.project === undefined
}