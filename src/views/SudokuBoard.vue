<template>
	<div class="game-view">
		<div class="game-content">
			<div class="container">
				<div class="main-section">
					<GameHeader
						:player-name="user.name.name"
						:time="gameTime"
						:score="totalScore"
						@back="router.push('/')"
						@toggle-leaderboard="showLeaderboard = true"
					/>

					<div class="game-board">
						<GameGrid
							:grid="grid"
							:selected-cell="currentSelected"
							@select="selectCell"
						/>
					</div>

					<div class="game-controls">
						<NumberPad :grid="grid" @input="inputNumber" />
						<GameControls
							:hints-remaining="hintsRemaining"
							:can-undo="canUndo"
							@undo="handleUndo"
							@hint="handleHint"
						/>
					</div>
				</div>
			</div>

			<Drawer v-model="showLeaderboard">
				<template #header>
					<Trophy class="icon" />
					Leaderboard
				</template>
				<Leaderboard :data="leaderboard" compact />
			</Drawer>

			<GameCompleteModal
				v-if="showGameComplete"
				:base-score="baseScore"
				:time-bonus="timeBonus"
				:total-score="totalScore"
				:time="gameTime"
				@close="handleGameCompleteClose"
				@new-game="startNewGame"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/game';
import { useAuthStore } from '@/stores/auth';
import { Trophy } from 'lucide-vue-next';

import GameHeader from '@/components/game/GameHeader.vue';
import GameGrid from '@/components/game/GameGrid.vue';
import NumberPad from '@/components/game/NumberPad.vue';
import GameControls from '@/components/game/GameControls.vue';
import Leaderboard from '@/components/leaderboard/Leaderboard.vue';
import Drawer from '@/components/common/Drawer.vue';
import GameCompleteModal from '@/components/modals/GameCompleteModal.vue';

const router = useRouter();
const { user } = toRefs(useAuthStore());
const gameStore = useGameStore();

const {
	grid,
	totalScore,
	hintsRemaining,
	canUndo,
	leaderboard,
	gameTime,
	gameStatus,
	difficulty,
	baseScore,
	timeBonus,
	isGameComplete,
} = toRefs(gameStore);

const {
	makeMove,
	initializeGame,
	incrementTime,
	undoMove,
	useHint,
	calculateFinalScore,
} = gameStore;

const currentSelected = ref<[number, number] | null>(null);
const showLeaderboard = ref(false);
const showGameComplete = ref(false);

let timer: ReturnType<typeof setInterval>;

onMounted(() => {
	if (gameStatus.value === 'IDLE') {
		initializeGame(difficulty.value);
	}
	startTimer();
	window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
	clearInterval(timer);
	window.removeEventListener('keydown', handleKeyPress);
});

watch(isGameComplete, (complete) => {
	if (complete) handleGameComplete();
});

const handleGameComplete = () => {
	clearInterval(timer);
	calculateFinalScore();
	showGameComplete.value = true;
};

const inputNumber = (number: number) => {
	if (!currentSelected.value) return;

	const [row, col] = currentSelected.value;
	if (!grid.value[row][col].isPrefilled) {
		makeMove(row, col, number);
	}
};

const startNewGame = () => {
	showGameComplete.value = false;
	initializeGame(difficulty.value);
	startTimer();
};

const handleGameCompleteClose = () => {
	showGameComplete.value = false;
	router.push('/');
};

const startTimer = () => {
	timer = setInterval(incrementTime, 1000);
};

const selectCell = (row: number, col: number) => {
	if (!grid.value[row][col].isPrefilled) {
		currentSelected.value = [row, col];
	}
};

const handleUndo = undoMove;

const handleHint = () => {
	if (currentSelected.value && hintsRemaining.value > 0) {
		const [row, col] = currentSelected.value;
		if (!grid.value[row][col].isPrefilled) {
			useHint(row, col);
		}
	}
};

const handleKeyPress = (event: KeyboardEvent) => {
	if (!currentSelected.value) return;

	const key = event.key;
	const number = parseInt(key);

	if (!isNaN(number) && number >= 1 && number <= 9) {
		inputNumber(number);
	} else if (key === 'h' || key === 'H') {
		handleHint();
	}
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/main';

.game-view {
	min-height: 100vh;
	background: $background-main;
	padding: clamp(1rem, 3vw, 2rem);

	.game-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		gap: clamp(1.5rem, 4vw, 2.5rem);
		flex-direction: column;

		@media (min-width: 1024px) {
			flex-direction: row;
			align-items: flex-start;
		}

		.main-section {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 1.5rem;
		}

		.leaderboard-section {
			width: 100%;

			@media (min-width: 1024px) {
				width: 300px;
				position: sticky;
				top: clamp(1rem, 3vw, 2rem);
			}
		}
	}

	.game-board {
		@include flex-center;
		width: 100%;
	}

	.game-controls {
		width: 100%;
	}
}
</style>
