<template>
  <div class="profile">
    <h1>User Profile</h1>
    <div>
      <h2>{{ userName }}</h2>
      <p>{{ userEmail }}</p>
    </div>
    <div class="opinions">
      <h3>Opinions:</h3>
      <ul>
        <li v-for="opinion in userWatchedMovies" :key="opinion.id">{{ opinion.film_name }} - {{ opinion.review }} with rating: {{ opinion.rating }}</li>
      </ul>
    </div>
    <div class="watch-list">
      <h3>Watch List:</h3>
      <ul>
        <li v-for="movie in userSavedMovies" :key="movie.id">{{ movie.film_name }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Profile',
  computed: {
    ...mapState(['userEmail', 'userName', 'userWatchedMovies', 'userSavedMovies'])
  }
};
</script>

<style scoped>
</style>
