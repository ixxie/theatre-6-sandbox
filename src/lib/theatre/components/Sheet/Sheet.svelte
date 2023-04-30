<script lang="ts">
  import type { IProject } from '@theatre/core'
  import { getContext, setContext } from 'svelte'

  import { globalSheets } from '../consts'

  // PARENT CONTEXT

  export const project = getContext(`theatre-project`) as IProject
  const projectName = project.address.projectId

  // PROPS

  export let name = 'default'
  export let instance: string | undefined = undefined

  // BINDINGS

  export const sheet =
    globalSheets.get(`${projectName}-${name}-${instance}`) ?? project.sheet(name, instance)
  export const object = sheet.object
  export const detachObject = sheet.detachObject
  export const sequence = sheet.sequence
  export const address = sheet.address

  // REGISTER INSTANCE LOGIC

  globalSheets.set(`${projectName}-${name}-${instance}`, sheet)

  // CHILD CONTEXT

  setContext(`theatre-sheet`, sheet)
</script>

<slot {sheet} />
