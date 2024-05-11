<template>
  <input type="text" v-model="query" @input="updateQuery" placeholder="Search...">
    <select v-model="with_genres" @change="updateQuery">
      <option v-for="genre in genres" :value="genre.id">
        {{ genre.name }}
      </option>
    </select>
    <input type="number" v-model="year" @input="updateQuery" placeholder="Year">
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
import { onBeforeUnmount } from 'vue';

export default {
  data () {
    return {
      query: '',
      with_genres: 0,
      year: null
    }
  },
  watch: {
    '$route.query': {
      handler(newQuery) {
        var newQ = newQuery.q || ''
        var newGenres = newQuery.with_genres ? parseInt(newQuery.with_genres) : 0
        var newYear = newQuery.year

        this.query = newQ
        this.with_genres = newGenres
        this.year = newYear

        this.$store.commit('setSearchPage', newQuery.page || 1);
        this.$store.commit('setSearchQuery', newQ);
        this.$store.commit('setWithGenres', newGenres);
        this.$store.commit('setYear', newYear);

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
    updateQuery() {
      this.$store.commit('setSearchQuery', this.query);
      this.$store.commit('setWithGenres', this.with_genres);
      this.$store.commit('setYear', this.year);
      this.$router.push({ name: 'Search Results', query: { q: this.query, with_genres: this.with_genres, year: this.year, page: 1}});
      this.performSearch();
      this.$store.commit("setShowSearch", false);
    },
    handleBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = ''; 
    },
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
    this.$store.commit("setShowSearch", false)
    let page = this.$route.query.page || 1;
    this.$store.commit('setSearchPage', parseInt(page));
    this.performSearch(); 
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    this.$store.commit('setShowSearch', true);
  },
}
</script>
