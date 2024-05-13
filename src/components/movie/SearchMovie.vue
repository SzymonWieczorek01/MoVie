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
    showButton: true
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
  background-color: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-input, .genre-select, .year-input, .search-button {
  padding: 6px 10px;
  margin-right: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
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
  font-size: 1.1em;
  border-radius: 10px;
}

.search-button:hover {
  background-color: #9A6EBB; /* Lighter violet on hover */
  transform: scale(1.05);
  transition: background-color 0.3s, transform 0.3s;
}
</style>