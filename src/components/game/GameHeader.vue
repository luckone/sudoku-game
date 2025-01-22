<template>
	<div class="game-header">
		<button class="back-button" @click="$emit('back')">
			<ChevronLeft class="icon" />
			Back
		</button>

		<div class="game-info">
			<div v-if="playerName" class="player">{{ playerName }}</div>
			<div class="stats">
				<div class="score">Score: {{ score }}</div>
				<div class="time">Time: {{ formatTime(time) }}</div>
			</div>
		</div>

			<button class="leaderboard-button" @click="$emit('toggle-leaderboard')">
				<Trophy class="icon" />
			</button>
	</div>
</template>

<script setup lang="ts">
import { ChevronLeft, Trophy } from 'lucide-vue-next';

defineProps<{
	playerName?: string;
	time: number;
	score: number;
}>();

defineEmits<{
	(e: 'back'): void;
	(e: 'toggle-leaderboard'): void;
}>();

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/main';
.game-header {
	@include flex-between;
	padding: $spacing-sm;

	.back-button {
		@include flex-center;
		gap: 0.5rem;
		color: $text-secondary;
		font-weight: 500;
		font-size: 0.875rem;

		.icon {
			width: 18px;
			height: 18px;
		}

		&:hover {
			color: $text-primary;
		}
	}

	.game-info {
		text-align: center;

		.player {
			font-weight: 500;
			color: $text-primary;
			margin-bottom: 0.25rem;
		}

		.stats {
			display: flex;
			gap: $spacing-md;
			color: $text-secondary;
			font-size: 0.875rem;

			.score {
				font-weight: 500;
				color: $primary-color;
			}
		}
	}

	.leaderboard-button {
		@include flex-center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: $background-gray;
		color: $text-secondary;

		&:hover {
			background: darken($background-gray, 5%);
			color: $primary-color;
		}
	}
}
</style>
