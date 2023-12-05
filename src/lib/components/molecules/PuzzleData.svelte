<!--
@component
Here's some documentation for this component.
-->

<script lang='ts'>
// utils
import { splitStringIntoArrayOfLines } from "$utils/utils";

// get context api
import { getContext } from 'svelte';

// types
import type { Writable } from 'svelte/store';

// get data stores from context
const dataStore = getContext('dataStore') as Writable<string>;

// split data into lines
$: lines = splitStringIntoArrayOfLines($dataStore) ?? [];


</script>

<template lang='pug'>
	//- text area
	textarea.overflow-y-hidden(
		class="h-auto bg-white/[5%] px-[1ch]"
		style!=`
			width:{lines[0].length + 2}ch;
			min-height:100px; height:{lines.length}lh;`
		) {$dataStore}
</template>