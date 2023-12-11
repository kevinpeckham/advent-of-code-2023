<!--
@component
Day 4 - Scratchcards
-->
<script lang='ts'>

	// data
	import { exampleData, realData, testData } from "$data/day5";

	// classes and types
	import { DatasetPartTwoBeta } from "./types"
	import type { DataRange } from "./types"

	const realDataset = new DatasetPartTwoBeta(realData);
	//const exampleDataset = new DatasetPartTwoBeta(exampleData);
	// const testDataset = new DatasetPartTwoBeta(testData);
	const dataset = realDataset;



	async function solveSeedRanges() {
		const seedRanges = dataset.seedRanges;
		const seedRangesArray = [...seedRanges];
		const solutionPairs: number[][] = [];
		const seeds: number[] = [];
		const locations: number[] = [];
		seedRangesArray.forEach((seedRange) => {
			let min = seedRange.get('min') as number;
			let max = seedRange.get('max') as number;
			let subsegmentMin = min;
			let subsegmentMax = 0;
			let guardrail = 0;
			while (subsegmentMin < max && guardrail < 1000) {
			const result = dataset.mapSeedRangeToLocationRange([subsegmentMin, max]);
			const [adjustedSeedRangeMin, adjustedSeedRangeMax, lowestValue] = result;
			subsegmentMax = adjustedSeedRangeMax;
			locations.push(lowestValue)
			seeds.push(adjustedSeedRangeMin);
			subsegmentMin = adjustedSeedRangeMax + 1;
			subsegmentMax = max;
			guardrail++;
			}})
		const minLocation = Math.min(...locations);
		const locationIndex = locations.indexOf(minLocation);
		const seed = seeds[locationIndex];

		console.log('seed', seed)
		console.log('minLocation', minLocation)

		return minLocation;
		};

		solveSeedRanges() // 99751240 -- CORRECT!!!









	// Part Two

	</script>

	<template lang="pug">
		div 5 Beta
	</template>

