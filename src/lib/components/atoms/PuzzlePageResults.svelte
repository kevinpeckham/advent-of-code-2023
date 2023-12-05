<!--
@component
Here's some documentation for this component.
-->

<script lang='ts'>
	// get context api
	import { getContext } from 'svelte';

	const result1 = getContext('result1Store') ?? "no results yet";
	const result2 = getContext('result2Store') ?? "no results yet";

</script>

<template lang='pug'>
.flex.gap-4
	div(class="mr-[2ch]") Part 1:  {$result1}
	div Part 2:  {$result2}
</template>