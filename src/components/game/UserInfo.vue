<template>
  <div class="user-info">
    <div class="avatar">
      {{ user.name[0].toUpperCase() }}
    </div>
    <span class="name">{{ user.name }}</span>
  </div>
</template>

<script setup lang="ts">
  import { User } from '@/types/game';

  defineProps<{
    user: User;
  }>();
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/main';

  .user-info {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-lg;

    .avatar {
      width: 40px;
      height: 40px;
      @include flex-center;
      background: $primary-color;
      color: white;
      border-radius: 50%;
      font-weight: 600;
      font-size: 1.2rem;
    }

    .name {
      font-weight: 500;
      color: $text-primary;
    }
  }
</style>
