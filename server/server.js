const app = require('express')();
const cors = require('cors')
const bodyParser = require('body-parser');
const Datastore = require('nedb'),
	tasks = new Datastore({filename:'tasks.db', autoload: true}),
	projects = new Datastore({filename:'projects.db', autoload: true});

app.use(cors());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(bodyParser.json());

// Käsitellään API kutsut
//app.get('/', (req, res) => res.send(''))

app.get('/projects', (req, res) => {
	projects.find({}, function(err, docs) {
		res.send(docs)
	})
})

app.post('/new_project', (req, res) => {

	if (typeof req.body.name === 'undefined')
		return
	
	req.body.time = new Date()
	projects.insert(req.body)

	res.json(req.body)
})

app.get('/tasks', (req, res) => {
	tasks.find({}, function (err, docs) {
		res.send(docs)
	})
})

app.post('/new_task', (req, res) => {

	if (typeof req.body.project === 'undefined')
		return

	req.body.time = new Date()
	req.body.status = true

	console.log(req.body)
	tasks.insert(req.body, function(err) {
		console.log(err)
	})

	res.json(req.body)

})

app.post('/update_task', (req, res) => {
	
	tasks.update({_id:req.body._id}, req.body, function (err, num) {
		console.log(err)
	})
})

const port = process.env.PORT ? process.env.PORT : 8081;
const server = app.listen(port, () => {
	console.log("Server listening port %s", port);
});

