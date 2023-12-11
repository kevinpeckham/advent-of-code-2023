<!--
@component
Day 4 - Scratchcards
-->
<script lang='ts'>
	// settings
	const day = 4;
	const puzzleTitle = "Scratchcards";

	// context api
	import { setContext } from 'svelte';

	// writable store api
	import { writable } from 'svelte/store';

	// utils
	import { splitStringIntoArrayOfLines, sumArrayOfNumbers, doubleValueXTimes, findOverlappingNumbersInArrays } from "$utils/utils";

	// data
	import { data as realData } from "$data/day4";
	import { example as exampleData } from "$data/day4";

	// data sources object
	const dataSources: {[key: string]: string} = {
		real: source.realData,
		example: exampleData,
	};

	// local data stores
	const dataSourceStore = writable('real');
	const dataStore = writable(realData);
	const useExampleDataStore = writable(false);

	// add local data stores to context
	setContext('dataSourceStore', dataSourceStore);
	setContext('dataStore', dataStore);
	setContext('useExampleDataStore', useExampleDataStore);

	// add settings to context
	setContext('day', day);
	setContext('puzzleTitle', puzzleTitle);

	// as toggle changes, update data store

	// let useExampleData: boolean = false;
	$: {
		if ($useExampleDataStore) {
			$dataStore = exampleData;
		}
		else {
			$dataStore = realData;
		}
	}

	// as data source changes, update data store
	$: {
		$dataStore = dataSources[$dataSourceStore];
	}

	// components
	import PuzzlePageComponent from '$components/molecules/PuzzlePageComponent.svelte';
	import PuzzleDataToggle from '$atoms/PuzzleDataToggle.svelte';
	import PuzzlePageResults from "$atoms/PuzzlePageResults.svelte";
	import PuzzlePageTabs from "$molecules/PuzzlePageTabs.svelte";
	import PuzzlePageTitle from '$atoms/PuzzlePageTitle.svelte';
	import PuzzleData from "$molecules/PuzzleData.svelte";

	// types
  type Tracker = {[key:string]: {instances: number}};

	// classes
	class Dataset {
		[key: string]: unknown;
		lines: string[];
		scratchCards: ScratchCard[];
		tracker: Tracker;
		constructor(data: string) {
			this.tracker = {};
			this.lines = splitStringIntoArrayOfLines(data);
			this.scratchCards = this.lines.map((line) => new ScratchCard(line, this.tracker));
			this.points = sumArrayOfNumbers(this.scratchCards.map((card) => card.pointsValue));
			this.cardCount = Object.values(this.tracker).map((card) => card.instances).reduce((a, b) => a + b);
		}
	}
	class ScratchCard {
	  [key: string]: unknown;
	  id: string;
		rawNumbersString: string;
	  winningNumbersString: string;
		winningNumbersArray: string[];
		playerNumbersString: string;
		playerNumbersArray: string[];
		winsArray: string[];
		pointsValue: number;
		cardsWon: string[];
	  constructor(cardLine: string, tracker: Tracker) {
			function determineCardsWonFromScratchCard(id: string, winCount: number): string[] {
				const cardsWon: string[] = [];
				for (let i = winCount; i > 0; i--) {
				cardsWon.push((Number(id) + i).toString());
				};
				return cardsWon.reverse();
			}
			function addThisCardToTracker(id: string): void {
				if (!tracker[id]) { tracker[id] = { instances:1 } }
				else { tracker[id].instances++ }
			}
			function addWonCardsToTracker(id: string, cardsWon: string[]): void {
				if (cardsWon.length) {
					cardsWon.forEach((cardWon) => {
					const instancesOfThisCard = tracker[id].instances;
					// if card already exists in tracker, increment its instances
					if (tracker[cardWon] && tracker[cardWon].instances) {
						tracker[cardWon].instances += instancesOfThisCard;
					}
					// else if card does not exist in tracker, add it
					else {
						tracker[cardWon] = {
							instances: instancesOfThisCard,
						}
					}
				});
			}
			}
			// remove extra spaces from card line
			const adjusted = cardLine.replaceAll('  ', ' ');
	    this.id = ((adjusted.split(':')[0]).replace('Card ', '')).trim();
			this.rawNumbersString = adjusted.split(':')[1].trim();
			this.winningNumbersString = this.rawNumbersString.split(' | ')[0];
			this.winningNumbersArray = this.winningNumbersString.split(' ');
			this.playerNumbersString = this.rawNumbersString.split(' | ')[1];
			this.playerNumbersArray = this.playerNumbersString.split(' ');
			this.winsArray = findOverlappingNumbersInArrays(this.winningNumbersArray, this.playerNumbersArray);
			this.pointsValue = this.winsArray.length ? doubleValueXTimes(1, this.winsArray.length - 1) : 0;
			this.cardsWon = determineCardsWonFromScratchCard(this.id, this.winsArray.length);

			// if it doesn't already exist, add a single instance of this card to the tracker
			// else if it does exist, increment its instances by 1
			addThisCardToTracker(this.id)

			// if this card has won, add an instance of each card won to the tracker for each instance of this card
			addWonCardsToTracker(this.id, this.cardsWon);
	  }
	}

	// data set
	let dataset: Dataset = new Dataset($dataStore);
	$: { dataset = new Dataset($dataStore) };

	// results
	const result1 = `${dataset.points} pts` 	// part 1: 18653 pts
	const result2 = `${dataset.cardCount} cards` 	// part 2: 5921508

	// add results to context
	setContext('result1', result1);
	setContext('result2', result2);

	// refs
	let winningNumbersGrid: HTMLDivElement;
	let winningNumbersGridLength: number = 400;
	$: {
		if (winningNumbersGrid) {
			winningNumbersGridLength = winningNumbersGrid.offsetWidth;
		}
	}

	// refs
	let playerNumbersGrid: HTMLDivElement;
	let playerNumbersGridLength: number = 400;
	$: {
		if (playerNumbersGrid) {
			playerNumbersGridLength = playerNumbersGrid.offsetWidth;
		}
	}

	// id widths
	const lastScratchCard = dataset.scratchCards[dataset.scratchCards.length - 1];
	const lastScratchCardId = lastScratchCard.id;
	const lastScratchCardIdLength = lastScratchCardId.length;

	// variables
	let scratchCard: ScratchCard;
	let index: number;


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

				//- headings row
				.flex

					div(
						class="mr-[4ch] border-b"
						style!="width:{lastScratchCardIdLength}ch;"
						) id

					div(
						class="mr-[4ch] gap-[0.75ch] border-b"
						style!="width:{winningNumbersGridLength}px;"
						)  winning numbers

					div(
						class="mr-[4ch] gap-[0.75ch] w-[9ch] border-b"
						style!="width:{playerNumbersGridLength}px;"
						)  player numbers

					div(class="mr-[4ch] gap-[0.75ch] w-[3ch] border-b")  pts

					div(class="mr-[2ch] w-[40ch] border-b")  cards won
					div(class="mr-[2ch] w-[10ch] border-b")  instances

				//- base data layer -- iterate rows
				+each('dataset.scratchCards as scratchCard, index')
					.flex

						//- id
						div(
							class!="mr-[4ch] text-right"
							style!="width:{lastScratchCardIdLength}ch;") { "0".repeat(3 - Number(scratchCard.id.length)) }{ scratchCard.id }

						//- winning numbers
						.grid(
								bind:this!="{winningNumbersGrid}"
								class="mr-[4ch] gap-[0.75ch]"
								style!="grid-template-columns:repeat({scratchCard.winningNumbersArray.length * 2}, 1ch);")
							+each('scratchCard.winningNumbersArray as winningNumber, index')
								.cell(class!="{scratchCard.winsArray.includes(winningNumber) ? 'bg-accent text-primary' : '' }") {winningNumber}

						//- player numbers
						.grid(
							bind:this!="{playerNumbersGrid}"
							class="mr-[4ch] gap-[0.75ch]"
							style!="grid-template-columns:repeat({scratchCard.playerNumbersArray.length * 2}, 1ch);")
							+each('scratchCard.playerNumbersArray as playerNumber, index')
								.cell(class!="{scratchCard.winsArray.includes(playerNumber) ? 'bg-accent text-primary' : '' }")  {playerNumber}

						//- points
						div(class="mr-[4ch] w-[3ch]") {scratchCard.pointsValue}

						//- cards won
						div(class="mr-[2ch] w-[40ch] bg-white/[5%] px-[0.5ch]") {scratchCard.cardsWon.join(' ')}

						//- instances
						div(class="mr-[2ch] w-[10ch] px-[0.5ch] text-right bg-white/[5%]") {dataset.tracker[scratchCard.id].instances.toLocaleString()}

			//- 2. solution
			div(slot="tab-solution")
				div Solution

			//- 3. data
			div(slot="tab-data")
				PuzzleData

	</template>

	<style lang="postcss">
		.cell {
			@apply
				w-full
				h-full
				col-span-2
				text-right;
			padding: .25ch;
		}
	</style>