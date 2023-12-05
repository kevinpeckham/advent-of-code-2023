<!--
@component
Here's some documentation for this component.
-->

<script lang='ts'>
// get context api
import { getContext } from 'svelte';

// get data stores from context
const useExampleDataStore = getContext('useExampleDataStore') ?? false;
</script>

<template lang='pug'>
	label.opacity-90.flex.gap-2(for="data-toggle")
		span use example data
		input(bind:checked!="{$useExampleDataStore}" type="checkbox", id="data-toggle")
</template>