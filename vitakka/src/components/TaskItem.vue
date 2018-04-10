<template>
<div>
	<a @click='ExpandTask' :class='task_style'>
		{{ task.desc }}
	</a>

	<transition name='fade'>
		<div :ref='task._id' v-if='is_expanded'>
			<div>
				<a @click='ChangeTaskStatus(task)'>👌</a>
				<a @click='DeleteTask(task)'>💀</a>
			</div>

			<transition mode='out-in' @enter='ItemAppears($event)'>
				<div v-if='!is_editing' class='description' @click='is_editing = true' key='notediting'>
					<a class='description'>
					<span v-if='task.notes'>{{ task.notes }}</span>
					<span v-else><i>[Lisää kuvaus]</i></span>
					</a>
				</div>
				<div v-else key='editing' class='task-info'>
					<textarea class='textarea'
						v-model.trim='task.notes'
						@keyup.ctrl.enter='UpdateTask'
						@keyup.esc='is_editing = false'
						@blur='LoseFocus($event)'>
					</textarea>
					<!--<input type='button' value='Muokkaa' class='button' @click='UpdateTask'>-->
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
			is_expanded: false,
			is_editing: false,
		}
	},
	props: ['task'],
	computed: {
		task_style() {
			return this.task.status ? 'activetask' : 'inactivetask'
		}
	},
	methods: {
		ItemAppears(element) {
			const textarea = element.getElementsByTagName('textarea')

			if (textarea.length) {
				element.getElementsByTagName('textarea')[0].focus()
			}
		},
		ChangeTaskStatus(task_data) {
			server.Put('task', task_data, () =>
				this.task.status = !this.task.status)
		},
		DeleteTask(task) {
			if (confirm('Haluatko poistaa tehtävän?')) {
				server.Delete('task', task, () =>
					this.$emit('destroy'))
			}
		},
		ExpandTask() {
			this.is_expanded = !this.is_expanded
			this.is_editing = false
		},
		LoseFocus(element) {
			if (document.activeElement !== element.target) {
				this.is_editing = false
			}
		},
		UpdateTask() {
			server.Put('task', this.task, () =>
				this.is_editing = false)
		},
	}
}
</script>

<style scoped>
.activetask {
	color: white;
	font-weight: bold;
}
.inactivetask {
	text-decoration: line-through;
	color: #606060;
}
.description {
	margin: 10px 5px 18px;
	color: #E0E0E0;
	font-weight: none;
}
.textarea:focus {
	border: 1px solid gray;
	height: 160px;
}
.textarea {
	transition: all 0.5s;
	min-height: 18px;
}
.task-info {
	transition: all 0.5s;
}
</style>
