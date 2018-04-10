import axios from 'axios'
import { server_url } from '../../config'

const connection = axios.create({
	baseURL: server_url,
})

const Get = async function Get(what) {
	return (
		await connection.get(what)
	).data
}

// Callback is required after every sent packet, so that responses are handled properly
function Submit(method, url, data, callback) {
	connection({ method, url, data })
		.then((response) => {
			if (response.status === 200) {
				callback(response)
			}
		})
}

export default {
	Get,
	Delete(...params) {
		Submit('delete', ...params)
	},
	Post(...params) {
		Submit('post', ...params)
	},
	Put(...params) {
		Submit('put', ...params)
	},
}
