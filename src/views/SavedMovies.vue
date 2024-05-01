<template>
  <h1>Your Watch List</h1>
  <div class="movie-list">
    <div v-for="movie in movies" :key="movie.film_id" class="movie-item">
      <div class="movie-details">
        <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" alt="Movie Poster" class="movie-image" />
        <h3 @click="redirectToMovie(movie.film_id)" class="movie-title">{{ movie.film_name }}</h3>
      </div>
      <div class="movie-actions">
        <add-opinion v-if="showModal" :show-modal="showModal" :movie-title="currentMovieTitle" @close="showModal = false" @submit="handleOpinionSubmit"></add-opinion>
        <button @click="addOpinion(movie.film_name, movie.film_id)" class="watched-button">Watched</button>
        <button @click="removeFromList(movie.id)" class="delete-button">Remove</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { collection, getDocs, getFirestore, doc, deleteDoc } from "firebase/firestore"; 
import AddOpinion from "../components/movie/AddOpinion.vue";
import db from '../firebase/firebase'

export default {
  components: {
    AddOpinion
  },
  data() {
    return {
      currentMovieId: 1,
      currentMovieTitle: '',
      movies: [],
      showModal: false,
      fireStore: null
    };
  },
 computed: {
    ...mapState(['userEmail'])
 },
 methods: {
    getUserSavedMovies() {
      getDocs(collection(this.fireStore, "saved_movies"))
      .then(querySnapshot => {
        querySnapshot.forEach((doc) => {
          console.log({...doc.data(), id:doc.id})
          this.movies.push({...doc.data(), id:doc.id})
      })
      })
    },
    redirectToMovie(id) {
      this.$router.push({ name: 'Movie Item', query: { id: id }});
    },
    removeFromList(movieId) {
      deleteDoc(doc(this.fireStore, "saved_movies", movieId))
      .then(() => {
        console.log(`Removed ${movieId} from watch list`)
        this.movies = []
        this.getUserSavedMovies()
      })
    },
    addOpinion(movieTitle, movieId) {
      this.currentMovieId = movieId
      this.currentMovieTitle = movieTitle
      this.showModal = true;
    },
    handleOpinionSubmit() {
      // Logic to handle the opinion submission
      console.log(`Opinion submitted for ${movieTitle}`);
      this.showModal = false;
    },
  },
  computed: {
    filteredMovies() {
      return this.movies.filter((movie) => movie.user_email == this.userEmail);
    },
  },
  created() {
    this.fireStore = getFirestore(db);
    this.getUserSavedMovies();
  },
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