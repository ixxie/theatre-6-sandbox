<script lang="ts">
  import type { ISheet, ISequence } from '@theatre/core'
  import { onChange, val } from '../theatre'

  import { getContext, onDestroy, setContext } from 'svelte'

  // PARENT CONTEXT

  const sheet: ISheet = getContext('threlte-sheet')

  // TYPES

  type ThrelteSequenceOptions = {
    autoplay: boolean
    autoreset: boolean | 'onMount' | 'onDestroy'
    autopause: boolean
    delay: number
  }
  type TheatreSequenceOptions = Required<Parameters<ISequence['play']>[0]>
  type SequenceOptions = ThrelteSequenceOptions & TheatreSequenceOptions

  // PROPS

  export let options: Partial<SequenceOptions> = {}
  export let audio: Parameters<ISequence['attachAudio']>[0] | undefined = undefined
  export let position: ISequence['position']
  export let playing = false

  // OPTIONS LOGIC

  const defaults: ThrelteSequenceOptions = {
    autoplay: false,
    // Resets the playhead to 0 when the sheet is unmounted or mounted or both
    autoreset: false,
    autopause: false,
    delay: 0
  }
  $: opts = { ...defaults, ...options } as SequenceOptions
  $: playOpts = {
    rate: opts.rate,
    range: opts.range,
    iterationCount: opts.iterationCount,
    direction: opts.direction
  }

  // BINDINGS

  export const sequence = sheet.sequence
  export const play: ISequence['play'] = (...args: Parameters<ISequence['play']>) => {
    return sequence.play(...{ ...playOpts, ...args })
  }
  export const pause: ISequence['pause'] = (...args: Parameters<ISequence['pause']>) => {
    return sequence.pause(...args)
  }

  // ATTACH AUDIO

  if (audio) sequence.attachAudio(audio)

  // PLAY REACTIVITY

  // sync prop state to pointer state
  const getPlayingState = (pointerPlaying: boolean) => (playing = pointerPlaying)
  const unsubPlayingState = onChange(sequence.pointer.playing, getPlayingState)
  onDestroy(unsubPlayingState)

  // sync pointer state to prop state
  const setPlayingState = (playingProp: boolean) => {
    const shouldBePlaying = playingProp
    if (playing && !shouldBePlaying) pause()
    if (!playing && shouldBePlaying) play()
  }
  $: setPlayingState(playing)

  // POSITION REACITVITY

  // sync prop state to pointer state
  const getPositionState = (pointerPosition: ISequence['position']) => (position = pointerPosition)
  const unsubPositionState = onChange(sequence.pointer.position, getPositionState)
  onDestroy(unsubPositionState)

  // sync pointer state to prop state
  const setPositionState = (positionProp: ISequence['position']) => {
    sequence.position = positionProp
  }
  $: setPositionState(position)

  // AUTOPLAY LOGIC

  if (!opts.autoplay && opts.delay > 0) {
    console.warn(`Sequence: delay has no effect unless the option autoplay is enabled.`, { sheet })
  }

  let timeoutHandler: ReturnType<typeof setTimeout> | undefined = undefined
  if (opts.autoplay) {
    timeoutHandler = setTimeout(() => {
      play()
    }, opts.delay)
  }
  if (opts.autoreset === 'onMount') {
    sequence.position = 0
  }
  onDestroy(() => {
    if (timeoutHandler) {
      clearTimeout(timeoutHandler)
    }
    if (opts.autopause) {
      sequence.pause()
    }
    if (opts.autoreset === 'onDestroy') {
      sequence.position = 0
    }
  })

  // CHILD CONTEXT

  setContext('threlte-sequence', sequence)
</script>

<slot {sequence} {position} {playing} {play} {pause} />
