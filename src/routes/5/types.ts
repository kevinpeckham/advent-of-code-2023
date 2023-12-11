let key: string;

// utils
import { splitStringIntoArrayOfLines } from '$utils/utils';

// Universal Types
export class Dataset {
	[key: string]: unknown;
	supplyGroups: Group[];
	mapGroups: Group[];
	constructor(data: string) {
		const verticalChunks = data.split('\n\n');
		const groups = verticalChunks.map((chunk) => new Group(chunk));
		this.supplyGroups = groups.filter((group) => group.type === 'supply');
		this.mapGroups = groups.filter((group) => group.type === 'map');
	}
}
export class Group {
	[key: string]: unknown;
	lines: string[];
	firstLine: string; // e.g. 'seeds: 79 14 55 13'
	heading: string; // e.g. 'seeds'
	type: string; // e.g. map or supply
	constructor(data: string) {
		this.lines = splitStringIntoArrayOfLines(data);
		this.firstLine = this.lines[0];
		this.heading = this.firstLine.split(':')[0] ?? "";
		this.type = this.heading.includes('map') ? 'map' : 'supply';
	}}


export class DataRange {
	[key: string]: unknown;
	map: Map<string, number>;
	constructor(min: number, length: number, diff: number) {
	this.map = new Map();
	this.map.set('min', min);
	this.map.set('max', min + length - 1);
	this.map.set('length', length);
	this.map.set('diff', diff);
	}
	add(key: string, value: number) {
		this.map.set(key, value);
	}
	get(key: string) {
		return this.map.get(key);
	}
	delete(key: string) {
		this.map.delete(key);
	}
	has(key: string) {
		return this.map.has(key);
	}
}

export type MinMaxDiff = {[key:string]: number; min: number; max: number; diff: number};


// Part One Types


// Part Two Types
export class DatasetPartTwoBeta extends Dataset {
	[key: string]: unknown;
	supply: SupplyPartTwo;
	maps: MapPartTwo[];
	seedRanges: Set<DataRange>;
	soilRanges: Set<DataRange>;
	fertilizerRanges: Set<DataRange>;
	waterRanges: Set<DataRange>;
	lightRanges: Set<DataRange>;
	temperatureRanges: Set<DataRange>;
	humidityRanges: Set<DataRange>;
	locationRanges: Set<DataRange>;
	minSeedRange: DataRange;
	constructor(data: string) {
		super(data);
		this.supply = this.supplyGroups.map((group) => new SupplyPartTwo(group))[0];
		this.maps = this.mapGroups.map((group) => new MapPartTwo(group));
		this.seedRanges = this.supply.ranges;
		this.minSeedRange = this.lookupRangeByNumber(this.supply.minSeed, this.seedRanges) as DataRange;
		this.soilRanges = this.maps.find((m) => m.heading.includes('to-soil'))?.ranges as Set<DataRange>;
		this.fertilizerRanges = this.maps.find((m) => m.heading.includes('to-fertilizer'))?.ranges as Set<DataRange>;
		this.waterRanges = this.maps.find((m) => m.heading.includes('to-water'))?.ranges as Set<DataRange>;
		this.lightRanges = this.maps.find((m) => m.heading.includes('to-light'))?.ranges as Set<DataRange>;
		this.temperatureRanges = this.maps.find((m) => m.heading.includes('to-temperature'))?.ranges as Set<DataRange>;
		this.humidityRanges = this.maps.find((m) => m.heading.includes('to-humidity'))?.ranges as Set<DataRange>;
		this.locationRanges = this.maps.find((m) => m.heading.includes('to-location'))?.ranges as Set<DataRange>;
		this.ranges = {
			seed: this.seedRanges,
			soil: this.soilRanges,
			fertilizer: this.fertilizerRanges,
			water: this.waterRanges,
			light: this.lightRanges,
			temperature: this.temperatureRanges,
			humidity: this.humidityRanges,
			location: this.locationRanges,
		};
	}
	getMapByInputType (inputType: string) {
		const map = this.maps.find((m) => m.heading.includes(`${inputType}-to`)) as MapPartTwo;
		return map;
	}
	lookupOutputNumberByInputNumber(inputNumber: number , ranges: Set<DataRange>): number {
		const range = this.lookupRangeByNumber(inputNumber, ranges);
		const rangeDiff = range?.get('diff') as number ?? 0;
		const outputNumber = inputNumber + rangeDiff;
		return outputNumber;
	}
	lookupRangeByNumber(number: number, ranges: Set<DataRange>): DataRange | null {
		const rangesArray = [...ranges]
		for (const range of rangesArray) {
			const min = range.get('min') as number;
			const max = range.get('max') as number;

			// if supply # is within range, return range
			if (number >= min && number <= max) {
				return range;
			}
		};
		return null;
	}
	lookupOutputRangeBySupplyRange(supplyMinMax: number[], inputRanges: Set<DataRange>, log?:boolean): number[][] | null {
		const [supplyMin, supplyMax] = supplyMinMax;
		const inputRangesAbsoluteMin = Math.min.apply(null, [...inputRanges].map((range) => range.get('min') as number));
		const inputRangesAbsoluteMax = Math.max.apply(null, [...inputRanges].map((range) => range.get('max') as number));

		// lookup input range
		const inputRangeOfMin = this.lookupRangeByNumber(supplyMin, inputRanges);
		const inputRangeOfMax = this.lookupRangeByNumber(supplyMax, inputRanges);
		if (log) console.log('inputRangeOfMin', inputRangeOfMin)
		if (log) console.log('inputRangeOfMax', inputRangeOfMax)

		// Case 1
		// if inputRangeOfMin and inputRangeOfMax are the same, calculate the output range from the input range
		if ( inputRangeOfMin !== null && inputRangeOfMin === inputRangeOfMax) {
			if (log) console.log('Case 1')
			const adjustedSupplyMin = supplyMin;
			const adjustedSupplyMax = supplyMax;
			const diff = inputRangeOfMin?.get('diff') as number ?? 0;
			const outputMin = adjustedSupplyMin + diff;
			const outputMax = adjustedSupplyMax + diff;
			return [[adjustedSupplyMin, adjustedSupplyMax], [outputMin, outputMax]];
		}
		// Case 2
		// if supplyMin and supplyMax are not in any inputRanges...
		else if (inputRangeOfMin === null && inputRangeOfMax === null) {

			if (log) console.log('Case 2')

			// Case 2a
			// if both supplyMin and supplyMax are below the first inputRange or above the last inputRange...
			if (
				(supplyMax < inputRangesAbsoluteMin) ||
				(supplyMin > inputRangesAbsoluteMax)
				) {
					if (log) console.log('case 2a')
					const adjustedSupplyMin = supplyMin;
					const adjustedSupplyMax = supplyMax;
					const diff = 0;
					const outputMin = adjustedSupplyMin + diff;
					const outputMax = adjustedSupplyMax + diff;
					return [[adjustedSupplyMin, adjustedSupplyMax], [outputMin, outputMax]];
				}
			// Case 2b
			// else if supplyMin is below the first inputRange and supplyMax is above the last inputRange
			else if (supplyMin < inputRangesAbsoluteMin && supplyMax > inputRangesAbsoluteMax) {
				if (log) console.log('case 2b')
				const adjustedSupplyMin = supplyMin;
				const adjustedSupplyMax = inputRangesAbsoluteMin - 1;
				const diff = 0;
				const outputMin = adjustedSupplyMin + diff;
				const outputMax = adjustedSupplyMax + diff;
				return [[supplyMin, adjustedSupplyMax], [outputMin, outputMax]];
			}

		}
		// Case 3
		// if supplyMin is not in inputRanges, but supplyMax is...
		else if (inputRangeOfMin === null && inputRangeOfMax !== null) {

			if (log) console.log('Case 3')

			// set the max of the adjusted supplyRange as one less than the min of the first inputRange
			const adjustedSupplyMin = supplyMin;
			const adjustedSupplyMax = inputRangesAbsoluteMin - 1;
			const diff = 0;
			const outputMin = adjustedSupplyMin + diff;
			const outputMax = adjustedSupplyMax + diff;
			return [[adjustedSupplyMin, adjustedSupplyMax], [outputMin, outputMax]];
		}
		// Case 4
		// if supplyMin is found in an input range, and SupplyMax is null
		else if (inputRangeOfMin !== null && inputRangeOfMax === null) {

			if (log) console.log('Case 4')

			const adjustedSupplyMin = supplyMin;
			const adjustedSupplyMax = inputRangeOfMin?.get('max') as number;
			const diff = inputRangeOfMin?.get('diff') as number ?? 0;
			const outputMin = adjustedSupplyMin + diff;
			const outputMax = adjustedSupplyMax + diff;
			return [[adjustedSupplyMin, adjustedSupplyMax], [outputMin, outputMax]];

			// set the max of the adjusted supplyRange as equal to the max of the inputRangeOfMin
		}
		// Case 5
		// if supplyMin is found in an input range, and SupplyMax does not match that input range...
		// note: inputRangeOfMax could be null or another inputRange
		else if (inputRangeOfMin !== null && inputRangeOfMax !== null && inputRangeOfMin !== inputRangeOfMax) {

			if (log) console.log('Case 5')

			const adjustedSupplyMin = supplyMin;
			const adjustedSupplyMax = inputRangeOfMin?.get('max') as number;
			const diff = inputRangeOfMin?.get('diff') as number ?? 0;
			const outputMin = adjustedSupplyMin + diff;
			const outputMax = adjustedSupplyMax + diff;
			return [[adjustedSupplyMin, adjustedSupplyMax], [outputMin, outputMax]];

			// set the max of the adjusted supplyRange as equal to the max of the inputRangeOfMin
		}
		else {
			throw new Error('unhandled case')
		}


		return null;

	}
	lookupSoilOutputRangeBySeedSupplyRange(seedSupplyRange: number[]): number[][] {
		const ranges = this.lookupOutputRangeBySupplyRange(seedSupplyRange, this.soilRanges);
		if (ranges) return ranges;
		else throw new Error('ranges is null');
	}
	lookupFertilizerOutputRangeBySoilSupplyRange(soilOutputRange: number[]): number[][] {
		const ranges = this.lookupOutputRangeBySupplyRange(soilOutputRange, this.fertilizerRanges);
		if (ranges) return ranges;
		else throw new Error('ranges is null');
	}
	lookupWaterOutputRangeByFertilizerSupplyRange(fertilizerOutputRange: number[]): number[][] {
		const ranges = this.lookupOutputRangeBySupplyRange(fertilizerOutputRange, this.waterRanges);
		if (ranges) return ranges;
		else throw new Error('ranges is null');
	}
	lookupLightOutputRangeByWaterSupplyRange(waterOutputRange: number[]): number[][] {
		const ranges = this.lookupOutputRangeBySupplyRange(waterOutputRange, this.lightRanges);
		if (ranges) return ranges;
		else throw new Error('ranges is null');
	}
	lookupTemperatureOutputRangeByLightSupplyRange(lightOutputRange: number[]): number[][] {
		const ranges = this.lookupOutputRangeBySupplyRange(lightOutputRange, this.temperatureRanges);
		if (ranges) return ranges;
		else throw new Error('ranges is null');
	}
	lookupHumidityOutputRangeByTemperatureSupplyRange(temperatureOutputRange: number[]): number[][] {
		const ranges = this.lookupOutputRangeBySupplyRange(temperatureOutputRange, this.humidityRanges);
		if (ranges) return ranges;
		else throw new Error('ranges is null');
	}
	lookupLocationOutputRangeByHumiditySupplyRange(humidityOutputRange: number[]): number[][] {
		const ranges = this.lookupOutputRangeBySupplyRange(humidityOutputRange, this.locationRanges);
		if (ranges) return ranges;
		else throw new Error('ranges is null');
	}
	lookupLocationFromSeed(seed: number, log?: boolean): number {
		const soil = this.lookupOutputNumberByInputNumber(seed, this.soilRanges);
		const fertilizer = this.lookupOutputNumberByInputNumber(soil, this.fertilizerRanges);
		const water = this.lookupOutputNumberByInputNumber(fertilizer, this.waterRanges);
		const light = this.lookupOutputNumberByInputNumber(water, this.lightRanges);
		const temperature = this.lookupOutputNumberByInputNumber(light, this.temperatureRanges);
		const humidity = this.lookupOutputNumberByInputNumber(temperature, this.humidityRanges);
		const location = this.lookupOutputNumberByInputNumber(humidity, this.locationRanges);
		if (log) {
			console.log('seed', seed)
			console.log('soil', soil);
			console.log('fertilizer', fertilizer);
			console.log('water', water);
			console.log('light', light);
			console.log('temperature', temperature);
			console.log('humidity', humidity);
			console.log('location', location);
		}
		return Number(location);
	}
	mapSeedRangeToLocationRange(seedSupplyRange: number[]){

		const [seedSupply, soilOutput] = this.lookupSoilOutputRangeBySeedSupplyRange(seedSupplyRange);
		const [soilSupply, fertilizerOutput] = this.lookupFertilizerOutputRangeBySoilSupplyRange(soilOutput);
		const [fertilizerSupply, waterOutput] = this.lookupWaterOutputRangeByFertilizerSupplyRange(fertilizerOutput);
		const [waterSupply, lightOutput] = this.lookupLightOutputRangeByWaterSupplyRange(waterOutput);
		const [lightSupply, temperatureOutput] = this.lookupTemperatureOutputRangeByLightSupplyRange(lightOutput);
		const [temperatureSupply, humidityOutput] = this.lookupHumidityOutputRangeByTemperatureSupplyRange(temperatureOutput);
		const [humiditySupply, locationOutput] = this.lookupLocationOutputRangeByHumiditySupplyRange(humidityOutput);

		// find the transform value
		const transform = locationOutput[0] - seedSupply[0];

		// find the location range length
		const locationRangeLength = locationOutput[1] - locationOutput[0] + 1;

		// adjust the seed input range to be the same length as the location output range
		const adjustedSeedSupplyMax = seedSupply[0] + locationRangeLength - 1;

		// calculate the lowest value in the seed input range
		const lowestValue = seedSupply[0] + transform;
		const corroboration = this.lookupLocationFromSeed(seedSupply[0])

		// confirm that the lowest value in the seed input range corresponds to the lowest value in the location output range
		if (lowestValue !== locationOutput[0]) {
			console.log('lowestValue', lowestValue);
			console.log('locationOutput[0]', locationOutput[0]);
			console.log('corroboration', corroboration);
			throw new Error('lowestValue !== locationOutput[0]');
		}

		// return the seed input range and the lowest value in that range
		return [seedSupply[0], adjustedSeedSupplyMax, lowestValue];
	}
}

	export class SupplyPartTwo {
	[key: string]: unknown;
	ranges: Set<DataRange>;
	minSeed: number;
	constructor(group: Group) {
		const dataString = group.firstLine.split(': ')[1];
		this.ranges = new Set(
			(dataString.match(/\d+(?: )+\d+/g) ?? []).map((range) => {
				const min = Number(range.split(' ')[0]);
				const length = Number(range.split(' ')[1]);
				const diff = 0;
				return new DataRange (min, length, diff);
			}).sort((a, b) => (a.get('min') as number) - (b.get('min') as number)
		));
		const iterator1 = this.ranges.values();
		this.minSeed = Math.min.apply(null, [...iterator1].map((range) => range.get('min') as number));
	}
}
export class MapPartTwo {
	[key: string]: unknown;
	heading: string;
	ranges: Set<DataRange>;

	constructor(group: Group) {
		// heading
		this.heading = group.heading.replace(' map', '');

		// mappings
		const dataLines = group.lines.slice(1);
		const unfilledRanges = new Set(dataLines.map((line) => new MappingDatumPartTwo(line).range).sort((a, b) => (a.get('min') as number) - (b.get('min') as number)));
		this.ranges = this.fillInRangeGaps(unfilledRanges);
	}
	fillInRangeGaps(ranges: Set<DataRange>) {
		let adjustedRanges: Set<DataRange> = ranges;
		ranges.forEach((range) => {
			// current values
			const currentMin = range.get('min') as number;
			const currentMax = range.get('max') as number;
			// find the lowest min value from existing ranges that is greater than the current max value
			const nextRange = this.findNextRange(range, ranges);
			const nextMin = nextRange?.get('min') as number ?? 0;
			// if next range exits and there is a gap between the current range and the next range, add a new range
			if (nextRange && nextMin && nextMin != currentMax + 1) {
				//console.log('we have a gap between the range ending with ' + currentMax + ' and the range starting with ' + nextMin + ' so we need to add a new range')
				const newMin = currentMax + 1;
				const newMax = nextMin - 1;
				const newLength = newMax - newMin + 1;
				const newRange = new DataRange (newMin, newLength, 0);
				adjustedRanges.add(newRange);
				adjustedRanges = this.sortRanges(adjustedRanges);
			}
		});
		return adjustedRanges;
	}
	findNextRange(range: DataRange , ranges: Set<DataRange>): DataRange  | null {
		const currentMax = range.get('max') as number;
		const rangesArray = [...ranges];
		const arrayOfMins = rangesArray.map((range) => range.get('min') as number);
		// filter arrayOfMins to just values where the min is greater than the current max
		const filteredMins = arrayOfMins.filter((min) => min > currentMax);
		// return null if there are no values
		if (filteredMins.length === 0) return null;
		// find the lowest min value from existing ranges that is greater than the current max value
		const nextMin = Math.min.apply(null, filteredMins);
		// find the range with that min value
		const nextRange = this.lookupRangeByNumber(nextMin, ranges);
		// const nextRange = rangesArray.find((range) => range.get('min') as number > currentMax);
		return nextRange;
	}
	sortRanges(ranges: Set<DataRange>) {
		const unsorted = [...ranges];
		const sorted = unsorted.sort((a, b) => {
					const aMin = a.get('min') as number;
					const bMin = b.get('min') as number;
					return aMin - bMin;
				});
		return new Set(sorted);
	}
	lookupRangeByNumber(number: number, ranges: Set<DataRange>): DataRange  | null {
		let result = null;
		for (const range of ranges) {
			const min = range.get('min') as number;
			const max = range.get('max') as number;
			if (number >= min && number <= max) {
				result = range;
			}
		};
		return result;
	}


}
export class MappingDatumPartTwo {
	range: DataRange ;
	constructor(dataLine: string) {
		const destinationMin = Number(dataLine.split(' ')[0].trim());
		const min = Number(dataLine.split(' ')[1].trim());
		const length = Number(dataLine.split(' ')[2].trim());
		const diff = destinationMin - min;
		this.range = new DataRange (min, length, diff);
	}
}






