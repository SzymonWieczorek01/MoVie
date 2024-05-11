<template>
  <div>
    <SearchMovie ref="SearchMovie" :showButton="false" @newQuery="$refs.SearchMovie.updateQuery()"/>
    <div>
      <h1 v-if="query">Search Results for {{ query }}</h1>
      <h1 v-if="with_genres && !query">Search Results with Genre {{ genreNames([with_genres]) }}</h1>
      <button @click="toggleView" style="font-size: 15px;">{{ asTable ? 'Switch to Cards View' : 'Switch to Table View' }}</button>
      <div v-if="!asTable">
        <DisplayMoviesAsCards :movies="searchResults"/>
      </div>
      <div v-if="asTable">
        <DisplayMoviesAsTable :results="searchResults"/>
      </div>
      <div>
        <button @click="decrementSearchPage" v-if="currentSearchPage > 1">Previous</button>
        <button @click="incrementSearchPage" v-if="currentSearchPage < searchTotalPages">Next</button>
        <div>Page {{ currentSearchPage }} of {{ searchTotalPages }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { onBeforeUnmount } from 'vue';
import SearchMovie from '../components/movie/SearchMovie.vue';
import DisplayMoviesAsTable from '../components/movie/DisplayMoviesAsTable.vue';
import DisplayMoviesAsCards from '../components/movie/DisplayMoviesAsCards.vue';

export default {
  components: {
    SearchMovie, DisplayMoviesAsTable, DisplayMoviesAsCards
  },
  data() {
    return {
      asTable: false
    };
  },
  watch: {
    '$route.query': {
      handler(newQuery) {
        const newQ = newQuery.q || '';
        const newGenres = newQuery.with_genres ? parseInt(newQuery.with_genres) : 0;
        const newYear = newQuery.year;

        this.query = newQ;
        this.with_genres = newGenres;
        this.year = newYear;

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
    toggleView() {
      this.asTable = !this.asTable;
    }
  },
  created() {
    this.$store.commit("setShowSearch", false);
    const page = this.$route.query.page || 1;
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
