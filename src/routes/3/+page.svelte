<!--
@component
Day 3 - Gear Ratios
-->

<script lang='ts'>
	// utils
	import { splitStringIntoArrayOfLines, sumArrayOfNumbers } from "$utils/utils";

	// data
	import { data, example } from "$data/day3";


	// types
	interface CoordinateXY {
		x: number;
		y: number;
	}
	type Matrix = string[][];

	class DataSet {
		[key:string]: unknown;
		matrix: Matrix;
		symbols: Symbol[];
		asteriskSymbols: Symbol[];
		gears: Symbol[];
		gearRatios: number[];
		gearRatiosSum: number;
		partNumbers: PartNumber[];
		numbers: number[];
		sum: number;
		constructor(data: string) {
			this.matrix = buildMatrixOfCharacters(data);
			this.symbols = findSymbolsInMatrix(this.matrix);
			this.asteriskSymbols = this.symbols.filter((symbol) => symbol.character === '*');
			this.gears = this.asteriskSymbols.filter((symbol) => symbol.adjacentPartNumbers.length === 2);
			this.gearRatios = this.gears.map((gear) => gear.adjacentPartNumbers[0].number * gear.adjacentPartNumbers[1].number);
			this.gearRatiosSum = sumArrayOfNumbers(this.gearRatios);
			this.partNumbers = findAllPartNumbersFromAllSymbols(this.symbols, this.matrix);
			this.numbers = this.partNumbers.map((partNumber) => partNumber?.number ?? 0);
			this.sum = sumArrayOfNumbers(this.numbers);
		}
	}

	class Character {
		[key: string]: unknown;
		character: string;
		coordinateXY: CoordinateXY;
		constructor(x: number, y: number, matrix: Matrix) {
			this.character = matrix[y][x] ?? '?';
			this.coordinateXY = {x, y};
		}
	}
	class Symbol extends Character {
		type: 'Symbol';
		adjacentDigits: Digit[];
		adjacentPartNumbers: PartNumber[];
		constructor(x: number, y: number, matrix: Matrix) {
			super(x, y, matrix);
			this.adjacentDigits = findAdjacentDigits(this.coordinateXY, matrix);
			this.adjacentPartNumbers = findAdjacentPartNumbersFromSymbol(this, matrix);
			this.type = 'Symbol';
		}
	}
	class Digit extends Character{
		type: 'Digit'
		constructor(x: number, y: number, matrix: Matrix) {
			super(x, y, matrix);
			this.type = 'Digit';
		}
	}
	class PartNumber {
		symbol: Symbol;
		symbolCategory: string;
		digits: Digit[];
		firstCoordinate: CoordinateXY;
		number: number;
		constructor(symbol: Symbol, digits: Digit[]) {
			this.symbol = symbol;
			this.symbolCategory = symbol.character;
			this.digits = digits;
			this.number = getNumberFromDigits(digits);
			this.firstCoordinate = digits[0].coordinateXY;
		}
	}

	// functions
	function buildMatrixOfCharacters(inputSource: string) {
		const lines = splitStringIntoArrayOfLines(inputSource);
		const matrix: string[][] = [];
		lines.forEach((line, y) => {
			const characters = line.split('');
			matrix.push(characters);
		});
		return matrix;
	}
	function findAdjacentCoordinates(coordinateXY: CoordinateXY, matrix: Matrix): CoordinateXY[] {
		const {x, y} = coordinateXY;
		const matrixHeight = matrix.length;
		const matrixWidth = matrix[0].length;
		const limitX = matrixWidth - 1;
		const limitY = matrixHeight - 1;

		const adjacentCoordinates: CoordinateXY[] = [];
		// top left
		if (x > 0 && y > 0) adjacentCoordinates.push({x: x - 1, y: y - 1});
		// top
		if (y > 0) adjacentCoordinates.push({x: x, y: y - 1});
		// top right
		if (y > 0 && x < limitX) adjacentCoordinates.push({x: x + 1, y: y - 1});
		// left
		if (x > 0) adjacentCoordinates.push({x: x - 1, y: y});
		// right
		if (x < limitX) adjacentCoordinates.push({x: x + 1, y: y});
		// bottom left
		if (x > 0 && y < limitY) adjacentCoordinates.push({x: x - 1, y: y + 1});
		// bottom
		if (y < limitY) adjacentCoordinates.push({x: x, y: y + 1});
		// bottom right
		if (x < limitX && y < limitY) adjacentCoordinates.push({x: x + 1, y: y + 1});
		return adjacentCoordinates;
	}
	function findAdjacentCharacters(coordinate: CoordinateXY, matrix: Matrix): Character[] {
		const adjacentCoordinates = findAdjacentCoordinates(coordinate, matrix);
		const adjacentCharacters: Character[] = [];
		adjacentCoordinates.forEach((coordinate) => {
			const {x, y} = coordinate;
			const character = matrix[y][x];
			const adjacentCharacter = new Character(x, y, matrix);
			adjacentCharacters.push(adjacentCharacter);
		});
		return adjacentCharacters;
	}
	function findAdjacentDigits(coordinate: CoordinateXY, matrix: Matrix): Digit[] {
		const adjacentCharacters = findAdjacentCharacters(coordinate, matrix);
		const adjacentDigits: Digit[] = [];
		adjacentCharacters.forEach((character) => {
			if (character.character.match(/\d/)) {
				const {x, y} = character.coordinateXY;
				const digit = new Digit(x, y, matrix);
				adjacentDigits.push(digit);
			}
		});
		return adjacentDigits;
	}
	function findAllNumberDigitsFromDigit(digit:Digit, matrix: Matrix) {
		const {x, y} = digit.coordinateXY;
		const { character } = digit;

		// to store the digits
		const NumberDigits: string[] = []

		// get line
		const lineArray = matrix[y];
		const lineString = lineArray.join('');

		// navigate backward in line to find the first digit
		let referenceX = x;
		let i = 0;

		while (
				i < 10 && // loop guardrail
				referenceX > 0 &&
				lineArray[referenceX - 1].match(/\d/)) {
				referenceX = referenceX - 1;
				i++;
			}

		// get lineString substring that begins with the first digit
		const xPositionOfFirstDigit = referenceX;

		// get the number string
		const lineStringFromFirstDigit = lineString.substring(referenceX);
		const numberString = lineStringFromFirstDigit.match(/^\d+/)?.[0] ?? '?';

		// get the digits
		const numberDigits = []

		referenceX = xPositionOfFirstDigit;
		while ( referenceX < numberString.length + xPositionOfFirstDigit)
				{
				numberDigits.push(new Digit(referenceX, y, matrix))
				referenceX = referenceX + 1;
		};

		return numberDigits

	}
	function getNumberFromDigits(digits: Digit[]) {
		const numberString = digits.map((digit) => digit.character).join('');
		const number = parseInt(numberString);
		return number;
	}
	function findAdjacentPartNumbersFromSymbol(symbol: Symbol, matrix: Matrix) {

		// find adjacent digits
		const adjacentDigits = symbol.adjacentDigits;

		// for each adjacent digit, build part number
		const partNumbers: PartNumber[] = [];
		const usedCoordinates: string[] = [];

		for (const digit of adjacentDigits) {

			const digits = findAllNumberDigitsFromDigit(digit, matrix);
			const partNumber = new PartNumber(symbol, digits);
			const firstCoordinate = JSON.stringify(partNumber.firstCoordinate);

			// if part number is not already in array, add it
			if (usedCoordinates.indexOf(firstCoordinate) === -1) {

				usedCoordinates.push(firstCoordinate);
				partNumbers.push(partNumber);
			}

		}

		return partNumbers;

	}
	function findSymbolsInMatrix(matrix: Matrix): Symbol[] {
		const symbols: Symbol[] = [];

		// iterate through rows
		for (const line of matrix) {
			// iterate through characters
			let characterIndex = 0;
			for ( const character of line) {
				const regex = /[^\d\s\.]/;
				const match = character.match(regex);
				if (match) {
					const lineIndex = matrix.indexOf(line);
					const symbol = new Symbol(characterIndex, lineIndex, matrix);
					symbols.push(symbol);
				}
				characterIndex++;
			}
		}

		return symbols;
	}
	function findAllPartNumbersFromAllSymbols(symbols: Symbol[], matrix: Matrix) {
		const partNumbers: PartNumber[] = [];
		const usedCoordinates: string[] = [];

		// iterate through symbols and get part numbers for each symbol
		for (const symbol of symbols) {
			const partNumbersFromSymbol = findAdjacentPartNumbersFromSymbol(symbol, matrix);

			for (const partNumber of partNumbersFromSymbol) {
				const firstCoordinate = JSON.stringify(partNumber.firstCoordinate);
				if (usedCoordinates.indexOf(firstCoordinate) === -1) {
					usedCoordinates.push(firstCoordinate);
					partNumbers.push(partNumber);
				}
			}

		}
		return partNumbers;
	}


	// Part 1
	// loop through lines
	// loop through each character
	// if character is a symbol add to array
	// loop through symbols get adjacent digits
	// generate part number from adjacent digits
	// dedupe partNumbers
	// sum partNumbers
	const dataset = new DataSet(data);
	console.log('part1:', dataset.sum); // 550064

	// Part 2
	// get asterisks from symbols
	// get gears from asterisks that have 2 adjacent part numbers
	// get gear ratios from gears
	// sum gear ratios
	console.log('part2:', dataset.gearRatiosSum); // 85010461

	//- for display
	const { matrix } = dataset;


	// settings
	let hidePeriods = false;

	// variables
	let character = '';

</script>

<template lang='pug'>
	//- page container
	.font-mono.text-11.grid.p-4.text-center.align-middle(
			class="gap-1"
			style!="grid-template-columns:repeat({matrix[0].length}, 1fr);")

		//- base data layer -- iterate rows & characters
		+each('matrix as line, index')
				+each('line as character')
					+const('isPeriod = character === "."')
					div.overflow-hidden(class="bg-white/10") {@html character === '.' && !hidePeriods ? '' : character}



		//- symbols layer -- iterate symbols


</template>
<style>

</style>