<template>
  <div>
    <h1 v-if="query">Search Results for {{ query }}</h1>
    <h1 v-if="with_genres && !query">Search Results with Genre {{ genreNames([with_genres]) }}</h1>
    <table>
      <thead>
        <tr>
          <th>Poster</th>
          <th>Title</th>
          <th>Release Date</th>
          <th>Overview</th>
          <th>Genres</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in searchResults" :key="result.id">
          <td><img :src="'https://image.tmdb.org/t/p/w500' + result.poster_path" alt="Movie Poster" style="width: 100px;"></td>
          <td @click="redirectToMovie(result.id)">{{ result.title }}</td>
          <td>{{ result.release_date }}</td>
          <td>{{ result.overview }}</td>
          <td>{{ genreNames(result.genre_ids) }}</td>
        </tr>
      </tbody>
    </table>
    <button @click="decrementSearchPage" v-if="currentSearchPage > 1">Previous</button>
    <button @click="incrementSearchPage" v-if="currentSearchPage < searchTotalPages">Next</button>
    <div>Page {{ currentSearchPage }} of {{ searchTotalPages }}</div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  watch: {
    '$route.query': {
      handler(newQuery) {
        this.$store.commit('setSearchPage', newQuery.page || 1);
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
    ...mapState(['searchResults', 'genres', 'query', 'with_genres', 'year', 'searchTotalPages', 'currentSearchPage'])
  },
  methods: {
    ...mapActions(['performSearch']),
    incrementSearchPage() {
      const page = this.currentSearchPage + 1;
      this.$router.push({ name: 'Search Results', query: { q: this.query, with_genres: this.with_genres, year: this.year, page: page}});
    },
    decrementSearchPage() {
      const page = this.currentSearchPage - 1;
      this.$router.push({ name: 'Search Results', query: { q: this.query, with_genres: this.with_genres, year: this.year, page: page}});
    },
    genreNames(genreIds) {
      return genreIds.map(id => {
          const genre = this.genres.find(g => g.id === id);
          return genre ? genre.name : 'Unknown';
        }).join(', ');
    },
    redirectToMovie(id) {
      this.$router.push({ name: 'Movie Item', query: { id: id}});
    },
  },
  created() {
    let page = this.$route.query.page || 1;
    this.$store.commit('setSearchPage', parseInt(page));
    this.performSearch(); 
  }
}
</script>
