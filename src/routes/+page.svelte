<script>
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';

	import { Theatre } from '$lib/theatre';
</script>

<div>
	<Canvas>
		<Theatre>
			<Scene />
		</Theatre>
	</Canvas>
</div>

<style>
	div {
		width: 100vw;
		height: 100vh;
	}

	:global(*) {
		margin: 0;
		padding: 0;
	}
</style>
