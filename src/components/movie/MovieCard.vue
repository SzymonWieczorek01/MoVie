<template>
  <div class="movie-card">
    <div class="poster-wrapper">
      <img v-bind:src="'https://image.tmdb.org/t/p/w500'+movie.poster_path" alt="Movie Poster" class="movie-poster" />
    </div>
    <div class="content-wrapper">
      <h3 class="movie-title">{{ movie.title }}</h3>
      <p class="movie-overview">{{ movie.overview }}</p>
      <div class="buttons-container">
        <button @click="redirectToMovie" class="btn btn-primary" title="Read More">&#x1F441;</button>
        <button @click="pushSavedMovieToDb" class="btn btn-like" title="Like">&#x2764;</button>
        <button @click="pushDislikedMovieToDB" class="btn btn-dislike" title="Dislike">&#x1F44E;</button>
        <button @click="handleWatched" class="btn btn-watched" title="Watched">&#x2714;</button>
      </div>
    </div>
  </div>
  <AddOpinion 
      v-if="showModal" 
      :showModal="showModal"
      :movieTitle="movie.title" 
      :movieId="movie.id" 
      :moviePosterPath="movie.poster_path" 
      @submit="submitOpinion" 
      @close="closeOpinion"/>
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
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  max-width: 280px;
  margin: auto;
}

.poster-wrapper {
  width: 100%;
}

.movie-poster {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.content-wrapper {
  padding: 10px;
}

.movie-title {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 5px;
}

.movie-overview {
  font-size: 0.9rem;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.buttons-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding-top: 10px;
}

.btn {
  padding: 8px 15px;
  border-radius: 8px;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.5rem; /* Larger font size for icons */
  transition: background-color 0.3s ease;
  flex-grow: 1;
  margin: 0 5px;
}

.btn-primary {
  background-color: #007BFF;
}

.btn-like {
  background-color: #28A745;
}

.btn-dislike {
  background-color: #DC3545;
}

.btn-watched {
  background-color: #FFC107;
}

.btn:hover {
  opacity: 0.8;
}

.movie-card:hover {
  transform: scale(1.03);
}
</style>
