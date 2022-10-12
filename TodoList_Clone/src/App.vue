<template>
  <header>
    <hgroup class="my-5">
      <h1>나의 할일</h1>
      <em>{{ today }}</em>
    </hgroup>
  </header>
  <todo-list-container />
</template>

<script>
  export default {
    name: 'App',
  }
</script>

<script setup>
  //script setup에서는 return 및 component가 필요없다.
  import { inject } from 'vue'
  import TodoListContainer from './components/TodoListContainer.vue'

  const today = inject('today');
</script>

<style>
  hgroup {
    text-align: center;
    font-family: 'Arial Bold';
  }

  hgroup h1 {
    font-weight: bolder;
  }
</style>