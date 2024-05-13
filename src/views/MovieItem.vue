<template>
  <a @click="$router.go(-1)" class="previous round">&#8249;</a>
  <div class="movie-container">
    <MovieDescription :movieData="movieData" v-if="movieData" />
  </div>
  
</template>

<style scoped>
a {
  background: linear-gradient(90deg, #887AE3 0.3%, #30345A 100.05%, #30345A 100.06%);
  text-decoration: none;
  display: inline-block;
  padding: 8px 25px;
  margin-left: 80px;
  font-size: 40px;
  text-align: center;
  background-color: #f1f1f1;
  color: white;
  transition: transform 0.3s ease-out;
  border-radius: 10px;
  border: transparent;
}

a:hover {
  transform: scale(1.2);
  cursor: default;
}

.round {
  border-radius: 50%;
}
</style>

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
