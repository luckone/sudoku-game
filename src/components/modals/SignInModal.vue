<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content card">
      <h2>Sign in</h2>
      <p class="score-info">Sign in to save your score and compete with others!</p>

      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <label>Your Name</label>
          <input v-model="name" type="text" placeholder="Enter your name" required />
        </div>

        <button class="primary-button" type="submit">Continue Playing</button>

        <button type="button" class="text-button" @click="continueAsGuest">
          Continue as Guest
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/auth';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'signed-in'): void;
  }>();

  const authStore = useAuthStore();
  const name = ref('');

  const handleSubmit = () => {
    if (name.value.trim()) {
      authStore.signIn(name.value.trim());
      emit('signed-in');
      emit('close');
    }
  };

  const continueAsGuest = () => {
    emit('close');
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

      h2 {
        margin-bottom: $spacing-sm;
        color: $text-primary;
        font-size: 1.5rem;
      }

      .score-info {
        color: $text-secondary;
        margin-bottom: $spacing-lg;
      }

      .input-group {
        margin-bottom: $spacing-lg;
        text-align: left;

        label {
          display: block;
          margin-bottom: $spacing-xs;
          color: $text-secondary;
          font-size: 0.9rem;
        }

        input {
          width: 100%;
          padding: $spacing-sm;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: $radius-md;
          font-size: 1rem;

          &:focus {
            border-color: $primary-color;
            outline: none;
          }
        }
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
  }
</style>
