<!--
@component
AOC Day 2 - "Cube Conundrum" - https://adventofcode.com/2023/day/2
-->

<script lang='ts'>
	// data
	const testSource = `
	Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
	Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
	Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
	Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
	Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`.trim();

	const realSource = `Game 1: 3 blue, 7 green, 10 red; 4 green, 4 red; 1 green, 7 blue, 5 red; 8 blue, 10 red; 7 blue, 19 red, 1 green
Game 2: 6 red, 10 green; 11 green, 4 red; 16 green, 2 blue; 7 green, 5 blue, 4 red; 17 green, 1 red, 1 blue
Game 3: 5 red, 9 blue, 1 green; 5 red; 11 red, 2 green, 8 blue; 2 green, 6 blue
Game 4: 2 red, 5 green; 2 blue, 3 red, 3 green; 3 red, 2 blue; 8 green, 2 red
Game 5: 12 red, 13 blue; 13 blue, 2 green, 9 red; 9 blue, 1 red; 2 green, 12 blue; 1 green, 1 red, 11 blue
Game 6: 4 blue, 11 red; 4 red; 1 green, 7 red; 1 green, 1 blue; 8 blue, 10 red; 1 green, 2 blue, 8 red
Game 7: 7 blue, 15 red, 1 green; 5 green, 17 red, 7 blue; 5 blue, 1 green; 11 blue, 2 green, 17 red; 14 green, 9 red, 2 blue; 6 blue, 19 red
Game 8: 13 green; 5 green; 3 blue, 9 green, 1 red; 4 red, 11 green, 4 blue
Game 9: 4 green, 1 red, 1 blue; 4 green, 7 blue, 7 red; 9 blue, 4 red; 2 blue, 8 red, 5 green; 6 blue, 2 green; 5 red, 5 green, 10 blue
Game 10: 1 green, 5 blue, 3 red; 4 green, 9 red, 3 blue; 11 red, 2 green, 5 blue; 3 green, 1 blue, 2 red; 6 red, 2 blue
Game 11: 2 red, 6 green, 12 blue; 2 red, 9 blue, 1 green; 12 green, 3 blue
Game 12: 1 red, 1 blue, 12 green; 6 green, 2 red, 1 blue; 6 red, 6 green, 1 blue; 3 green, 6 red
Game 13: 5 red, 19 green, 3 blue; 6 red, 7 blue, 11 green; 8 blue, 6 red; 3 blue, 4 green, 4 red; 8 red, 15 green, 5 blue; 5 blue, 2 red, 10 green
Game 14: 5 blue, 9 green; 4 green, 6 blue; 14 green, 1 red, 4 blue; 3 blue, 3 green; 2 green; 5 blue, 7 green, 1 red
Game 15: 5 red, 8 blue; 9 blue, 3 red; 5 red, 1 green, 16 blue; 1 blue, 3 red, 2 green; 5 red, 2 green, 10 blue
Game 16: 6 blue, 9 green, 10 red; 8 blue, 9 red, 14 green; 7 green, 1 blue, 1 red; 8 red, 5 green, 8 blue; 10 red, 5 blue, 14 green; 7 blue, 11 red, 3 green
Game 17: 12 blue, 12 red, 6 green; 14 green, 17 blue, 4 red; 11 blue, 1 red, 13 green
Game 18: 7 blue, 2 green, 4 red; 1 blue, 2 green, 4 red; 2 red, 17 blue
Game 19: 3 red, 9 green; 8 red, 2 blue, 2 green; 3 blue, 15 green, 11 red; 18 green, 3 red, 1 blue
Game 20: 5 green, 5 red, 16 blue; 8 blue, 6 green, 4 red; 10 red, 11 blue; 5 red, 5 blue, 5 green
Game 21: 1 red, 3 blue, 14 green; 6 red, 6 blue, 17 green; 12 green, 17 blue, 3 red; 15 green, 1 red, 19 blue; 3 red, 18 blue, 4 green
Game 22: 15 blue; 11 blue, 2 red, 1 green; 1 green, 7 red; 1 red, 18 blue, 1 green; 16 blue; 3 red, 6 blue
Game 23: 11 blue, 6 green, 4 red; 9 green, 11 red, 8 blue; 5 green, 5 red, 2 blue; 11 green, 4 blue, 11 red; 3 green, 9 blue, 2 red
Game 24: 7 green, 2 red; 8 red, 1 blue, 15 green; 3 red, 6 green, 6 blue
Game 25: 9 blue, 9 green; 3 green, 7 blue, 1 red; 6 green, 1 red, 1 blue; 6 green, 1 red, 1 blue
Game 26: 1 green, 15 blue, 1 red; 1 red, 12 blue, 1 green; 16 blue; 5 red, 11 green, 14 blue; 6 green, 4 red, 14 blue
Game 27: 14 red, 9 green; 11 red, 5 green, 6 blue; 1 red, 6 blue, 9 green
Game 28: 6 green, 1 blue, 9 red; 1 green, 9 red; 7 red; 11 red, 1 blue, 2 green; 8 red, 10 green; 6 green, 1 blue, 5 red
Game 29: 1 red, 19 blue, 3 green; 9 blue, 1 red; 8 green, 17 blue; 11 blue, 4 green
Game 30: 7 blue; 5 blue, 1 red, 1 green; 3 blue, 1 red
Game 31: 9 red, 2 green, 1 blue; 5 red, 1 green, 3 blue; 2 green, 7 red; 2 green, 12 red
Game 32: 1 red, 1 blue, 17 green; 14 blue, 10 green, 6 red; 12 green, 11 blue, 3 red
Game 33: 2 red, 1 green, 3 blue; 7 blue, 4 green; 1 red, 3 green, 5 blue
Game 34: 9 blue, 1 green, 9 red; 12 blue, 2 green, 12 red; 3 blue, 12 red; 2 green, 14 blue, 11 red; 10 red, 12 blue
Game 35: 6 blue, 2 red; 5 blue; 6 green, 9 blue, 3 red; 3 green, 1 red, 2 blue
Game 36: 9 blue, 4 green, 6 red; 2 red, 4 green; 7 red, 3 green; 6 green, 2 blue; 3 red, 4 blue, 3 green; 3 green, 4 red, 16 blue
Game 37: 2 green, 8 red, 4 blue; 3 red, 4 blue, 2 green; 5 blue, 3 green; 9 blue, 15 green; 5 red, 11 green, 7 blue
Game 38: 12 red, 1 blue; 10 red, 3 green, 2 blue; 7 blue, 3 green, 8 red; 14 red, 2 green
Game 39: 16 green, 2 red, 17 blue; 6 red, 4 green, 13 blue; 7 blue, 1 green, 4 red; 2 green, 3 blue; 12 green, 6 red, 17 blue; 5 red, 2 blue, 6 green
Game 40: 3 green, 4 blue, 2 red; 2 green, 3 red; 6 blue, 2 red, 6 green; 5 green; 3 blue, 1 red, 5 green
Game 41: 13 green, 11 red; 3 green, 2 red, 1 blue; 1 blue, 3 green, 9 red; 12 red, 11 green; 9 red, 1 green; 9 green, 4 red
Game 42: 4 green, 2 blue; 6 blue, 10 green; 13 blue, 3 red, 6 green; 11 blue, 17 green; 8 blue, 5 red
Game 43: 10 green, 2 blue, 10 red; 3 red, 3 blue, 5 green; 10 green, 11 red, 4 blue; 5 green; 7 green, 13 red, 2 blue
Game 44: 4 red, 1 blue, 5 green; 1 blue, 8 red, 3 green; 11 red, 1 green, 1 blue; 2 green, 12 red, 1 blue; 1 blue, 12 red; 14 red, 3 green
Game 45: 4 green, 5 red, 7 blue; 10 red, 8 green, 3 blue; 12 blue, 1 green, 13 red; 1 red, 3 blue, 7 green
Game 46: 5 blue, 13 red; 15 red, 3 green, 17 blue; 8 red, 2 green, 1 blue; 1 green, 7 red, 16 blue; 4 blue, 10 red
Game 47: 2 red, 3 green; 2 blue, 9 red, 15 green; 7 green, 4 red; 3 blue, 13 red, 9 green
Game 48: 11 green, 4 red, 9 blue; 1 blue, 7 green; 4 blue, 4 red; 4 red, 4 blue, 2 green; 9 green, 2 blue, 2 red
Game 49: 10 green, 6 blue; 2 blue, 5 green, 1 red; 5 green, 4 blue; 11 green, 3 red, 3 blue
Game 50: 2 red, 15 green, 1 blue; 8 green, 7 blue; 4 blue, 8 green; 7 blue, 17 green; 5 blue, 6 green, 2 red; 16 green, 2 red, 1 blue
Game 51: 3 green, 5 blue, 1 red; 11 red, 9 blue, 8 green; 3 red, 8 green, 7 blue; 1 red, 9 blue, 6 green; 4 green, 1 red, 3 blue; 8 green, 7 red
Game 52: 1 green, 2 blue, 10 red; 8 green, 1 blue, 2 red; 7 red, 8 green
Game 53: 2 red, 6 green; 1 green, 4 blue; 12 green, 19 blue; 11 blue, 1 green; 4 green, 20 blue; 7 blue, 9 green, 1 red
Game 54: 2 blue, 2 green, 2 red; 13 red, 1 green, 6 blue; 9 blue, 1 green, 18 red; 11 red, 16 blue; 15 red, 3 green, 13 blue
Game 55: 5 green, 5 blue, 9 red; 8 red, 11 blue, 7 green; 6 green, 2 red, 10 blue; 6 red, 6 blue, 9 green; 11 green, 14 blue, 4 red
Game 56: 8 blue, 14 green; 3 red, 8 green, 3 blue; 14 green, 1 red, 13 blue; 8 green, 3 red; 8 blue, 11 green, 1 red; 8 blue, 10 green, 2 red
Game 57: 7 blue, 7 red; 11 green, 5 blue, 2 red; 14 green, 8 blue; 5 blue, 2 red, 17 green; 12 green, 3 red; 7 red, 7 blue, 9 green
Game 58: 3 blue, 4 red, 1 green; 2 green, 3 red; 1 red, 2 green, 4 blue; 4 green, 4 red, 2 blue
Game 59: 6 red, 4 blue, 5 green; 6 blue, 6 red; 1 red; 8 blue, 1 red
Game 60: 4 blue, 9 green, 11 red; 12 green, 3 red, 9 blue; 7 green, 1 blue; 14 green, 11 blue, 11 red
Game 61: 12 green; 9 green, 9 red; 12 red, 18 blue, 8 green; 16 red, 10 blue, 3 green; 6 green, 15 red, 3 blue; 13 green
Game 62: 2 green, 3 red, 12 blue; 12 blue, 12 green, 12 red; 1 red, 12 blue, 5 green; 7 red, 9 blue, 13 green; 1 blue, 3 red, 10 green; 2 blue, 8 red, 17 green
Game 63: 10 green, 7 blue, 4 red; 3 blue, 6 green, 2 red; 4 green, 10 red, 6 blue; 16 blue, 5 red, 4 green
Game 64: 11 red, 1 green, 6 blue; 12 red, 3 green; 6 green, 5 blue, 2 red; 4 green, 9 blue, 11 red; 5 blue, 8 green, 8 red; 9 green, 11 blue
Game 65: 4 blue, 12 red; 1 green, 3 blue, 12 red; 1 green, 3 blue, 13 red; 2 red; 12 red
Game 66: 4 red, 3 green, 3 blue; 2 blue, 4 red; 10 red, 6 blue, 3 green
Game 67: 7 red, 2 blue, 5 green; 3 green, 5 red, 18 blue; 16 red, 5 green, 13 blue; 16 red, 5 blue, 2 green
Game 68: 11 blue, 2 red; 1 green, 3 blue, 8 red; 16 red, 1 green, 17 blue; 4 red, 1 green, 11 blue; 3 red
Game 69: 1 green, 9 red, 12 blue; 12 red; 11 blue; 1 green
Game 70: 1 green, 18 blue, 16 red; 3 green, 15 red, 7 blue; 3 blue, 3 green, 10 red; 1 blue, 3 green, 10 red
Game 71: 3 red, 12 blue, 8 green; 18 green, 12 blue, 5 red; 2 blue, 7 red; 11 blue, 9 green; 5 blue, 7 red, 19 green; 2 red, 1 blue, 13 green
Game 72: 8 red, 6 blue, 3 green; 2 green, 13 blue, 15 red; 5 green, 8 blue, 2 red; 5 red, 12 blue, 3 green
Game 73: 3 blue, 13 green; 7 red, 3 green; 10 red, 2 blue, 1 green
Game 74: 3 red; 2 red, 1 blue, 7 green; 10 green, 3 blue, 1 red; 6 green, 1 blue; 11 green, 4 blue
Game 75: 8 blue, 2 green, 4 red; 19 blue, 2 green; 1 red, 18 blue, 3 green; 3 red, 5 green, 18 blue
Game 76: 3 green, 2 red, 2 blue; 3 blue, 6 green, 1 red; 1 green, 3 blue; 1 blue, 1 green
Game 77: 4 green, 7 red, 13 blue; 18 blue; 4 blue, 9 red, 1 green; 2 green, 16 blue, 9 red
Game 78: 2 green, 5 blue, 11 red; 2 blue, 3 red, 1 green; 4 green, 6 blue, 6 red
Game 79: 9 blue, 1 green, 3 red; 1 green, 2 red, 4 blue; 5 red, 4 green, 10 blue; 1 red, 9 blue, 4 green
Game 80: 8 red, 5 green, 7 blue; 15 red, 6 blue, 8 green; 8 blue, 14 red, 7 green; 3 blue, 2 green, 20 red; 10 red, 8 blue, 1 green; 7 green, 11 red, 9 blue
Game 81: 7 red, 1 blue, 5 green; 5 green, 10 blue, 9 red; 8 blue, 2 green, 7 red
Game 82: 1 green, 6 blue, 14 red; 7 blue, 2 green; 7 blue, 17 red, 3 green
Game 83: 2 red, 19 blue, 2 green; 5 red, 5 blue, 2 green; 2 red, 4 blue, 1 green
Game 84: 1 blue, 1 red, 12 green; 11 blue, 6 red, 13 green; 10 red, 8 blue, 8 green; 14 blue, 15 red; 19 blue, 10 green, 17 red; 11 red, 7 green
Game 85: 16 blue, 12 red, 8 green; 13 red, 3 green; 1 red, 16 blue, 10 green
Game 86: 5 green, 8 blue, 3 red; 8 green, 9 red, 13 blue; 4 green, 1 red, 12 blue; 13 red, 15 blue, 5 green
Game 87: 1 green, 16 red; 10 red, 2 green, 2 blue; 16 red, 5 blue; 1 blue, 2 green
Game 88: 3 blue, 1 green; 1 red, 2 green, 13 blue; 5 blue, 2 green, 1 red
Game 89: 9 blue, 2 red, 1 green; 10 blue; 5 blue, 1 green
Game 90: 8 red, 2 blue, 5 green; 2 red, 2 green, 2 blue; 1 blue, 8 green, 10 red; 11 green, 1 blue; 10 green, 4 red, 3 blue
Game 91: 14 blue, 9 red; 5 green, 5 red, 11 blue; 7 green, 4 blue, 12 red; 8 red, 6 green, 10 blue
Game 92: 2 green, 2 blue, 12 red; 2 green, 1 blue, 14 red; 14 red, 2 blue, 6 green; 11 red, 6 green, 2 blue; 11 green, 12 red, 2 blue
Game 93: 4 green, 7 blue, 3 red; 1 green, 12 blue, 1 red; 8 blue, 7 green, 2 red; 3 red, 9 blue, 2 green
Game 94: 13 green, 9 blue; 9 blue, 1 red, 8 green; 12 green, 1 red, 8 blue; 1 red, 9 green; 1 red, 5 blue, 14 green
Game 95: 7 blue, 14 red; 9 blue, 17 red; 2 blue, 1 green, 4 red
Game 96: 11 blue, 2 green, 3 red; 3 blue, 12 red, 3 green; 4 green, 11 red, 1 blue
Game 97: 9 red, 5 green, 2 blue; 12 red, 1 blue, 11 green; 7 green, 4 red, 2 blue; 1 blue, 6 red, 10 green
Game 98: 5 green, 5 red, 11 blue; 1 red, 10 blue, 7 green; 8 red, 1 blue, 7 green; 8 green, 11 red, 2 blue; 4 red, 5 blue, 2 green; 10 green, 5 red, 9 blue
Game 99: 3 green, 7 red, 4 blue; 9 red, 13 blue, 2 green; 3 red, 2 green, 11 blue; 5 red, 6 blue, 3 green; 8 blue, 5 green, 6 red; 6 green, 13 red, 1 blue
Game 100: 9 green, 7 blue; 1 green, 3 red, 4 blue; 15 red, 9 green; 3 blue, 6 red, 13 green; 2 red, 11 blue, 12 green`;

	const inputCounts = {
		red: 12,
		blue: 14,
		green: 13
	}

	// types & classes
	class Round {
			[key: string]: number;
			red: number;
			blue: number;
			green: number;
			constructor(red?: number, blue?: number, green?: number) {
				this.red = red ?? 0;
				this.blue = blue ?? 0;
				this.green = green ?? 0;
			}
	}
	class Game {
			[key: string]: string | Round[];
			id: string;
			rounds: Round[];
			constructor(id: string, rounds: Round[]) {
				this.id = id;
				this.rounds = rounds;
			}
	}
	type Games = Game[];
	type ColorCount = typeof inputCounts;

	// helper functions
	import { splitStringIntoArrayOfLines, sumArrayOfNumbers } from "$utils/utils";

	// functions
	function convertInputToDataObject(input:string) {

		// if no input, return empty array
		if (!input) return [];

		// convert into an array, each item in array contains all string content for a game
		const gamesArray = splitStringIntoArrayOfLines(input);

		const games: Games = [];
		// convert each game into an array of round objects and put into an array

		for (const gameString of gamesArray) {
			// get header e.g. "Game 1"
			const header = gameString.split(":")[0];

			// get id e.g. "1"
			const id = header.split(" ")[1];

			// get data e.g. "3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green"
			const data = gameString.split(":")[1];

			// convert data into an array of strings, each string contains all string content for a round
			// e.g. [" 6 red, 1 blue, 3 green", " 2 blue, 1 red, 2 green"]
			const gameDataArray = data.split(";")
			const gameDataArrayWithRoundObjects = [];

			// convert dataArray into an array of Rounds
			// e.g. [{red: 6, blue: 1, green: 3}, {blue: 3, red: 4,  green: 1}]
			for (const round of gameDataArray) {

				// convert round into an array of strings, each string contains all string content for a color
				//e.g. [" 6 red", " 1 blue", " 3 green"]
				const roundArray = round.trim().split(", ");

				// convert roundArray into an roundObject
				// e.g. { red: 6, blue: 1, green: 3 }
				const roundObject = new Round();
				for (const colorDatum of roundArray) {


					// convert round into an array of strings, each string contains a color and a number
					// e.g. ["6", "red"]
					const colorDatumArray = colorDatum.trim().split(" ");

					// if colorDatumArray contains valid info, convert to an object and return
					if (
							colorDatumArray.length === 2 &&
							Number(colorDatumArray[0]) &&
							colorDatumArray[1].length >= 3
							) {
						const num = Number(colorDatumArray[0]);
						const color = colorDatumArray[1];
						roundObject[color] = num;
					}

					// else return null;
				};

				// push roundObject into gameDataArrayWithRoundObjects
				gameDataArrayWithRoundObjects.push(roundObject);
			}

			const gameObj = new Game(id, gameDataArrayWithRoundObjects);
			games.push(gameObj);
		};

		return games;
	}
	function evaluateGameDataReturnIdIfPossible(game: Game, colorCounts: ColorCount): number {
		const id = game.id;
		const rounds = game.rounds;
		const redMax = findMaximumCountOfSingleColorInSingleGame(game, 'red');
		const blueMax = findMaximumCountOfSingleColorInSingleGame(game, 'blue');
		const greenMax = findMaximumCountOfSingleColorInSingleGame(game, 'green');

		let isPossible = true
		isPossible = (redMax > colorCounts.red) ? false : isPossible;
		isPossible = (blueMax > colorCounts.blue) ? false : isPossible;
		isPossible = (greenMax > colorCounts.green) ? false : isPossible;

		return (isPossible) ? Number(id) : 0;
	}
	function evaluateGamesDataReturnPossibleIds(source: string, colorCounts: ColorCount): number[] {
		const games = convertInputToDataObject(source);
		const ids: number[] = [];
		for (const game of games) {
			const id = evaluateGameDataReturnIdIfPossible(game, colorCounts);
			if (id) ids.push(id);
		}
		return ids;
	}
	function evaluateGamesDataReturnSumOfPossibleIds(source: string, colorCounts: ColorCount): number {
		const ids = evaluateGamesDataReturnPossibleIds(source, colorCounts);
		const sum = sumArrayOfNumbers(ids);
		return sum;
	}
	function findMaximumCountOfSingleColorInSingleGame(game: Game, color: string) {
		const rounds: Round[] = game.rounds;

		// build single array of all results across game
		const results: number[] = [];

		for (const round of rounds) {
			if (round[color]) results.push(round[color]);
		}

		const max = Math.max(...results);
		return max;
	}

	// PART ONE

	// Find sum of game Ids where game results are possible given input counts
	const partOneResult = evaluateGamesDataReturnSumOfPossibleIds(realSource, inputCounts);
	console.log('part one', partOneResult); // 2162


	// PART TWO
	// Find the minimum cube counts for each color to support the results of each game
	// then times those together to get the power
	// calculate the sum of all powers across all games

	// functions added for part two
	function evaluateGameDataReturnPower(game: Game): number {
		const id = game.id;
		const redMax = findMaximumCountOfSingleColorInSingleGame(game, 'red');
		const blueMax = findMaximumCountOfSingleColorInSingleGame(game, 'blue');
		const greenMax = findMaximumCountOfSingleColorInSingleGame(game, 'green');

		// const total = redMax + blueMax + greenMax;
		const power = redMax * blueMax * greenMax;
		return power;
	}
	function evaluateGamesDataReturnArrayOfPowers(games: Games): number[] {
		const powers: number[] = [];
		for (const game of games) {
			const power = evaluateGameDataReturnPower(game);
			powers.push(power);
		}
		return powers;
	}
	function evaluateSourceStringReturnSumOfPowers(source: string): number {
		const games = convertInputToDataObject(source);
		const powers = evaluateGamesDataReturnArrayOfPowers(games);
		const sum = sumArrayOfNumbers(powers);
		return sum;
	}

	const partTwoResult = evaluateSourceStringReturnSumOfPowers(realSource);
	console.log(partTwoResult); // 72513

</script>

<template lang='pug'>
div hello world
</template>