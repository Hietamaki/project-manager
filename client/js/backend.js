
var db = axios.create({
	baseURL: 'http://localhost:8081/'
})

async function GetFromServer(get_what) {
	app[get_what] = (await db.get(get_what)).data
}

function PostToServer(post_what, content, callback) {
	db.post(post_what, content)
			.then(function(response) {
				callback()
				app[post_what] = {project: ""}
		})
}
