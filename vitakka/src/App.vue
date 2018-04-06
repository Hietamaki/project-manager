<template>
<div id='app' class='container content'>
	<!--<img src='./assets/logo.png'>-->
	<!--<router-view/>-->
	<div class='container'>
		<div class='content' v-for='project in projects' :key='project._id'>
			<h2>{{ project.name }}</h2>
			<ul>
				<ol v-for='task in tasks' v-if='task.project == project.name' :key='task._id'>
					<div>
						<b><span @click='ExpandTask(task._id)' :class='{ inactivetask: !task.status }'>
							{{ task.desc }}
						</span></b>

						<transition name='fade'>
							<div :ref='task._id' v-if='task._id == active_task'>
								<span @click='ChangeTaskStatus(task)'>👌</span>
								<span @click='DeleteTask(task._id)'>💀</span>
								<span v-if='editing._id != task._id' @click='editing = task'>
									<span v-if='task.notes'>{{ task.notes }}</span>
									<span v-else><i>[Lisää kuvaus]</i></span>
								</span>

								<transition name='slide-fade' @after-enter='$refs.notefield[0].focus()'>
									<div v-if='editing._id == task._id'>
										<textarea ref='notefield' v-model.trim='editing.notes' class='textarea' @keyup.ctrl.enter='UpdateTask()' @keyup.esc='editing = {}'></textarea>
										<input type='button' value='Muokkaa' class='button' @click='UpdateTask()'>
									</div>
								</transition>

								<ul>
									<ol v-for='{link, index} in task.links' :key='index'>
										<a :href='link[0]'>{{ link[1] }}</a>
									</ol>
								</ul>
							</div>

						</transition>
					</div>
				</ol>

				<ol>
					<transition name='fade' mode='out-in'>
						<div v-if='new_task.project != project.name' key='addnew'>
							<span @click='new_task.project = project.name'>
								(<b>+</b>) <i>Lisää uusi tehtävä</i>
							</span>
						</div>

						<div v-else key='editingnew'>
							<div class='columns'>
								<div class='column'>
									<input ref='newtaskfield' type='input' class='input' v-model='new_task.desc' @keyup.enter='NewTask' @keyup.esc = "new_task.project = ''">
								</div>
								<div class='column is-one-quarter'>
									<button class="button" @click="NewTask">Lisää</button>
								</div>
							</div>
						</div>
					</transition>
				</ol>
			</ul>
		</div>

		<div class='box'>
			<label class='label'>Lisää uusi projekti:</label>

			<div class='columns'>
				<div class='column'>
					<div class='field control'>
						<input type='text' class='input' v-model='new_project.name' @keyup.enter='NewProject'>
					</div>
				</div>

				<div class='field control column is-one-fifth'>
					<button class='button' @click='NewProject'>Lisää</button>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import axios from 'axios'
import {server_url} from './config.js'

const db = axios.create({
	baseURL: server_url,
})

export default {
	name: 'App',
	data() {
		return {
			active_task: '',
			editing: {},
			new_task: {
				project: '',
			},
			new_project: {},
			tasks: [],
			projects: [],
		}
	},
	methods: {
		ChangeTaskStatus(task_data) {
			task_data.status = !task_data.status
			this.PostToServer('update_task', task_data)
		},
		DeleteTask(taskid) {
			if (confirm('Haluatko poistaa tehtävän?')) {
				this.PostToServer('delete_task', { taskid }, this.GetTasks)
			}
		},
		ExpandTask(taskid) {
			this.active_task = this.active_task !== taskid ? taskid : ''
			this.editing = {}
		},
		NewProject() {
			this.PostToServer('new_project', this.new_project, this.GetProjects)
		},
		NewTask() {
			this.PostToServer('new_task', this.new_task, this.GetTasks)
		},
		UpdateTask() {
			this.PostToServer('update_task', this.editing)
			this.editing = {}
		},
		GetFromServer(what) {
			const pm = this
			async function _GetFromServer(get_what) {
				pm[get_what] = (await db.get(get_what)).data
			}
			_GetFromServer(what)
		},
		PostToServer(post_what, content, callback) {
			db.post(post_what, content).then((response) => {
				if (callback) {
					callback()
				}
			})
		},
		GetTasks() {
			this.GetFromServer('tasks')
			this.new_task = { project: '' }
		},

		GetProjects() {
			this.GetFromServer('projects')
			this.new_project = {}
		},
	},
	created() {
		this.GetFromServer('projects')
		this.GetFromServer('tasks')
	},
}
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: left;
	color: #D0D0D0;
	margin-top: 30px;
}
html, body {
	background: #202020;
}
.box, .input, .textarea, .label, .select, .content h1, .content h2{
	background: #303030;
	color: #D0D0D0;
}
.activetask {
	text-decoration: line-through;
}
.inactivetask {
	text-decoration: line-through;
	color: #606060;
}
.fade-enter-active, .fade-leave-active {
	transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
}
.slide-fade-enter-active {
	transition: all .3s ease;
}
.slide-fade-leave-active {
	transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
	transform: translateY(-20px);
	opacity: 0;
}
</style>
