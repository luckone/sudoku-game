<template>
	<div class="difficulty-selector">
		<button
			v-for="level in difficultyLevels"
			:key="level.type"
			class="difficulty-btn"
			:class="{ active: modelValue === level.type }"
			@click="$emit('update:modelValue', level.type)"
		>
			<span class="difficulty-header">
				<component :is="level.icon" />
				<span>{{ level.name }}</span>
			</span>
			<span class="description">
				<Grid class="grid-icon" />
				{{ level.description }}
			</span>
		</button>
	</div>
</template>

<script setup lang="ts">
import { GameDifficulty } from '@/types/game';
import { Baby, GraduationCap, Swords, Crown, Grid } from 'lucide-vue-next';

defineProps<{
	modelValue: GameDifficulty | null;
}>();

defineEmits<{
	(e: 'update:modelValue', value: GameDifficulty): void;
}>();

const difficultyLevels = [
	{
		type: GameDifficulty.BEGINNER,
		name: 'Beginner',
		description: '36-40 cells visible',
		icon: Baby,
	},
	{
		type: GameDifficulty.INTERMEDIATE,
		name: 'Intermediate',
		description: '32-36 cells visible',
		icon: GraduationCap,
	},
	{
		type: GameDifficulty.HARD,
		name: 'Hard',
		description: '28-32 cells visible',
		icon: Swords,
	},
	{
		type: GameDifficulty.EXPERT,
		name: 'Expert',
		description: '24-28 cells visible',
		icon: Crown,
	},
];
</script>

<style lang="scss" scoped>
@import '@/assets/styles/main';

.difficulty-selector {
	display: grid;
	gap: $spacing-md;
	margin-bottom: $spacing-xl;

	.difficulty-btn {
		background: $background-gray;
		padding: $spacing-lg;
		border-radius: $radius-md;
		text-align: left;
		transition: $transition-fast;

		.difficulty-header {
			display: flex;
			align-items: center;
			gap: $spacing-sm;
			margin-bottom: $spacing-xs;
			color: $text-primary;
			font-weight: 600;

			svg {
				width: 24px;
				height: 24px;
			}
		}

		.description {
			display: flex;
			align-items: center;
			gap: $spacing-xs;
			color: $text-secondary;
			font-size: 0.9rem;

			.grid-icon {
				width: 16px;
				height: 16px;
				opacity: 0.7;
			}
		}

		&:hover {
			background: darken($background-gray, 5%);
		}

		&.active {
			background: $primary-color;

			.difficulty-header,
			.description {
				color: white;
			}

			svg {
				color: white;
			}
		}
	}
}
</style>
