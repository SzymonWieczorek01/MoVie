<template>
  <div class="movie-container">
    <div class="movie-image">
      <img :src="'https://image.tmdb.org/t/p/w500' + moviePoster" alt="Movie Poster" />
    </div>
    <div class="movie-details">
      <h2>{{ movieTitle }}</h2>
      <h3 v-if="movieOriginalTitle">Original Title: {{ movieOriginalTitle }}</h3>
      <p class="tagline" v-if="tagline">"{{ tagline }}"</p>
      <p v-if="movieSummary">{{ movieSummary }}</p>
      <div class="additional-details">
        <p><strong>Status:</strong> {{ status }}</p>
        <p><strong>Genres:</strong> {{ genres }}</p>
        <p><strong>Origin Countries:</strong> {{ originCountries }}</p>
        <p v-if="movieOpinions.length > 0">Movie Opinions:</p>
          <ul v-if="movieOpinions.length > 0">
            <li v-for="opinion in movieOpinions" :key="opinion.id">
                <strong>{{ opinion.user_email }}</strong> thinks <em>{{ opinion.film_name }}</em> is <em>{{ opinion.review }}</em> and rates this film as <span>{{ opinion.rating }}</span>.
            </li>
          </ul>
      </div>
      <button v-if="isLogged && isInSaved" class="watch-list-button" @click="addToWatchList">Add to Watch List</button>
      <add-opinion v-if="movieId" v-model:showModal="showModal" :movieTitle="movieTitle" :movieId="movieId" :moviePosterPath="moviePoster" @submit="showModal = false" @close="showModal = false"></add-opinion>
      <button v-if="isLogged && isInWacthed" class="opinion-button" @click="showModal = true">Add Opinion</button>
    </div>
    <YouTube 
      :src="youtubeLink"
      @ready="onReady"
      ref="youtube"
      class="youtube-player"/>
  </div>
  
</template>


<script>
import { mapState, mapActions } from 'vuex';
import { collection, getDocs, getFirestore, addDoc } from "firebase/firestore"; 
import YouTube from 'vue3-youtube';
import AddOpinion from "../components/movie/AddOpinion.vue";

export default {
  name: 'MovieItem',
  components: { YouTube, AddOpinion },
  data () {
    return {
        movieId: 0,
        showModal: false,
        movieOriginalTitle: '',
        movieTitle: '',
        movieSummary: '',
        moviePoster: '',
        movieOpinions: [],
        genres: '',
        youtubeLink: '',
        originCountries: '',
        status: '',
        tagline: ''
    }
  },
  computed: {
    ...mapState(['fireStore', 'isLogged', 'userEmail', 'userSavedMoviesID', 'userWatchedMoviesID']),
    isInSaved() {
      return !(this.userSavedMoviesID.includes(parseInt(this.movieId)))
    },
    isInWacthed() {
      return !(this.userWatchedMoviesID.includes(parseInt(this.movieId)))
    }
  },
  watch: {
    '$route.query': {
      handler(newMovieId) {
        this.movieId = newMovieId.id;
        this.getMovieData();
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    onReady() {
        this.getYoutubeKey();
    },
    addToWatchList(){
      var movieData = {
          film_id: parseInt(this.movieId),
          film_name: this.movieTitle,
          poster_path: this.moviePoster,
          user_email: this.userEmail
      }
      addDoc(collection(this.fireStore, "saved_movies"), movieData)
      .then(doc => {
        movieData["id"] = doc.id
        this.$store.commit("setUserSavedMovies", movieData)
      });
    },
    handleOpinionSubmit() {
      this.showModal = false;
    },
    getMovieData () {
      this.$store.commit('setLoading', true);
      fetch(`https://api.themoviedb.org/3/movie/${this.movieId}?&api_key=67cdbbd1a17bf16dff493523ff9c18d4`)
      .then(response => response.json() )
      .then(data => {
          this.movieOriginalTitle = data.original_title
          this.movieTitle = data.title
          this.movieSummary = data.overview
          this.moviePoster = data.poster_path
          this.originCountries = data.origin_country.join(", ")
          this.genres = data.genres.map(item => item["name"]).join(", ")
          this.status = data.status
          this.tagline = data.tagline
          getDocs(collection(this.fireStore, "watched_movies"))
          .then(querySnapshot => {
            querySnapshot.forEach((doc) => {
              if (doc.data().film_id == this.movieId){
                this.movieOpinions.push(doc.data())
              }
          })})
      }).catch(error => {
        console.error('Error fetching movies:', error);
      }).finally(() => {
          this.$store.commit('setLoading', false);
      })
    },
    getYoutubeKey() {
        this.$store.commit('setLoading', true);
        fetch(`https://api.kinocheck.de/movies?tmdb_id=${this.movieId}`)
        .then(response => response.json())
        .then(data => {
            if (data.trailer && data.trailer.youtube_video_id) {
                this.youtubeLink = `https://www.youtube.com/watch?v=${data.trailer.youtube_video_id}`;
            } else {
                console.log('YouTube video ID not found in the API response');
            }
        }).catch(error => {
            console.error('Error fetching movies:', error);
        }).finally(() => {
            this.$store.commit('setLoading', false);
        });
    }
  }
};
</script>

<style scoped>
.movie-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  font-family: 'Arial', sans-serif;
}

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
