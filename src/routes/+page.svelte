<!-- Example Svelte Page / Starter Web Page-->
<script lang="ts">
	// components
	import ButtonLink from "$atoms/ButtonLink.svelte";
	import Footer from "$components/organisms/Footer.svelte";
	import PreFooter from "$atoms/PreFooter.svelte";

	// types
	import type { LayoutData } from "./$types";

	// catch data from layout function in +layout.ts
	// export let data: LayoutData;
</script>

<template lang="pug">
	//- head
	svelte:head
		title Svelte Pug Tailwind Typescript | Starter Template
		meta(
			content="A node starter template for the Svelte, Typescript, TailwindCSS, and Pug stack.",
			name="description"
		)

	//- body
	main.relative.grid.grid-cols-1.min-h-screen.place-items-center.p-4.pb-48
		div(class="sm:max-w-lg lg:max-w-xl xl:max-w-2xl")
			.mb-20

			.text-center(class="sm:text-left")
				//- headline
				h1.text-22.mb-3.font-semibold.text-accent
					| Advent of Code 2023

				//- text
				.text-md.mb-10.text-neutral-100.text-18(class="sm:mb-8 leading-relaxed")
					p.mb-3 This is my first year participating in Advent of Code. Thought I would give it a try, and so far it's been really fun.
					p I'm using Sveltekit and Typescript. Sveltekit allows me to quickly generate visualizations of the data. Typescript helps me catch errors and makes the code easier to read.

				.grid(class!="grid-cols-7 gap-y-1")
					+each('Array(28) as day, index')
							a(href!="/{index - 3}" class="text-accent hover:text-accent") { index < 4 || index > 27 ? '' : index - 3 }
					//- ButtonLink(
				//- 	targetUrl="https://github.com/lightning-jar/lj-sveltekit-ts-tailwind-pug-starter",
				//- 	title="View project on Github"
				//- )
				//- 	| Github

	//- pre-footer
	//- PreFooter(
	//- 	targetUrl="https://pugify.dev",
	//- 	title="convert HTML to pug"
	//- )
	//- 	svelte:fragment(slot="default") Also check out the ad-free HTML to Pug converter @ https://pugify.dev

	//- footer
	Footer(
		authorLink="https://fosstodon.org/@kevinpeckham",
		orgLink="https://lightningjar.com"
	)
		svelte:fragment(slot="author") Kevin Peckham
		svelte:fragment(slot="org") Lightning Jar
</template>
