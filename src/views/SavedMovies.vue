<template>
  <h1>Your Watch List</h1>
  <div v-if="userSavedMovies.length === 0" class="watchlist">
    <i class="fas fa-film fa-3x"></i>
    <p>Your watch list is empty. Add movies to start your collection!</p>
    <button @click='$router.push({name: "Swipe Movies"})' class="cta-button">Discover Movies</button>
  </div>
  <div v-else class="watchlist"> 
    <DisplayMoviesAsCards :movies="userSavedMovies">
      <template v-slot:buttons="{ movie }">
        <div class="button-group">
          <AddOpinion v-if="showModal" v-model:showModal="showModal" :movieTitle="currentMovieTitle" :movieId="currentMovieId" :moviePosterPath="currentMoviePoster" @submit="handleOpinionSubmit()" @close="this.showModal = false"/>
          <button @click="removeFromList(movie.id, movie.dbId)" class="delete-button">Remove</button>
          <button @click="addOpinion(movie.title, movie.id, movie.poster_path, movie.dbId)" class="watched-button">&#x2714;</button>
        </div>
      </template>
    </DisplayMoviesAsCards>
  </div>
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
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  color: white;
  font-size: 14px;
  border-radius: 5px;
  transition: transform 0.2s ease-in-out;
}

.watched-button {
  background-color: green;
}

.delete-button {
  background-color: #dc3545;
}

.watched-button:hover,
.delete-button:hover {
  transform: scale(1.05);
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin: 0 5%; /* Margins from the left and right */
}

.watchlist {
  text-align: center;
  color: #666;
  font-size: 16px;
  margin: 50px 10%; /* Percentage margins for left and right */
}

.fa-film {
  font-size: 6rem; /* Increase icon size */
  margin-bottom: 20px;
  color: #ccc; /* Light grey color for the icon */
}

.cta-button {
  padding: 10px 20px;
  font-size: 1.1em;
  background: linear-gradient(90deg, #1B1A1A -1.58%, #887AE3 102.63%);
  box-shadow: 1px 4px 5px -1px rgba(0, 0, 0, 0.25);
  color: white;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.cta-button:hover {
  background-color: #9A6EBB; /* Lighter violet on hover */
  transform: scale(1.05);
}

h1 {
  font-size: 2.5rem; /* Larger font size for the heading */
  font-weight: 700; /* Bold font weight */
  color: #333; /* Darker color for better readability */
  margin-bottom: 20px; /* Space between the heading and the content below */
  margin-left: 10%; /* Left margin as percentage */
  margin-right: 10%; /* Right margin as percentage */
}
</style>
