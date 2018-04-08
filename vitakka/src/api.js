import axios from 'axios'
import {server_url} from '../../config.js'

const db = axios.create({
	baseURL: server_url,
})

var Get = async function (get_what) {
	return (await db.get(get_what)).data
}

export default {
	Delete(post_what, content, callback) {
		//Bug in axios causes content to be stripped when using .delete() method
		//	https://github.com/axios/axios/issues/1083
		db({
			method: 'delete',
			url: 'task',
			data: content
		}).then( () => {
			if (callback) {
				callback()
			}
		});
	},
	Get,
	Post(post_what, content, callback) {
		db.post(post_what, content).then((response) => {
			if (callback) {
				callback()
			}
		})
	},
	Put(post_what, content, callback) {
		db.put(post_what, content).then((response) => {
			if (callback) {
				callback()
			}
		})
	},
}