<template>
<transition name='fade' mode='out-in'>
	<div v-if='new_task.project != project.name' key='addnew'>
		<span @click='new_task.project = project.name'>
			(<b>+</b>) <i>Lisää uusi tehtävä</i>
		</span>
	</div>

	<div v-else key='editingnew'>
		<div class='columns'>
			<div class='column'>
				<input ref='newtaskfield' type='input' class='input' v-model='new_task.desc'
					@keyup.enter='NewTask' @keyup.esc="new_task.project = ''">
			</div>
			<div class='column is-one-quarter'>
				<button class="button" @click="NewTask">Lisää</button>
			</div>
		</div>
	</div>
</transition>
</template>

<script>
import server from '@/api'

export default {
	name: 'NewTask',
	data() {
		return {
			new_task: {
				project: '',
			}
		}
	},
	props: ['project'],
	methods: {
		NewTask() {
			server.Post('task', this.new_task, this.TaskAdded)
		},
		TaskAdded() {
			this.$emit('added')
			this.new_task = { project: '' }
		}
	}
}
</script>

