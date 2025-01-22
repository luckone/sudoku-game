<template>
	<div class="action-buttons">
		<button class="action-button" :disabled="!canUndo" @click="$emit('undo')">
			<RotateCcw class="icon" />
			<span>Undo</span>
		</button>

		<button
			class="action-button"
			:disabled="hintsRemaining === 0"
			@click="$emit('hint')"
		>
			<Lightbulb class="icon" />
			<span>Hint ({{ hintsRemaining }})</span>
		</button>
	</div>
</template>

<script setup lang="ts">
import { RotateCcw, Lightbulb } from 'lucide-vue-next';

defineProps<{
	hintsRemaining: number;
	canUndo: boolean;
}>();

defineEmits<{
	(e: 'undo'): void;
	(e: 'hint'): void;
}>();
</script>

<style lang="scss" scoped>
@import '@/assets/styles/main';

.action-buttons {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: clamp(0.5rem, 2vw, 1rem);
	margin-top: clamp(1rem, 3vw, 1.5rem);

	.action-button {
		@include flex-center;
		flex-direction: column;
		gap: $spacing-xs;
		padding: clamp(0.5rem, 2vw, 1rem);
		background: white;
		border-radius: $radius-md;
		color: $text-secondary;
		font-size: clamp(0.75rem, 2vw, 0.9rem);
		box-shadow: $shadow-sm;

		.icon {
			width: clamp(16px, 4vw, 20px);
			height: clamp(16px, 4vw, 20px);
		}

		&:hover:not(&:disabled) {
			color: $primary-color;
			background: rgba($primary-color, 0.04);
		}

		&:disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}
	}
}
</style>
