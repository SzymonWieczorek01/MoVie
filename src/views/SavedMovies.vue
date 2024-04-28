<template>
  <h1>Your Watch List</h1>
  <div class="movie-list">
    <div v-for="movie in filteredMovies" :key="movie.id" class="movie-item">
      <div class="movie-details">
        <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" alt="Movie Poster" class="movie-image" />
        <h3 @click="redirectToMovie(movie.id)" class="movie-title">{{ movie.title }}</h3>
      </div>
      <div class="movie-actions">
        <add-opinion v-if="showModal" :show-modal="showModal" :movie-title="currentMovieTitle" @close="showModal = false" @submit="handleOpinionSubmit"></add-opinion>
        <button @click="addOpinion(movie.title, movie.id)" class="watched-button">Watched</button>
        <button @click="removeFromList(movie.title)" class="delete-button">Remove</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AddOpinion from "../components/movie/AddOpinion.vue";

export default {
  components: {
    AddOpinion
  },
  data() {
    return {
      currentMovieId: 1,
      currentMovieTitle: '',
      movies: [],
      currentUserID: 123,
      showModal: false
    };
  },
 methods: {
      fetchMovies() {
        this.$store.commit('setLoading', true);
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=67cdbbd1a17bf16dff493523ff9c18d4&page=5`)
        .then(response => response.json())
        .then(data => data.results)
        .then(results => {
          results.map((movie) =>{
                movie["userId"] = 123
            })
            console.log(results)
            this.movies = results
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
        })
        .finally(() => {
            this.$store.commit('setLoading', false);
        })
    },
    redirectToMovie(id) {
      this.$router.push({ name: 'Movie Item', query: { id: id}});
    },
    removeFromList(movieTitle, movieId) {
      // Logic to add the movie to the watch list
      console.log(`Removed ${movieTitle} from watch list`);
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
      return this.movies.filter((movie) => movie.userId === this.currentUserID);
    },
  },
  created() {
    this.fetchMovies();
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