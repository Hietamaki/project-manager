<template>
<transition name='fade' mode='out-in' @after-enter='FocusField'>
	<div v-if='!is_editing' key='addnew'>
		<a @click='is_editing = true'>
			(<b>+</b>) <i>Lisää uusi tehtävä</i>
		</a>
	</div>

	<div v-else key='editingnew'>
		<div class='columns'>
			<div class='column'>
				<input type='input' class='input' ref='newtaskfield'
					v-model='task_desc'
					@keyup.enter='NewTask'
					@keyup.esc='is_editing = false'
					@blur='LoseFocus($event)'>
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
			is_editing: false,
			task_desc: ''
		}
	},
	props: ['project'],
	methods: {
		FocusField() {
			if (this.is_editing) {
				this.$refs.newtaskfield.focus()
			}
		},
		LoseFocus(element) {
			if (document.activeElement !== element.target) {
				this.is_editing = false
			}
		},
		NewTask() {
			const new_task = {
				project: this.project,
				desc: this.task_desc
			}
			server.Post('task', new_task, this.TaskAdded)
		},
		TaskAdded() {
			this.task_desc = ''
			this.is_editing = false
			this.$emit('added')
		}
	}
}
</script>

<style scoped>
a {
	color: white;
}
</style>
