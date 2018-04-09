<template>
<div id='app' class='container content'>
	<!--<img src='./assets/logo.png'>-->
	<!--<router-view/>-->
	<div class='container'>
		<div class='content' v-for='project in projects' :key='project._id'>
			<h2>{{ project.name }}</h2>
			<ul>
				<transition-group name='fade'>
					<ol v-for='task in tasks' v-if='task.project == project.name' :key='task._id'>
						<task-item :task='task' @destroy='GetTasks'></task-item>
					</ol>
				</transition-group>

				<ol>
					<new-task :project='project' @added='GetTasks'></new-task>
				</ol>
			</ul>
		</div>

		<new-project @added='GetProjects'></new-project>
	</div>
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
		}
	},
	components: {
		NewProject,
		NewTask,
		TaskItem
	},
	methods: {
		GetTasks() {
			server.Get('tasks').then(x => this.tasks = x)
			this.new_task = { project: '' }
		},
		GetProjects() {
			server.Get('projects').then(x => this.projects = x)
			this.new_project = {}
		},
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
.box, .input, .textarea, .label, .select, .content h1, .content h2{
	background: #303030;
	color: #D0D0D0;
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
