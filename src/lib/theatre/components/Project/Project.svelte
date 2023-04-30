<script lang="ts">
  import { globalProjects } from '../consts'
  import { getProject } from '../theatre'
  import { setContext } from 'svelte'
  import type { IProjectConfig } from '@theatre/core'

  // PROPS

  export let name = 'default'
  export let config: IProjectConfig | undefined = undefined

  // BINDINGS

  export const project = globalProjects.get(name) ?? getProject(name, config)
  globalProjects.set(name, project)

  export const ready = project.ready
  export const address = project.address
  export const sheet = project.sheet
  export const getAssetUrl = project.getAssetUrl

  export let isReady = false
  const syncReady = async () => {
    await ready
    isReady = true
  }
  syncReady()

  // CHILD CONTEXT

  setContext(`theatre-project`, project)
</script>

{#await ready}
  <slot {project} />
{/await}
