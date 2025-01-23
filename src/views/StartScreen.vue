<template>
	<div class="start-screen">
		<div class="content card">
			<UserInfo v-if="!user.isGuest" :user="user" />

			<h1>Sudoku</h1>
			<p class="subtitle">Pick your challenge level</p>

			<DifficultySelector
				v-model="selectedDifficulty"
				@update:model-value="selectDifficulty"
			/>

			<button
				class="primary-button play-btn"
				:disabled="!selectedDifficulty"
				@click="handleStartGame"
			>
				<PlayCircle class="play-icon" />
				Start Game
			</button>

			<Leaderboard :data="leaderboard" />
		</div>

		<SignInModal
			v-if="showSignInModal"
			@close="handleSignInModalClose"
			@signed-in="handleSignIn"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/game';
import { useAuthStore } from '@/stores/auth';
import { GameDifficulty } from '@/types/game';
import { PlayCircle } from 'lucide-vue-next';

import UserInfo from '@/components/game/UserInfo.vue';
import DifficultySelector from '@/components/game/DifficultySelector.vue';
import Leaderboard from '@/components/leaderboard/Leaderboard.vue';
import SignInModal from '@/components/modals/SignInModal.vue';

const router = useRouter();
const { user } = toRefs(useAuthStore());
const gameStore = useGameStore();

const { leaderboard } = toRefs(gameStore);
const { initializeGame } = gameStore;

const selectedDifficulty = ref<GameDifficulty>(GameDifficulty.BEGINNER);
const showSignInModal = ref(false);

const selectDifficulty = (difficulty: GameDifficulty) => {
	selectedDifficulty.value = difficulty;
};

const startGame = () => {
	if (selectedDifficulty.value) {
		initializeGame(selectedDifficulty.value);
		router.push('/game');
	}
};
const handleStartGame = () => {
	if (user.value.isGuest) {
		showSignInModal.value = true;
	} else {
		startGame();
	}
};

const handleSignIn = () => {
	showSignInModal.value = false;
	startGame();
};

const handleSignInModalClose = () => {
	showSignInModal.value = false;
	startGame();
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/main';

.start-screen {
	min-height: 100vh;
	background: $background-main;
	padding: clamp(1rem, 3vw, 2rem);
	display: flex;
	align-items: center;
	justify-content: center;

	.content {
		width: 100%;
		max-width: 500px;
		text-align: center;
		background: white;
		border-radius: $radius-xl;
		padding: clamp(1.5rem, 4vw, 2.5rem);
		box-shadow: $shadow-md;

		h1 {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: $spacing-sm;
			font-size: clamp(1.8rem, 4vw, 2.5rem);
			color: $text-primary;
			margin-bottom: $spacing-xs;

			.title-icon {
				color: $primary-color;
				width: clamp(24px, 5vw, 32px);
				height: clamp(24px, 5vw, 32px);
			}
		}

		.subtitle {
			color: $text-secondary;
			margin-bottom: clamp(1.5rem, 4vw, 2.5rem);
		}

		.sign-in-button {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: $spacing-sm;
			width: 100%;
			padding: $spacing-sm;
			color: $text-secondary;
			background: $background-gray;
			border-radius: $radius-md;
			margin-bottom: $spacing-md;

			.icon {
				width: 18px;
				height: 18px;
			}

			&:hover {
				background: darken($background-gray, 5%);
			}
		}

		.play-btn {
			width: 100%;
			margin-bottom: $spacing-xl;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: $spacing-sm;

			.play-icon {
				width: 20px;
				height: 20px;
			}

			&:disabled {
				opacity: 0.2;
				cursor: not-allowed;
			}
		}
	}
}
</style>
