<template>
<SearchMovie ref="SearchMovie" :showButton="false" @newQuery="$refs.SearchMovie.updateQuery()"/>
  <div class="search-and-toggle">
    <button @click="toggleView" class="toggle-view-button">
      <span v-if="asTable">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
      </span>
      <span v-else>
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="4"/><rect x="3" y="10" width="18" height="4"/><rect x="3" y="17" width="18" height="4"/></svg>
      </span>
    </button>
  </div>
  <div>
    <h1 v-if="query">Search Results for {{ query }}</h1>
    <h1 v-if="with_genres && !query">Search Results with Genre {{ genreNames([with_genres]) }}</h1>
    <div v-if="!asTable">
      <DisplayMoviesAsCards :movies="searchResults"/>
    </div>
    <div v-if="asTable">
      <DisplayMoviesAsTable :results="searchResults"/>
    </div>
    <div class="pagination">
      <button @click="decrementSearchPage" v-if="currentSearchPage > 1" class="previous-button">🡸 Previous</button>
      <div class="number-of-pages">page {{ currentSearchPage }} of {{ searchTotalPages }}</div>
      <button @click="incrementSearchPage" v-if="currentSearchPage < searchTotalPages" class="next-button">Next 🡺</button>
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
      asTable: true
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

<style scoped>
.number-of-pages{
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  color:rgba(0, 0, 0, 0.541);
  font-weight: 470;
  padding-left: 20px;
  padding-right: 20px;
}
.search-and-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: #FFF; /* Clean background */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

.SearchMovie {
  flex-grow: 1; /* Allows the SearchMovie component to grow and fill available space */
  margin-right: 10px; /* Provides spacing between the search bar and the toggle button */
}

.toggle-view-button {
  background-color: #6a1b9a; /* Custom purple for an attractive call to action */
  border: none;
  color: white;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
}

.toggle-view-button:hover {
  background-color: #4a148c; /* Darker purple on hover for interaction feedback */
}

.icon {
  width: 18px;
  height: 18px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination .next-button {
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-weight: 500;
  background: linear-gradient(90deg, #887AE3  -1.58%, #1B1A1A 102.63%);
  /* signup */
  box-shadow: 1px 4px 5px -1px rgba(0, 0, 0, 0.25);
  border-radius: 13px;
  border: transparent;
  color: white;
  padding: 6px 15px;
  margin: 5px;
  cursor: pointer;
}

.pagination .previous-button {
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-weight: 500;
  background: linear-gradient(90deg, #1B1A1A -1.58%, #887AE3 102.63%);
  /* signup */
  box-shadow: 1px 4px 5px -1px rgba(0, 0, 0, 0.25);
  border-radius: 13px;
  border: transparent;
  color: white;
  padding: 6px 15px;
  margin: 5px;
  cursor: pointer;
}

.pagination .next-button:hover {
  transform: scale(1.01,1.01);
}

@media (max-width: 768px) {
  .search-and-toggle {
    flex-direction: column;
    align-items: stretch;
  }
  .SearchMovie, .toggle-view-button {
    width: 100%; /* Ensures full width on smaller screens */
    margin-right: 0; /* Adjust margin for mobile layout */
  }
  .toggle-view-button {
    margin-top: 10px; /* Provides some space between the search bar and button */
  }
}
</style>
