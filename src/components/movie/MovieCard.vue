<template>
  <div class="movie-card">
    <img v-bind:src="'https://image.tmdb.org/t/p/w500'+movie.poster_path" alt="Movie Poster" class="movie-poster" />
    <h3>{{ movie.title }}</h3>
    <p>{{ movie.summary }}</p>
    <button @click="$emit('swipe', 'like')">Like</button>
    <button @click="$emit('swipe', 'dislike')">Dislike</button>
    <button @click="$emit('swipe', 'watched')">Watched</button>
  </div>
</template>

<script>
export default {
  name: 'MovieCard',
  props: {
    movie: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.movie-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 10px;
}
.movie-poster {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
}
</style>
