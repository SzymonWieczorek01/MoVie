<template>
  <div class="movie-swipe-menu">
    <movie-swipe />
  </div>
</template>

<script>
import MovieSwipe from '../components/movie/MovieSwipe.vue';

export default {
  components: {
    MovieSwipe
  }
}
</script>

<style scoped>
.movie-swipe-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
</style>
