<template>
  <div class="swipe-container">
    <movie-card
      v-if="currentMovie"
      :movie="currentMovie"
      @swipe="handleSwipe"
    />
    <add-opinion v-if="currentMovie" v-model:showModal="showModal" :movieTitle="currentMovie.title" :movieId="currentMovie.id" :moviePosterPath="currentMovie.backdrop_path" @submit="submitOpinion" @close="closeOpinion"></add-opinion>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AddOpinion from "./AddOpinion.vue";
import MovieCard from './MovieCard.vue';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import db from "../../firebase/firebase";

export default {
  components: {
    MovieCard,
    AddOpinion
  },
  computed: {
    ...mapState(['userEmail', 'userSavedMoviesID', 'userWatchedMoviesID', 'userDislikedMoviesID', 'isLogged', 'fireStore']),
    currentMovie() {
      return this.movies[this.currentIndex];
    },
    nearEndOfList() {
      return this.currentIndex >= this.movies.length-1;
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
      showModal: false,
      movies: [],
      swipeTotalPages: 0,
      currentSwipePage: 1
    };
  },
  methods: {
    ...mapActions(['getUserSavedMovies', 'getUserDislikedMovies']),
    incrementSwipePage() {
      if (!this.swipeTotalPages || this.currentSwipePage < this.swipeTotalPages) {
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
    closeOpinion() {
      this.showModal = false;
    },
    submitOpinion () {
      this.showModal = false;
      this.currentIndex++
    },
    pushDislikedMovieToDB(movieData){
      addDoc(collection(this.fireStore, "disliked_movies"), {
          film_id: parseInt(movieData.id),
          film_name: movieData.title,
          poster_path: movieData.poster_path,
          user_email: this.userEmail
      });
    },
    pushSavedMovieToDb(movieData){
        addDoc(collection(this.fireStore, "saved_movies"), {
          film_id: parseInt(movieData.id),
          film_name: movieData.title,
          poster_path: movieData.poster_path,
          user_email: this.userEmail
      });
    },
    handleSwipe(direction) {
        console.log(this.movies[this.currentIndex])
        if (this.currentIndex <= this.movies.length){
            if (direction == "like"){
                this.pushSavedMovieToDb(this.movies[this.currentIndex])
                this.getUserSavedMovies();
                this.currentIndex++
            }
            if (direction == "dislike"){
                this.pushDislikedMovieToDB(this.movies[this.currentIndex])
                this.getUserDislikedMovies();
                this.currentIndex++
            }
            if (direction == "watched"){
                this.showModal = true;
            }
        }
        else {
            console.log(this.nearEndOfList, this.movies.length, this.currentSwipePage)
            console.log('End of movie list or invalid swipe');
        }
    },
  },
  watch: {
    currentIndex() {
      if (this.nearEndOfList) {
        this.incrementSwipePage();
        this.fetchMovies();
      }
    },
  },
  created() {
    this.fetchMovies();
  }
}
</script>
