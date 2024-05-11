<template>
  <div class="movie-card">
    <img v-bind:src="'https://image.tmdb.org/t/p/w500'+movie.poster_path" alt="Movie Poster" class="movie-poster" />
    <p>{{ movie.title }}</p>
    <p>{{ movie.overview }}</p>
    <button @click="redirectToMovie">Read Full Description</button>
    <button @click="pushSavedMovieToDb">Like</button>
    <button @click="pushDislikedMovieToDB">Dislike</button>
    <button @click="handleWatched">Watched</button>
    <add-opinion v-if="movie" :showModal="showModal" :movieTitle="movie.title" :movieId="movie.id" :moviePosterPath="movie.backdrop_path" @submit="submitOpinion" @close="closeOpinion"></add-opinion>
  </div>
</template>

<script>
import { addDoc, collection } from "firebase/firestore";
import AddOpinion from "./AddOpinion.vue";
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    AddOpinion
  },
  name: 'MovieCard',
  data() {
    return {
      showModal: false
    }
  },
  props: {
    movie: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['userEmail', 'fireStore']),
    parsedMovieData() {
      return {
        id: parseInt(this.movie.id),
        title: this.movie.title,
        poster_path: this.movie.poster_path,
        user_email: this.userEmail
      }
    }
  },
  methods: {
    handleWatched(){
      this.showModal = true;
    },
    redirectToMovie() {
      this.$router.push({ name: 'Movie Item', query: { id: this.movie.id}});
    },
    closeOpinion() {
      this.showModal = false;
    },
    submitOpinion () {
      this.showModal = false;
      this.$emit("swipe");
    },
    pushDislikedMovieToDB(){
      addDoc(collection(this.fireStore, "disliked_movies"), this.parsedMovieData)
      .then((doc) => {
        this.$store.commit("setUserDislikedMovies", this.movie.id);
        this.$emit("swipe");
      });
    },
    pushSavedMovieToDb(){
        addDoc(collection(this.fireStore, "saved_movies"), this.parsedMovieData)
        .then((doc) => {
          this.parsedMovieData['dbId'] = doc.id;
          this.$store.commit("setUserSavedMovies", this.parsedMovieData);
          this.$emit("swipe");
        });
    },
  },

};
</script>

<style scoped>
.movie-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 10px;
}
.movie-poster {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
}
</style>
