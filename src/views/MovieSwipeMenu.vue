<template>
  <div class="movie-swipe-menu">
    <MovieCard
      v-if="currentMovie"
      :movie="currentMovie"
      @swipe="handleSwipe"
    />
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import MovieCard from '../components/movie/MovieCard.vue';

export default {
  components: {
    MovieCard
  },
  computed: {
    ...mapState(['userSavedMoviesID', 'userWatchedMoviesID', 'userDislikedMoviesID', 'isLogged',]),
    currentMovie() {
      return this.movies[this.currentIndex];
    },
    nearEndOfList() {
      return this.currentIndex == this.movies.length;
    },
    parsedUserSavedMovies() {
      return JSON.parse(JSON.stringify(this.userSavedMoviesID))
    },
    parsedUserWatchedMovies() {
      return JSON.parse(JSON.stringify(this.userWatchedMoviesID))
    },
    parsedUserDislikedMovies() {
      return JSON.parse(JSON.stringify(this.userDislikedMoviesID))
    },
    banedMoviesID(){
      return this.parsedUserSavedMovies.concat(this.parsedUserDislikedMovies, this.userWatchedMoviesID)
    }
  },
  data() {
    return {
      currentIndex: 0,
      movies: [],
      swipeTotalPages: 0,
      currentSwipePage: 1
    };
  },
  methods: {
    incrementSwipePage() {
      if (!this.swipeTotalPages || this.currentSwipePage <= this.swipeTotalPages) {
        this.currentSwipePage++;
        this.currentIndex = 0;
        this.fetchMovies();
      }
    },
    fetchMovies() {
      this.$store.commit('setLoading', true);
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=67cdbbd1a17bf16dff493523ff9c18d4&page=${this.currentSwipePage}`)
        .then(response => response.json())
        .then(data => {
          var movies = data.results.filter(movie => !(this.banedMoviesID.includes(movie.id)))
          if (movies.length == 0){
            this.incrementSwipePage();
          }
          this.movies = movies
          this.swipeTotalPages = data.total_pages
        })
        .catch(error => {
          console.error('Error fetching movies:', error);
        })
        .finally(() => {
          this.$store.commit('setLoading', false);
        })
    },
    handleSwipe() {
        if (this.currentIndex <= this.movies.length){
            this.currentIndex++
        }
        else {
            this.incrementSwipePage();
            console.log('End of movie list or invalid swipe');
        }
    },
  },
  watch: {
    currentIndex() {
      if (this.nearEndOfList == true) {
        this.incrementSwipePage();
      }
    },
    isLogged(newLogged, oldLogged) {
        if (newLogged == false){
          this.$router.push({ name: 'Home'})
        }
    }
  },
  created() {
    if (this.isLogged == false){
      this.$router.push({ name: 'Home'})
    }
    this.fetchMovies();
  }
}
</script>


<style scoped>
.movie-swipe-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
</style>
