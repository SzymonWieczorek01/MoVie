<template>
  <nav>
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/random-movies">Random Movie</router-link></li>
      <li><router-link to="/saved-movies">Saved Movies</router-link></li>
      <li><router-link to="/swipe-movies">Movie Swipe</router-link></li>
      <search-component class="nav-item" />
      <li><router-link to="/profile">Profile</router-link></li>
    </ul>
  </nav>
</template>

<script>
import SearchComponent from '../movie/SearchMovie.vue';

export default {
  components: {
    SearchComponent
  }
}
</script>

<style scoped>
nav ul {
  list-style-type: none;
  display: flex;
}
nav ul li {
  margin-right: 20px;
}
</style>
