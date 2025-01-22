import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Start',
      component: () => import('../views/StartScreen.vue'),
    },
    {
      path: '/game',
      name: 'Game',
      component: () => import('../views/SudokuBoard.vue'),
    },
  ],
});

export default router;
