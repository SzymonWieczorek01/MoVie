<template>
  <div>
    <input type="text" v-model="query" @input="updateQuery" placeholder="Search...">
    <select v-model="with_genres" @change="updateQuery">
      <option v-for="genre in genres" :value="genre.id">
        {{ genre.name }}
      </option>
    </select>
    <input type="number" v-model.number="year" @input="updateQuery" placeholder="Year">
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      query: '',
      with_genres: 0,
      year: null
    };
  },
  methods: {
    ...mapActions(['fetchGenres']),
    ...mapActions(['performSearch']),
    updateQuery() {
      this.$store.commit('setSearchQuery', this.query);
      this.$store.commit('setWithGenres', this.with_genres);
      this.$store.commit('setYear', this.year);
      console.log(this.searchResults[0])
      this.$router.push({ name: 'Search Results', query: { q: this.query, with_genres: this.with_genres, year: this.year}});
      this.performSearch();
    },
  },
  computed: {
    ...mapState(['searchQuery', 'genres', "searchResults"])
  },
  created () {
    this.fetchGenres();
  }
}
</script>
