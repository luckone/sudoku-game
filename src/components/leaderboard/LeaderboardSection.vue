<template>
	<div class="difficulty-section">
		<h3>{{ formatDifficulty(difficulty) }}</h3>
		<div class="scores">
			<div
				v-for="(score, index) in scores"
				:key="index"
				class="score-item"
				:class="{ 'top-score': index === 0 }"
			>
				<div class="rank">{{ index + 1 }}</div>
				<div class="details">
					<span class="points">{{ score.points }}</span>
					<span class="player">{{ score.player }}</span>
				</div>
			</div>
			<div v-if="!scores.length" class="no-scores">No scores yet</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { GameDifficulty, type LeaderboardEntry } from '@/types/game';

defineProps<{
	difficulty: GameDifficulty;
	scores: LeaderboardEntry[];
}>();

const formatDifficulty = (difficulty: string): string => {
	return difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/main';

.difficulty-section {
	h3 {
		color: $text-secondary;
		font-size: 1rem;
		margin-bottom: $spacing-sm;
		padding-bottom: $spacing-xs;
		border-bottom: 1px solid rgba($primary-color, 0.1);
	}

	.scores {
		display: grid;
		gap: $spacing-xs;

		.score-item {
			display: flex;
			align-items: center;
			padding: $spacing-xs $spacing-sm;
			background: rgba(white, 0.5);
			border-radius: $radius-sm;
			transition: $transition-fast;

			&:hover {
				transform: translateX(4px);
			}

			&.top-score {
				background: rgba($primary-color, 0.1);

				.rank {
					background: $primary-color;
				}

				.points {
					color: $primary-color;
					font-weight: 600;
				}
			}

			.rank {
				width: 24px;
				height: 24px;
				@include flex-center;
				background: $text-secondary;
				color: white;
				border-radius: 50%;
				font-size: 0.8rem;
				font-weight: 500;
			}

			.details {
				margin-left: $spacing-sm;
				display: flex;
				gap: $spacing-sm;
				align-items: center;

				.points {
					font-weight: 500;
					color: $text-primary;
				}

				.player {
					color: $text-secondary;
					font-size: 0.9rem;
				}
			}
		}

		.no-scores {
			color: $text-secondary;
			text-align: center;
			padding: $spacing-sm;
			font-size: 0.9rem;
		}
	}
}
</style>
