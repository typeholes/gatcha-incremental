<template>Bankruptcy Value: {{ ceil(getBankruptcyValue()) }}</template>

<script setup lang="ts">
import { getBankruptcyValue, ceil } from 'src/ts/game';
</script>
