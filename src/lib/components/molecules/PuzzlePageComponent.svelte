<!--
@component
Day 4 - Scratchcards
-->
<script lang='ts'>
	// context api
	import { setContext, getContext } from 'svelte';

	// writable store api
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';

	// components
	import PuzzleDataToggle from '$atoms/PuzzleDataToggle.svelte';
	import PuzzlePageResults from "$atoms/PuzzlePageResults.svelte";
	import PuzzlePageTabs from "$molecules/PuzzlePageTabs.svelte";
	import PuzzlePageTitle from '$atoms/PuzzlePageTitle.svelte';
	import PuzzleData from "$molecules/PuzzleData.svelte";

	// data from context
	const content = getContext('content') as {[key:string]: string | undefined};
	const realData = content.realData ?? '';
	const exampleData = content.exampleData ?? '';

	// data sources object
	const dataSources: {[key: string]: string} = {
		real: realData,
		example: exampleData,
	};

	// local data stores
	const dataSourceStore = getContext('dataSourceStore') as Writable<string>;
	const dataStore = writable(realData);
	const useExampleDataStore = writable(false);

	// add local data stores to context
	setContext('dataStore', dataStore);
	setContext('dataSourceStore', dataSourceStore);
	setContext('useExampleDataStore', useExampleDataStore);


	// as toggle changes, update data store
	$: {
		if ($useExampleDataStore) {
			$dataSourceStore = 'example';
		}
		else {
			$dataSourceStore = 'real';
		}
	}

	// as data source changes, update data store
	$: {
		$dataStore = dataSources[$dataSourceStore];
	}









	</script>

	<template lang="pug">
	header.px-4.pt-4.relative.flex.justify-between.place-items-start
		PuzzlePageTitle
		.grid.grid-cols-1.place-items-end.gap-y-3
			PuzzlePageResults
			PuzzleDataToggle

	main.font-mono.text-16.grid.grid-cols-1.p-4.align-middle.relative(
			class="gap-[1ch]")

		PuzzlePageTabs

			//- 1. visualizations
			div(slot="tab-visualization")
				slot(name="visualization")

			//- 2. solution
			div(slot="tab-solution")
				slot(name="solution")

			//- 3. data
			div(slot="tab-data")
				PuzzleData

	</template>
