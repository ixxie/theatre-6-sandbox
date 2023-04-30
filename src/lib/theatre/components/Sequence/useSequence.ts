import { onChange, val, type ISequence, type ISheet } from '@theatre/core';

import { getContext } from 'svelte'
import type { Writable, Subscriber } from 'svelte/store'

export class SequencePosition implements Writable<number> {
	sequence: ISequence;
	subscribers: Set<Subscriber<number>>;
	unsubscribe: ReturnType<typeof onChange>;

	constructor(sequence: ISequence) {
		this.sequence = sequence;
		this.subscribers = new Set<Subscriber<number>>();
		this.unsubscribe = onChange(this.sequence.pointer.position, (position) => {
			Object.values(this.subscribers).map((run) => run(position));
		});
	}
	subscribe(run: Subscriber<number>) {
		this.subscribers.add(run);
		run(this.sequence.position);
		return () => {
			this.subscribers.delete(run);
		};
	}
	update(callback: (prev: number) => number) {
		this.set(callback(this.sequence.position));
	}
	set(value: number) {
		const isPlaying = val(this.sequence.pointer.playing);
		this.sequence.position = value;
		if (isPlaying) this.sequence.play();
	}
}


export class SequencePlaying implements Writable<boolean> {
	sequence: ISequence;
	subscribers: Set<Subscriber<boolean>>;

	constructor(sequence: ISequence) {
		this.sequence = sequence;
		this.subscribers = new Set<Subscriber<boolean>>;
		onChange(this.sequence.pointer.playing, (playing) => {
			Object.values(this.subscribers).map((run) => run(playing));
		});
	}
	subscribe(run: Subscriber<boolean>) {
		this.subscribers.add(run);
		run(val(this.sequence.pointer.playing));
		return () => {
			this.subscribers.delete(run);
		};
	}
	update(callback: (prev: boolean) => boolean) {
		const isPlaying = val(this.sequence.pointer.playing);
		const shouldBePlaying = callback(isPlaying);
		if (isPlaying && !shouldBePlaying) this.sequence.pause();
		if (!isPlaying && shouldBePlaying) this.sequence.play();
	}
	set(value: boolean) {
		const isPlaying = val(this.sequence.pointer.playing);
		const shouldBePlaying = value;
		if (isPlaying && !shouldBePlaying) this.sequence.pause();
		if (!isPlaying && shouldBePlaying) this.sequence.play();
	}
}

export function useSequence() {
	const sequence: ISequence = getContext<ISequence>('threlte-sequence')
		?? getContext<ISheet>('threlte-sheet').sequence
	const length = val(sequence.pointer.length)
	return {
		length,
		position: new SequencePosition(sequence),
		playing: new SequencePlaying(sequence)
	}
}