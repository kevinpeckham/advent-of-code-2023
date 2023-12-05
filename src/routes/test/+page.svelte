<!--
@component
Test
-->

<script lang='ts'>
import PuzzlePageTabs from "$components/molecules/PuzzlePageTabs.svelte";
</script>

<template lang='pug'>
main
  PuzzlePageTabs(let:panelIndex!="{panelIndex}")
    .w-full.h-full(slot="visualization") Visualization panel
    .w-full.h-full(slot="solution") Solution panel
    .w-full(slot="data") Data panel

</template>