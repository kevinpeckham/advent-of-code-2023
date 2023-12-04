import type { Config } from "tailwindcss";

// declarations
const fontSizePxClasses0to50 = buildFontSizePxClasses(0, 51, 1);
const fontSizePxClasses50to500 = buildFontSizePxClasses(50, 501, 10);
const fontWeightClasses = buildFontWeightClasses();

const config: Config = {
	content: ["./src/**/*.{html,pug,js,svelte,ts,json}"],
	theme: {
		extend: {
			colors: {
				// custom rules for starter web page, remove these for your own project
				primary: "#142239",
				accent: "#ebf92f",
			},
			fontWeight: {
				...fontWeightClasses,
			},
			fontSize: {
				...fontSizePxClasses0to50,
				...fontSizePxClasses50to500,
			},
		},
	}
};

	export default config;

// helper functions for config
function buildFontSizePxClasses(min?: number, max?: number, step?: number) {
	max = max ?? 51;
	min = min ?? 0;
	step = step ?? 1;
	const obj: { [key: string]: string } = {};
	for (let i = min; i < max; i += step) {
		const key = `${i}`;
		const value = `${i}px`;
		obj[key] = value;
	}
	return obj;
}

function buildFontWeightClasses() {
	const obj: { [key: string]: string } = {};
	for (let i = 100; i < 1000; i += 100) {
		const key = `${i}`;
		const value = `${i}`;
		obj[key] = value;
	}
	return obj;
}

