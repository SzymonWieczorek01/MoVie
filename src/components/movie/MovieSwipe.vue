<template>
  <div class="swipe-container">
    <movie-card
      v-if="currentMovie"
      :movie="currentMovie"
      @swipe="handleSwipe"
    />
    <add-opinion v-if="currentMovie" v-model:showModal="showModal" :movieTitle="currentMovie.title" @submit="submitOpinion" @close="closeOpinion"></add-opinion>
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
    ...mapState(['movies', 'userEmail']),
    currentMovie() {
      return this.movies[this.currentIndex];
    },
    nearEndOfList() {
      return this.currentIndex == this.movies.length-1;
    }
  },
  data() {
    return {
      currentIndex: 0,
      showModal: false,
    };
  },
  methods: {
    ...mapActions(['fetchMovies']),
    closeOpinion() {
      this.showModal = false;
    },
    submitOpinion () {
      this.showModal = false;
      this.currentIndex++
    },
    pushSavedMovieToDb(movieData){
        const fireStore = getFirestore(db);
        addDoc(collection(fireStore, "saved_movies"), {
          film_id: movieData.id,
          film_name: movieData.title,
          poster_path: movieData.backdrop_path,
          user_email: this.userEmail
      });
    },
    handleSwipe(direction) {
        console.log(this.movies[this.currentIndex])
        if (this.currentIndex < this.movies.length - 1){
            if (direction == "like"){
                this.pushSavedMovieToDb(this.movies[this.currentIndex])
                console.log(`${this.movies[this.currentIndex].title} - liked`)
                this.currentIndex++
            }
            if (direction == "dislike"){
                console.log(`${this.movies[this.currentIndex].title} - disliked`)
                this.currentIndex++
            }
            if (direction == "watched"){
                this.showModal = true;
            }
        }
        else {
            console.log('End of movie list or invalid swipe');
        }
    },
  },
  watch: {
    currentIndex(newVal) {
      if (this.nearEndOfList) {
        this.fetchMovies();
      }
    }
  },
  created() {
    this.fetchMovies();
  }
}
</script>
