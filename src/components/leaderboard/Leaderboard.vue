<template>
  <div class="leaderboard">
    <h2>
      <Medal class="section-icon" />
      Leaderboard
    </h2>
    <div class="leaderboard-wrapper">
      <div v-for="(scores, difficulty) in data" :key="difficulty" class="section-wrapper">
        <LeaderboardSection :difficulty="difficulty as GameDifficulty" :scores="scores" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { LeaderboardEntry } from '@/types/game';
  import LeaderboardSection from './LeaderboardSection.vue';
  import { Medal } from 'lucide-vue-next';
  import { GameDifficulty } from '@/types/game';

  defineProps<{
    data: Record<string, LeaderboardEntry[]>;
    currentDifficulty?: string;
    compact?: boolean;
  }>();
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/main';

  .leaderboard {
    background: $background-gray;
    border-radius: $radius-md;
    padding: $spacing-lg;

    h2 {
      color: $text-primary;
      margin-bottom: $spacing-lg;
      font-size: 1.2rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $spacing-sm;

      .section-icon {
        color: $primary-color;
        width: 24px;
        height: 24px;
      }
    }
  }

  .leaderboard-wrapper {
    .section-wrapper {
      & + .section-wrapper {
        margin-top: $spacing-lg;
      }
    }

    &.compact {
      .section-wrapper {
        margin-top: $spacing-md;
      }
    }
  }
</style>
