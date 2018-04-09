<template>
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
</template>

<script>
import server from '@/api'

export default {
	name: 'NewProject',
	data() {
		return {
			new_project: {},
		}
	},
	methods: {
		NewProject() {
			server.Post('project', this.new_project, this.ProjectAdded)
		},
		ProjectAdded() {
			this.$emit('added')
			this.new_project = {}
		}
	}
}
</script>
