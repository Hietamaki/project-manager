import axios from 'axios'
import {server_url} from '../../config.js'

const db = axios.create({
	baseURL: server_url,
})

var Get = async function (get_what) {
	return (await db.get(get_what)).data
}

function Query(method, what, content, callback) {
	db({
		method: method,
		url: what,
		data: content
	}).then(() => {
		if (callback) {
			callback()
		}
	});
}

export default {
	Get,
	Delete(what, content, callback) {
		Query("delete", what, content, callback)
	},
	Post(what, content, callback) {
		Query("post", what, content, callback)
	},
	Put(what, content, callback) {
		Query("put", what, content, callback)
	},
}