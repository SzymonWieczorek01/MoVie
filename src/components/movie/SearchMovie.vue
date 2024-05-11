<template>
  <div>
    <input type="text" v-model="query" @input="$emit('newQuery')" placeholder="Search...">
    <select v-model="with_genres" @change="$emit('newQuery')">
      <option v-for="genre in genres" :value="genre.id">
        {{ genre.name }}
      </option>
    </select>
    <input type="number" v-model="year" placeholder="Year" @input="$emit('newQuery')">
    <button @click="updateQuery" v-if="showButton!=false">Search</button>
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
