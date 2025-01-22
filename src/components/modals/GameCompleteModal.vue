<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content card">
      <h2>Congratulations!</h2>
      <div class="score-breakdown">
        <div class="score-item">
          <span>Base Score:</span>
          <span>{{ baseScore }}</span>
        </div>
        <div class="score-item">
          <span>Time Bonus:</span>
          <span>{{ timeBonus }}</span>
        </div>
        <div class="score-item total">
          <span>Total Score:</span>
          <span>{{ totalScore }}</span>
        </div>
      </div>

      <div class="time">Time: {{ formatTime(time) }}</div>

      <div class="actions">
        <button class="primary-button" @click="$emit('new-game')">New Game</button>
        <button class="text-button" @click="$emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    baseScore: number;
    timeBonus: number;
    totalScore: number;
    time: number;
  }>();

  defineEmits<{
    (e: 'close'): void;
    (e: 'new-game'): void;
  }>();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/main';

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-md;
    z-index: 100;

    .modal-content {
      width: 100%;
      max-width: 400px;
      text-align: center;
    }

    .primary-button {
      width: 100%;
      margin-bottom: $spacing-sm;
    }

    .text-button {
      width: 100%;
      padding: $spacing-sm;
      color: $text-secondary;
      font-size: 0.9rem;

      &:hover {
        color: $text-primary;
      }
    }
  }

  .score-breakdown {
    margin: $spacing-lg 0;

    .score-item {
      @include flex-between;
      padding: $spacing-sm;

      &.total {
        margin-top: $spacing-sm;
        font-weight: 600;
        color: $primary-color;
        border-top: 1px solid $background-gray;
        padding-top: $spacing-md;
      }
    }
  }

  .time {
    color: $text-secondary;
    margin-bottom: $spacing-lg;
  }
</style>
