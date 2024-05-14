<template>
  <div class="search-bar">
    <input type="text" v-model="query" @input="$emit('newQuery')" placeholder="Search..." class="search-input">
    <select v-model="with_genres" @change="$emit('newQuery')" class="genre-select">
      <option disabled value="0">Select genre</option>
      <option v-for="genre in genres" :value="genre.id">
        {{ genre.name }}
      </option>
    </select>
    <input type="number" v-model="year" placeholder="Year" @input="$emit('newQuery')" class="year-input">
    <button @click="updateQuery" v-if="showButton!=false" class="search-button">Search</button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      query: '',
      with_genres: 0,
      year: null,
    };
  },
  props: {
    showButton: {
      type: Boolean,
      default: true // Default value corrected
    },
  },
  methods: {
    ...mapActions(['fetchGenres']),
    ...mapActions(['performSearch']),
    updateQuery() {
      this.$store.commit('setSearchQuery', this.query);
      this.$store.commit('setWithGenres', this.with_genres);
      this.$store.commit('setYear', this.year);
      this.$router.push({ name: 'Search Results', query: { q: this.query, with_genres: this.with_genres, year: this.year, page: 1}});
      this.performSearch();
    },
  },
  computed: {
    ...mapState(['searchQuery', 'genres', "searchResults", 'currentSearchPage'])
  },
  created () {
    this.fetchGenres();
  }
}
</script>

<style>
.search-bar {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 8px;
  border-radius: 20px;
}

.search-input, .genre-select, .year-input, .search-button {
  padding: 6px 10px;
  margin-right: 8px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 15px;
}

.search-input {
  flex-grow: 1;
}

.genre-select, .year-input {
  width: auto;
}

.search-button {
  background: linear-gradient(90deg, #1B1A1A -1.58%, #887AE3 102.63%);
  box-shadow: 1px 4px 5px -1px rgba(0, 0, 0, 0.25);
  color: white;
  border-color: #007bff;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-weight: 500;
  border-radius: 13px;
  border-color: transparent;
}

.search-button:hover {
  transform: scale(1.05);
  transition: transform 0.3s;
}

/* Media Query for Responsive Layout */
@media screen and (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input, .genre-select, .year-input, .search-button {
    margin: 8px 0;
    width: 100%;
  }

  .search-button {
    margin-top: 8px;
  }
}
</style>
