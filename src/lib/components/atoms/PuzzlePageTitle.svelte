<!--
@component
Here's some documentation for this component.
-->

<script lang='ts'>
// get context api
import { getContext } from 'svelte';

const content = getContext('content') as {[key:string]: string | undefined};
const puzzleDay = content.day ?? '0';
const puzzleTitle = content.title ?? 'undefined';

</script>

<template lang='pug'>
  h1.font-semibold.text-20 Day {puzzleDay} - {puzzleTitle}
</template>