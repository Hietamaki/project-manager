<template>
<div id='app'>
	<section class='main-content columns is-fullheight'>
		<!--<img src='./assets/logo.png'>-->
		<!--<router-view/>-->
		<nav class='panel column section is-3'>
			<p class='menu-label'>
				projektit
			</p>
			<ul class='menu-list sidebar'>
				<li class='' v-for='project in projects' :key='project._id'>
					<a class='sidebar'
						:class="{ 'is-active' : projects_shown.includes(project._id) }"
						@click='ShowProject(project._id)'>{{ project.name }}</a>
				</li>
				<li>
					<a class='sidebar ' :class="{ 'is-active' : show_new }"
						@click='show_new = !show_new'><i>[Uusi projekti]</i></a>
				</li>
			</ul>
		</nav>
		<div class='mainbox column container is-fullwidth'>
			<transition-group name='fade'>
				<div class='content'
					v-for='project in projects' :key='project._id'
					v-if='projects_shown.includes(project._id)'>
					<h2>{{ project.name }}</h2>
					<ul>
						<transition-group name='fade'>
							<ol v-for='task in tasks' v-if='task.project == project.name' :key='task._id'>
								<task-item :task='task' @destroy='GetTasks'></task-item>
							</ol>
						</transition-group>
						<ol>
							<new-task :project='project.name' @added='GetTasks'></new-task>
						</ol>
						<span v-if='!ProjectHasTasks(project)'>
							<ol @click='DeleteProject(project)'><a>💀 Tuhoa projekti</a></ol>
						</span>
					</ul>
				</div>
			</transition-group>
			<transition name='fade'>
				<new-project v-if='show_new' @added='GetProjects'></new-project>
			</transition>
		</div>
	</section>
</div>
</template>

<script>
import server from '@/api'
import NewProject from '@/components/NewProject'
import NewTask from '@/components/NewTask'
import TaskItem from '@/components/TaskItem'

export default {
	name: 'App',
	data() {
		return {
			tasks: [],
			projects: [],
			projects_shown: [],
			show_new: false
		}
	},
	components: {
		NewProject,
		NewTask,
		TaskItem
	},
	methods: {
		DeleteProject(project) {
			server.Delete('project', project, this.GetProjects)
		},
		GetTasks() {
			server.Get('tasks').then(x => this.tasks = x)
		},
		GetProjects() {
			server.Get('projects').then(x => this.projects = x)
		},
		ProjectHasTasks(project) {
			for (const task in this.tasks) {
				if (this.tasks[task].project === project.name) {
					return true
				}
			}

			return false
		},
		ShowProject(project) {
			const index_of = this.projects_shown.indexOf(project)

			if (index_of === -1) {
				this.projects_shown.push(project)
			} else {
				this.projects_shown.splice(index_of, 1)
			}
		}
	},
	created() {
		this.GetProjects()
		this.GetTasks()
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
a {
	color: white;
}
a:hover {
	color: gray;
}
.box, .input, .textarea, .label, .select, .content h1, .content h2{
	background: #303030;
	color: #D0D0D0;
}
.fade-enter-active, .fade-leave-active {
	transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
	opacity: 0;
}
.input:focus, .textarea:focus {
	border: 1px solid gray;
}
.sidebar {
	color: #D0D0F0 !important;
}
.sidebar:hover {
	color: gray !important;
}
.mainbox {
	margin-right: 10px;
}
</style>
