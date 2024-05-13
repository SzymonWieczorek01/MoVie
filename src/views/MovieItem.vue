<template>
  <button @click="$router.go(-1)" style="font-size: 24px;">
    &#8592;
  </button>
  <div class="movie-container">
    <MovieDescription :movieData="movieData" v-if="movieData" />
  </div>
  
</template>


<script>
import { mapState, mapActions } from 'vuex';
import AddOpinion from "../components/movie/AddOpinion.vue";
import MovieDescription from "../components/movie/MovieDescription.vue"

export default {
  name: 'MovieItem',
  components: { AddOpinion, MovieDescription },
  data () {
    return {
        movieId: 0,
        movieData: null,
    }
  },
  watch: {
    '$route.query': {
      handler(newMovieId) {
        this.movieId = newMovieId.id;
        this.getMovieData();
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    getMovieData () {
      this.$store.commit('setLoading', true);
      fetch(`https://api.themoviedb.org/3/movie/${this.movieId}?&api_key=67cdbbd1a17bf16dff493523ff9c18d4`)
      .then(response => response.json() )
      .then(data => {
         this.movieData = data;
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      }).finally(() => {
          this.$store.commit('setLoading', false);
      })
    },
  }
};
</script>
