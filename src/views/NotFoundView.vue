<template>
  <div class="not-found-view">
    <h1>404 - Page Not Found</h1>
    <router-link to="/">Go Home</router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-facing-decorator';

@Component({
  name: 'NotFoundView'
})
export default class NotFoundView extends Vue {}
</script>

<style scoped>
.not-found-view {
  padding: 2rem;
  text-align: center;
}
</style>
