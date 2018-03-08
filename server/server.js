const app = require('express')();
const cors = require('cors')
const bodyParser = require('body-parser');
const Datastore = require('nedb'),
	db = new Datastore({ filename: 'tietokanta.db', autoload: true});

app.use(cors());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(bodyParser.json());

// Käsitellään API kutsut

app.get('/', (req, res) => res.send(''))
app.get('/tasks', (req, res) => {
	db.find({}, function (err, docs) {
		res.send(docs)
	})
})
app.post('/new_task', (req, res) => {
	req.body.time = new Date()

	db.count({}, function(err, count) {
		req.body._id = (count+1).toString()
	})
	
	db.insert(req.body)

	res.json(req.body)

})

const port = process.env.PORT ? process.env.PORT : 8081;
const server = app.listen(port, () => {
	console.log("Server listening port %s", port);
});

