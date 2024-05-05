<template>
  <h1>Your Watch List</h1>
  <div class="movie-list">
    <div v-for="movie in userSavedMovies" :key="movie.film_id" class="movie-item">
      <div class="movie-details">
        <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" alt="Movie Poster" class="movie-image" />
        <h3 @click="redirectToMovie(movie.film_id)" class="movie-title">{{ movie.film_name }}</h3>
      </div>
      <div class="movie-actions">
        <add-opinion v-if="showModal" v-model:showModal="showModal" :movieTitle="currentMovieTitle" :movieId="currentMovieId" :moviePosterPath="currentMoviePoster" @submit="handleOpinionSubmit()" @close="this.showModal = false"></add-opinion>
        <button @click="addOpinion(movie.film_name, movie.film_id, movie.poster_path, movie.id)" class="watched-button">Watched</button>
        <button @click="removeFromList(movie.id)" class="delete-button">Remove</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { doc, deleteDoc } from "firebase/firestore"; 
import AddOpinion from "../components/movie/AddOpinion.vue";
import { mapActions } from 'vuex';


export default {
  components: {
    AddOpinion
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
    ...mapActions(['getUserSavedMovies', 'setLoading']),
    redirectToMovie(id) {
      this.$router.push({ name: 'Movie Item', query: { id: id }});
    },
    removeFromList(movieId) {
      this.$store.commit('setLoading', true)
      deleteDoc(doc(this.fireStore, "saved_movies", movieId))
      .then(() => {
        console.log(`Removed ${movieId} from watch list`)
        this.getUserSavedMovies()
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
      this.removeFromList(this.currentFirebaseId);
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
.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.movie-item {
  border: 1px solid #ddd;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.movie-image {
  max-width: 100%;
  height: auto;
}

.movie-title {
  font-size: 16px;
  margin-top: 10px;
}

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