<template>
  <h1>Your Watch List</h1>
      <DisplayMoviesAsCards :movies='userSavedMovies'>
        <template v-slot:buttons="{ movie }">
          <AddOpinion v-if="showModal" v-model:showModal="showModal" :movieTitle="currentMovieTitle" :movieId="currentMovieId" :moviePosterPath="currentMoviePoster" @submit="handleOpinionSubmit()" @close="this.showModal = false"/>
          <button @click="addOpinion(movie.title, movie.id, movie.poster_path, movie.dbId)" class="watched-button">Watched</button>
          <button @click="removeFromList(movie.id, movie.dbId)" class="delete-button">Remove</button>
        </template>
      </DisplayMoviesAsCards>
</template>

<script>
import { mapState } from 'vuex';
import { doc, deleteDoc } from "firebase/firestore"; 
import DisplayMoviesAsCards from "../components/movie/DisplayMoviesAsCards.vue";
import AddOpinion from "../components/movie/AddOpinion.vue";
import { mapActions } from 'vuex';


export default {
  components: {
    AddOpinion, DisplayMoviesAsCards
  },
  data() {
    return {
      currentMovieId: 1,
      currentMovieTitle: '',
      currentMoviePoster: '',
      currentFirebaseId: '',
      showModal: false,
    };
  },
 computed: {
    ...mapState(['userEmail', 'fireStore', 'userSavedMovies', 'isLogged'])
 },
 methods: {
    ...mapActions(['setLoading']),
    removeFromList(movieId, Id) {
      this.$store.commit('setLoading', true)
      deleteDoc(doc(this.fireStore, "saved_movies", String(Id)))
      .then(() => {
        this.$store.commit("removeIdFromSavedMovies", movieId)
        this.$store.commit('setLoading', false)
      })
    },
    addOpinion(movieTitle, movieId, posterPath, firebaseId) {
      this.currentMovieId = movieId;
      this.currentMovieTitle = movieTitle;
      this.currentMoviePoster = posterPath;
      this.currentFirebaseId = firebaseId;
      this.showModal = true;
    },
    handleOpinionSubmit() {
      this.removeFromList(this.currentMovieId, this.currentFirebaseId);
      this.showModal = false;
    },
  },
  watch: {
    isLogged(newLogged, oldLogged) {
        if (newLogged == false){
          this.$router.push({ name: 'Home'})
        }
    }
  },
  created() {
    if (this.isLogged == false) {
      this.$router.push({ name: 'Home'})
    }
  }
};
</script>

<style scoped>
.watched-button,
.delete-button {
  margin-top: 10px;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  font-size: 14px;
  border-radius: 5px;
}

.delete-button {
  background-color: #dc3545;
}
</style>