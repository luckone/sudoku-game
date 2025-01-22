<template>
	<div
		class="drawer-overlay"
		:class="{ active: modelValue }"
		@click.self="$emit('update:modelValue', false)"
	>
		<div class="drawer" :class="{ active: modelValue }">
			<div class="drawer-header">
				<h2>
					<slot name="header"></slot>
				</h2>
				<button class="close-button" @click="$emit('update:modelValue', false)">
					<X />
				</button>
			</div>
			<div class="drawer-content">
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';

defineProps<{
	modelValue: boolean;
}>();

defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
}>();
</script>

<style lang="scss" scoped>
@import '@/assets/styles/main';

.drawer-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 50;
	opacity: 0;
	visibility: hidden;
	transition: all $transition-fast;

	&.active {
		opacity: 1;
		visibility: visible;
	}
}

.drawer {
	position: fixed;
	top: 0;
	right: -100%;
	width: 100%;
	max-width: 400px;
	height: 100vh;
	background: white;
	box-shadow: $shadow-lg;
	transition: right $transition-fast;
	display: flex;
	flex-direction: column;

	&.active {
		right: 0;
	}

	.drawer-header {
		padding: $spacing-md;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: space-between;

		h2 {
			font-size: 1.2rem;
			color: $text-primary;
			display: flex;
			align-items: center;
			gap: $spacing-sm;
		}

		.close-button {
			color: $text-secondary;
			padding: $spacing-xs;

			&:hover {
				color: $text-primary;
			}
		}
	}

	.drawer-content {
		flex: 1;
		overflow-y: auto;
		padding: $spacing-md;
	}
}
</style>
