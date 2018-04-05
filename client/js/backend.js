
var db = axios.create({
	baseURL: server_url
})

async function GetFromServer(get_what) {
	app[get_what] = (await db.get(get_what)).data
}

function PostToServer(post_what, content, callback) {
	db.post(post_what, content)
			.then(function(response) {
				if (callback)
					callback()
		})
}
