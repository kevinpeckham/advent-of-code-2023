<!--
@component
Here's some documentation for this component.
-->

<script lang='ts'>
// store api
import { writable } from 'svelte/store';

const activePanel = writable(0);

const tabs = ['tab-visualization','tab-solution','tab-data'];




</script>

<template lang='pug'>
//- controls
.flex.gap-x-4.border-b.mb-4
	+each('tabs as tab, index')
		+if('$$slots[tab]')
			a.block.mb-6.underline.underline-offset-4(
				class!="{$activePanel === index ? 'text-accent' : 'text-blue-300'}"
				href="/",
				on:click|preventDefault!="{() => $activePanel = index}") {tab.replace('tab-','')}

.w-full.min-h-screen.overflow-hidden.relative.flex

	+if('$$slots["tab-visualization"]')
		.overflow-scroll.relative.flex.w-auto.h-auto.top-0.left-0.transition-transform.z-20(style!="transform:translateX({$activePanel * -100}vw);")
			slot(name="tab-visualization")
	+if('$$slots["tab-solution"]')
		.absolute.flex.w-full.h-full.top-0.left-0.transition-transform.z-10(style!="transform:translateX({($activePanel - 1) * -100}vw);")
			slot(name="tab-solution")
	+if('$$slots["tab-data"]')
		.absolute.flex.w-full.h-full.top-0.left-0.transition-transform.z-10(style!="transform:translateX({($activePanel - 2) * -100}vw);")
			slot(name="tab-data")
</template>