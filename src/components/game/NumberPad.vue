<template>
	<div class="number-pad">
		<button
			v-for="number in 9"
			:key="number"
			class="number-button"
			:class="{ disabled: isNumberFullyUsed(number) }"
			@click="$emit('input', number)"
		>
			{{ number }}
		</button>
	</div>
</template>

<script setup lang="ts">
import { type Cell } from '@/types/game';

interface Props {
	grid: Cell[][];
}

const props = defineProps<Props>();

defineEmits<{
	(e: 'input', value: number): void;
}>();

const isNumberFullyUsed = (number: number): boolean => {
	let count = 0;
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			if (props.grid[row][col].value === number) {
				count++;
			}
		}
	}
	return count >= 9;
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/main';

.number-pad {
	display: flex;
	gap: 4px;
	width: fit-content;
	margin: 0 auto;

	.number-button {
		@include flex-center;
		width: clamp(32px, 8vw, 40px);
		height: clamp(32px, 8vw, 40px);
		font-size: clamp(0.75rem, 1.5vw, 0.875rem);
		font-weight: 500;
		color: $text-primary;
		background: white;
		border-radius: 50%;
		transition: $transition-fast;
		box-shadow: $shadow-sm;

		&:hover:not(.disabled) {
			background: rgba($primary-color, 0.1);
			color: $primary-color;
		}

		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
}
</style>
