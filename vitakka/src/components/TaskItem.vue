<template>
<div>
	<b><span @click='ExpandTask(task._id)' :class='{ inactivetask: !task.status }'>
		{{ task.desc }}
	</span></b>

	<transition name='fade'>
		<div :ref='task._id' v-if='task._id == active_task'>
			<span @click='ChangeTaskStatus(task)'>👌</span>
			<span @click='DeleteTask(task)'>💀</span>
			<span v-if='editing._id != task._id' @click='editing = task'>
				<span v-if='task.notes'>{{ task.notes }}</span>
				<span v-else><i>[Lisää kuvaus]</i></span>
			</span>

			<transition name='slide-fade' @after-enter='$refs.notefield[0].focus()'>
				<div v-if='editing._id == task._id'>
					<textarea ref='notefield' class='textarea' v-model.trim='editing.notes'
						@keyup.ctrl.enter='UpdateTask' @keyup.esc='editing = {}'>
					</textarea>
					<input type='button' value='Muokkaa' class='button' @click='UpdateTask'>
				</div>
			</transition>

			<ul>
				<ol v-for='(link, index) in task.links' :key='index'>
					<a :href='link[0]'>{{ link[1] }}</a>
				</ol>
			</ul>
		</div>

	</transition>
</div>
</template>

<script>
import server from '../api'

export default {
	name: 'TaskItem',
	data() {
		return {
			active_task: '',
			editing: {},
		}
	},
	props: ['task'],
	methods: {
		ChangeTaskStatus(task_data) {
			task_data.status = !task_data.status
			server.Put('task', task_data)
		},
		DeleteTask(task) {
			if (confirm('Haluatko poistaa tehtävän?')) {
				server.Delete('task', task, this.SelfDestruct)
			}
		},
		ExpandTask(taskid) {
			this.active_task = this.active_task !== taskid ? taskid : ''
			this.editing = {}
		},
		SelfDestruct() {
			this.$emit('destroy')
		},
		UpdateTask() {
			server.Put('task', this.editing)
			this.editing = {}
		},
	}
}
</script>

<style scoped>
.activetask {
	text-decoration: line-through;
}
.inactivetask {
	text-decoration: line-through;
	color: #606060;
}
</style>
