<template>
	<div class="sudoku-grid">
		<div
			v-for="(row, rowIndex) in grid"
			:key="`row-${rowIndex}`"
			class="grid-row"
			:class="{ completed: isRowCompleted(rowIndex) }"
		>
			<div
				v-for="(cell, colIndex) in row"
				:key="`cell-${rowIndex}-${colIndex}`"
				class="grid-cell"
				:class="{
					prefilled: cell.isPrefilled,
					selected: isSelected(rowIndex, colIndex),
					error: cell.hasError,
					'column-completed': isColumnCompleted(colIndex),
					'box-completed': isBoxCompleted(rowIndex, colIndex),
				}"
				@click="$emit('select', rowIndex, colIndex)"
			>
				{{ cell.value || '' }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { type Cell } from '@/types/game';

interface Props {
	grid: Cell[][];
	selectedCell: [number, number] | null;
}

const props = defineProps<Props>();

defineEmits<{
	(e: 'select', row: number, col: number): void;
}>();

const isSelected = (row: number, col: number): boolean => {
	return props.selectedCell?.[0] === row && props.selectedCell?.[1] === col;
};

const isRowCompleted = (rowIndex: number) =>
	props.grid[rowIndex].every((cell) => !cell.hasError && cell.value !== 0);

const isColumnCompleted = (colIndex: number) =>
	props.grid.every(
		(row) => !row[colIndex].hasError && row[colIndex].value !== 0
	);

const isBoxCompleted = (rowIndex: number, colIndex: number) => {
	const boxRow = Math.floor(rowIndex / 3) * 3;
	const boxCol = Math.floor(colIndex / 3) * 3;

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			const cell = props.grid[boxRow + i][boxCol + j];
			if (cell.value === 0 || cell.hasError) {
				return false;
			}
		}
	}
	return true;
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/main';

.sudoku-grid {
	width: min(100%, 500px);
	aspect-ratio: 1;
	background: white;
	border-radius: $radius-xl;
	padding: clamp(0.5rem, 3vw, 1rem);
	box-shadow: $shadow-md;
	border: 2px solid rgba(0, 0, 0, 0.3);

	.grid-row {
		display: grid;
		grid-template-columns: repeat(9, 1fr);

		&:not(:last-child) {
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		}

		&:nth-child(3n) {
			border-bottom: 2px solid rgba(0, 0, 0, 0.3);
		}

		&:last-child {
			border-bottom: none;
		}

		.grid-cell {
			aspect-ratio: 1;
			@include flex-center;
			font-size: clamp(0.875rem, 3vw, 1.2rem);
			font-weight: 500;
			color: $text-primary;
			cursor: pointer;
			transition: $transition-fast;
			border-right: 1px solid rgba(0, 0, 0, 0.1);

			&:nth-child(3n) {
				border-right: 2px solid rgba(0, 0, 0, 0.3);
			}

			&:last-child {
				border-right: none;
			}

			&.prefilled {
				background: rgba(0, 0, 0, 0.05);
				font-weight: 600;
			}

			&.selected {
				background: rgba($primary-light, 0.25);
				color: $text-primary;
				z-index: 1;
			}

			&.error {
				background: #ffebee;
				color: #d32f2f;
			}
		}
	}

	.grid-row {
		&.completed {
			animation: completionPulse 1s ease-in-out;
		}
	}

	.grid-cell {
		&.column-completed {
			animation: completionPulse 1s ease-in-out;
		}

		&.box-completed {
			animation: completionPulse 1s ease-in-out;
		}
	}

	@keyframes completionPulse {
		0% {
			background: rgba($primary-color, 0);
		}
		50% {
			background: rgba($primary-color, 0.2);
		}
		100% {
			background: rgba($primary-color, 0);
		}
	}
}
</style>
