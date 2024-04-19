<template>
  <div>
    <h1>Search Results for "{{ query }}"</h1>
    <ul>
      <li v-for="result in searchResults" :key="result.id">
        <img :src="'https://image.tmdb.org/t/p/w500' + result.poster_path" alt="Movie Poster">
        <h1>{{ result.title }}</h1>
        <p>{{ result.release_date }}</p>
        <h4>{{ result.overview }}</h4>
        <h4>Genres: {{ genreNames(result.genre_ids) }}</h4>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  watch: {
    '$route.query': {
      handler(newQuery) {
        this.$store.commit('setSearchQuery', newQuery.q || '');
        this.$store.commit('setWithGenres', newQuery.with_genres ? parseInt(newQuery.with_genres) : 0);
        this.$store.commit('setYear', newQuery.year ? parseInt(newQuery.year) : 0);
        this.performSearch();
      },
      immediate: true,
      deep: true
    },
  },
  computed: {
    ...mapState(['searchResults', 'genres', 'query', 'with_genres', 'year'])
  },
  methods: {
    ...mapActions(['performSearch']),
    genreNames(genreIds) {
      return genreIds
        .map(id => {
          const genre = this.genres.find(g => g.id === id);
          return genre ? genre.name : 'Unknown';
        })
        .join(', ');
    }
  }
}
</script>
