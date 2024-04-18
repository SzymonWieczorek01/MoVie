<template>
  <div>
    <h1>Search Results for "{{ query }}" </h1>
    <ul>
      <li v-for="result in searchResults" :key="result.id">
        <h1>{{ result.title }}</h1><p>{{ result.release_date }}</p>
        <h4>{{ result.overview }}</h4>
        <h4>Genres: {{ genreNames(result.genre_ids) }}</h4>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  props: {
    query: String,
    with_genres: Number,
    year: Number
  },
  computed: {
    ...mapState(['searchResults']),
    ...mapState(['genres'])
  },
  methods: {
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
