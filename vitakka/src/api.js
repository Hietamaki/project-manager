import axios from 'axios'
import { server_url } from '../../config'

const db = axios.create({
	baseURL: server_url,
})

const Get = async function Get(get_what) {
	return (await db.get(get_what)).data
}

function Query(method, url, data, callback) {
	db({ method, url, data }).then(() => {
		if (callback) {
			callback()
		}
	})
}

export default {
	Get,
	Delete(what, content, callback) {
		Query('delete', what, content, callback)
	},
	Post(what, content, callback) {
		Query('post', what, content, callback)
	},
	Put(what, content, callback) {
		Query('put', what, content, callback)
	},
}
