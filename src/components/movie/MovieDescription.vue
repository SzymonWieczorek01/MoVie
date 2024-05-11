<template>
    <div class="movie-image">
      <img :src="'https://image.tmdb.org/t/p/w500' + movieData.poster_path" alt="Movie Poster" />
    </div>
    <div class="movie-details">
      <h2>{{ movieData.title }}</h2>
      <h3 v-if="movieData.original_title">Original Title: {{ movieData.original_title }}</h3>
      <p class="tagline" v-if="movieData.tagline">"{{ movieData.tagline }}"</p>
      <p v-if="movieData.overview">{{ movieData.overview }}</p>
      <div class="additional-details">
        <p><strong>Status:</strong> {{ movieData.status }}</p>
        <p><strong>Genres:</strong> {{ parsedGenres }}</p>
        <p><strong>Origin Countries:</strong> {{ parsedCountries }}</p>
        <p v-if="movieOpinions.length > 0">Movie Opinions:</p>
          <ul v-if="movieOpinions.length > 0">
            <li v-for="opinion in movieOpinions" :key="opinion.id">
                <strong>{{ opinion.user_email }}</strong> thinks <em>{{ opinion.title }}</em> is <em>{{ opinion.review }}</em> and rates this film as <span>{{ opinion.rating }}</span>.
            </li>
          </ul>
      </div>
      <button v-if="isLogged && isInSaved" class="watch-list-button" @click="addToWatchList">Add to Watch List</button>
      <AddOpinion v-if="movieData.id" v-model:showModal="showModal" :movieTitle="movieData.title" :movieId="movieData.id" :moviePosterPath="movieData.poster_path" @submit="handleOpinionSubmit" @close="showModal = false"/>
      <button v-if="isLogged && isInWacthed" class="opinion-button" @click="showModal = true">Add Opinion</button>
    </div>
</template>

<script>
import AddOpinion from "./AddOpinion.vue";
import { mapState, mapActions } from 'vuex';
import { collection, getDocs, getFirestore, addDoc } from "firebase/firestore"; 

export default {
  name: 'MovieDescription',
  components: { AddOpinion },
  props: {
    movieData: null
  },
  data () {
    return {
        showModal: false,
        movieOpinions: []
    }
  },
  computed: {
    ...mapState(['fireStore', 'isLogged', 'userEmail', 'userSavedMoviesID', 'userWatchedMoviesID']),
    isInSaved() {
      return !(this.userSavedMoviesID.includes(parseInt(this.movieData.id)))
    },
    isInWacthed() {
      return !(this.userWatchedMoviesID.includes(parseInt(this.movieData.id)))
    },
    parsedGenres() {
        return this.movieData.genres.map(item => item["name"]).join(", ")
    },
    parsedCountries() {
        return this.movieData.origin_country.join(", ")
    }
  },
  methods: {
    addToWatchList(){
      var movieData = {
          id: parseInt(this.movieData.id),
          title: this.movieData.title,
          poster_path: this.movieData.poster_path,
          user_email: this.userEmail
      }
      addDoc(collection(this.fireStore, "saved_movies"), movieData)
      .then(doc => {
        movieData["dbId"] = doc.id
        this.$store.commit("setUserSavedMovies", movieData);
      });
    },
    handleOpinionSubmit(movieData) {
      this.showModal = false;
      this.movieOpinions.push(movieData);
    },
    getOpinions(){
        getDocs(collection(this.fireStore, "watched_movies"))
        .then(querySnapshot => {
            querySnapshot.forEach((doc) => {
                if (parseInt(doc.data().id) == parseInt(this.movieData.id)){
                    this.movieOpinions.push(doc.data())
                }
            })
        });
    }
  },
  created() {
    this.getOpinions();
  }
}
</script>

<style scoped>
.movie-image img {
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.movie-details {
  text-align: center;
  padding: 20px;
}

.movie-details h2 {
  color: #333;
  margin-bottom: 0;
}

.movie-details h3 {
  color: #666;
  font-size: 1.2em;
  margin-top: 5px;
}

.tagline {
  font-style: italic;
  color: #888;
  margin-top: 0;
}

.additional-details p {
  color: #444;
}

.youtube-player {
  margin-top: 20px;
  width: 100%;
  max-width: 720px;
}

.watch-list-button, .opinion-button {
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.watch-list-button {
  background-color: #4CAF50; /* Green */
  color: white;
}

.opinion-button {
  background-color: #008CBA; /* Blue */
  color: white;
}
</style>