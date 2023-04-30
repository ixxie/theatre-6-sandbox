<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { Editable } from '$lib/theatre';
	import { DEG2RAD } from 'three/src/math/MathUtils';
</script>

<T.PerspectiveCamera position={[0, 5, 10]} makeDefault>
	<OrbitControls target={{ y: 1.5 }} />
</T.PerspectiveCamera>

<!-- Box -->
<T.Mesh receiveShadow castShadow position.y={0.5}>
	<Editable name="Box / Mesh" transform controls />
	<T.BoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color="#b00d03">
		<Editable name="Box / Material" color roughness metalness />
	</T.MeshStandardMaterial>
</T.Mesh>

<!-- Floor -->
<T.Mesh receiveShadow castShadow rotation.x={DEG2RAD * -90}>
	<Editable name="Floor / Mesh" scale />
	<T.CircleGeometry args={[4, 60]} />
	<T.MeshStandardMaterial>
		<Editable name="Floor / Material" color roughness metalness />
	</T.MeshStandardMaterial>
</T.Mesh>

<T.DirectionalLight position={[0.5, 2, 1]} castShadow>
	<Editable name="Lights / Main" color intensity transform controls />
</T.DirectionalLight>

<T.AmbientLight intensity={0.2}>
	<Editable name="Lights / Fill" color intensity />
</T.AmbientLight>
