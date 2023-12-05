<!--
@component
Day 4 - Scratchcards
-->
<script lang='ts'>
	// context api
	import { setContext } from 'svelte';

	// writable store api
	import { readable, writable } from 'svelte/store';

	// components
	import PuzzlePageComponent from '$components/molecules/PuzzlePageComponent.svelte';

	// utils
	import { splitStringIntoArrayOfLines, sumArrayOfNumbers, doubleValueXTimes, findOverlappingNumbersInArrays } from "$utils/utils";

	// data
	import content from "$data/day4";

	// settings from source
	const { day, title } = content

	// local stores
	const dataSourceStore = writable('real');
	const result1Store = writable("no results yet");
	const result2Store = writable("no results yet");

	// add local stores and data  to context
	$: setContext('content', content);
	$: setContext('dataSourceStore', dataSourceStore);
	$: setContext('result1Store', result1Store);
	$: setContext('result2Store', result2Store);

	// types
  type Tracker = {[key:string]: {instances: number}};

	// classes
	class Dataset {
		[key: string]: unknown;
		cardCount: number;
		lines: string[];
		points: number;
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
	const realDataset: Dataset = new Dataset(content.realData);
	const exampleDataset: Dataset = new Dataset(content.exampleData);
	$: dataset = $dataSourceStore === 'example' ? exampleDataset : realDataset;

	// results
	$: $result1Store = `${dataset.points} pts` 	// part 1: 18653 pts
	$: $result2Store = `${dataset.cardCount} cards` 	// part 2: 5921508

	// visualization layout calculations
	$: firstScratchCard = dataset.scratchCards[0];
	$: lastScratchCard = dataset.scratchCards[dataset.scratchCards.length - 1];
	$: winningNumbersCount = firstScratchCard.winningNumbersArray.length;
	$: winningNumbersGridTemplateColumns = `repeat(${winningNumbersCount}, 2.5ch)`
	$: playerNumbersCount = firstScratchCard.playerNumbersArray.length
	$: playerNumbersGridTemplateColumns = `repeat(${playerNumbersCount}, 2.5ch)`
	$: highestPoints = Math.max(...dataset.scratchCards.map((card) => card.pointsValue));
	$: maxPointLength = highestPoints.toString().length;
	$: mostCardsWon = Math.max(...dataset.scratchCards.map((card) => card.cardsWon.length));
	$: biggestCardId = Math.max(...dataset.scratchCards.map((card) => Number(card.id)));
	$: maxCardIdLength = biggestCardId.toString().length;
	$: winningNumbersGridLength = winningNumbersCount * 2.5 + (winningNumbersCount - 1) * 0.75;
	$: playerNumbersGridLength = playerNumbersCount * 2.5 + (playerNumbersCount - 1) * 0.75;
	$: cardsWonGridLength = mostCardsWon * 2.5 + (mostCardsWon - 1) * 0.75;
	$: maxInstancesValue = Math.max(...Object.values(dataset.tracker).map((card) => card.instances));
	$: maxInstancesCharacterCount = maxInstancesValue.toString().length;

	// id widths
	$: lastScratchCardId = lastScratchCard.id;
	$: lastScratchCardIdLength = lastScratchCardId.length;

	// variables
	let scratchCard: ScratchCard;
	let index: number;


	</script>

	<template lang="pug">
	PuzzlePageComponent

		//- 1. visualizations
		div(slot="visualization")

			//- headings row
			.flex.gap-8.mb-3

				.border-b(
					style!="min-width:4ch; width:{maxCardIdLength + 1}ch;"
					) id

				.border-b(
					style!="width:{winningNumbersGridLength}ch;"
					) winning numbers

				.border-b(
					class="border-b"
					style!="width:{playerNumbersGridLength}ch;"
					) player numbers

				.border-b(
					style!="min-width:{'pts'.length}ch; width:{maxPointLength + 1}ch;"
					) pts

				.border-b(
					style!="min-width:{'cards won'.length}ch; width:{mostCardsWon * maxCardIdLength + mostCardsWon}ch;"
					) cards won

				.border-b(style!="min-width:{'instances'.length}ch; width:{maxInstancesCharacterCount}ch;") instances

			//- base data layer -- iterate rows
			+each('dataset.scratchCards as scratchCard, index')
				.flex.gap-8(class="mb-[.5ch]")

					//- id
					.cell(
						class!="text-right"
						style!="min-width: 4ch; width:{maxCardIdLength + 1}ch;") { "0".repeat(3 - Number(scratchCard.id.length)) }{ scratchCard.id }

					//- winning numbers
					.grid(
							class="gap-x-[0.75ch]"
							style!="grid-template-columns:{winningNumbersGridTemplateColumns};")
						+each('scratchCard.winningNumbersArray as winningNumber, index')
							.grid-cell(class!="{scratchCard.winsArray.includes(winningNumber) ? 'highlight-cell' : '' }") {winningNumber}

					//- player numbers
					.grid(
						class="gap-x-[0.75ch]"
						style!="grid-template-columns:{playerNumbersGridTemplateColumns};")
						+each('scratchCard.playerNumbersArray as playerNumber, index')
							.grid-cell(class!="{scratchCard.winsArray.includes(playerNumber) ? 'highlight-cell' : '' }")  {playerNumber}

					//- points
					.cell(
						style!="min-width:{'pts'.length}ch; width:{maxPointLength + 1}ch;"
						) {scratchCard.pointsValue}

					//- cards won
					.cell(
						style!="min-width:{'cards won'.length}ch; width:{mostCardsWon * maxCardIdLength + mostCardsWon}ch;"
						) {@html scratchCard.cardsWon.join(' ') ? scratchCard.cardsWon.join(' ') : '&nbsp;'}

					//- instances
					.cell(
						style!="min-width:{'instances'.length}ch; width:{maxInstancesCharacterCount + 1}ch;"
						) {dataset.tracker[scratchCard.id].instances.toLocaleString()}

		//- 2. solution
		div(slot="solution")
			div Solution

	</template>

	<style lang="postcss">
		.cell {
			@apply
				bg-white/5
				h-full
				px-[0.5ch]
				text-right;
		}
		.grid-cell {
			@apply
				bg-white/5
				px-[0.25ch]
				text-right;
		}
		.highlight-cell {
			@apply
				bg-accent/90
				text-primary/90;
		}
	</style>