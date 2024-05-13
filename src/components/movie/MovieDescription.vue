<template>
    <div class="movie-container">
        <div class="movie-poster">
            <img :src="'https://image.tmdb.org/t/p/w500' + movieData.poster_path" alt="Movie Poster" />
        </div>
        <div class="movie-content">
            <div class="movie-details">
                <h2>{{ movieData.title }}</h2>
                <h3 v-if="movieData.original_title">Original Title: {{ movieData.original_title }}</h3>
                <p class="tagline" v-if="movieData.tagline">"{{ movieData.tagline }}"</p>
                <p v-if="movieData.overview">{{ movieData.overview }}</p>
                <div class="additional-details">
                    <p><strong>Status:</strong> {{ movieData.status }}</p>
                    <p><strong>Genres:</strong> {{ parsedGenres }}</p>
                    <p><strong>Origin Countries:</strong> {{ parsedCountries }}</p>
                  <YouTube 
                    :src="youtubeLink"
                    @ready="onReady"
                    ref="youtube"
                    class="youtube-player"/> <br>
                    <div class="centered-items">
                      <button v-if="isLogged && isInSaved" class="watch-list-button" @click="addToWatchList">Add to Watch List</button>
                      <AddOpinion v-if="movieData.id" v-model:showModal="showModal" :movieTitle="movieData.title" :movieId="movieData.id" :moviePosterPath="movieData.poster_path" @submit="handleOpinionSubmit" @close="showModal = false"/>
                      <button v-if="isLogged && isInWacthed" class="opinion-button" @click="showModal = true">Add Opinion</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="movie-container">
        <ul v-if="movieOpinions.length > 0">
            <li v-for="opinion in movieOpinions" :key="opinion.id">
                <strong>{{ opinion.user_email }}</strong><br><em>{{ opinion.review }}</em> <span class="star-filled">{{ "★".repeat(opinion.rating) }}</span>.
            </li>
        </ul>
    </div>
</template>


<script>
import AddOpinion from "./AddOpinion.vue";
import { mapState, mapActions } from 'vuex';
import { collection, getDocs, getFirestore, addDoc } from "firebase/firestore"; 
import YouTube from 'vue3-youtube';

export default {
  name: 'MovieDescription',
  components: { AddOpinion, YouTube },
  props: {
    movieData: null
  },
  data () {
    return {
        youtubeLink: '',
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
    onReady() {
        this.getYoutubeKey();
    },
    getYoutubeKey() {
        this.$store.commit('setLoading', true);
        fetch(`https://api.kinocheck.de/movies?tmdb_id=${this.movieData.id}`)
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
    },
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
.star-rating {
  display: inline-block;
  font-size: 1.5em;
  color: #d3d3d3;
  cursor: pointer;
}

.star-filled {
  color: #ffd700;
}
.movie-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  max-width: 1200px;
  margin: auto;
  padding: 20px; /* Added padding around the entire movie container */
  background-color: #fff; /* Optional: adds background color to make the container stand out */
  box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* Optional: adds subtle shadow for depth */
}

.movie-poster {
  flex: 0 1 500px;
  max-width: 500px;
  margin-right: 20px;
  padding: 10px; /* Padding around the poster image */
  background-color: #f0f0f0; /* Slight background to distinguish the poster area */
}

.movie-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px; /* Consistent padding for content */
}

.trailer iframe {
  width: 100%;
  height: 300px;
  margin-bottom: 20px;
}

.watch-list-button{
/* Rectangle 4 */
  /* Rectangle 4 */
  font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-size:90%;
  color:white;

  width: 200px;
  height: 30px;
  left: 680px;
  top: 22px;

  background: linear-gradient(90deg, #887AE3 0.3%, #30345A 100.05%, #30345A 100.06%);
  /* signup */
  box-shadow: 0px 4px 5px -2px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  border: transparent;
  transition: transform 0.3s ease-out;

}
.opinion-button{
  /* Rectangle 4 */
  font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-size:90%;
  color:white;
  width: 200px;
  height: 30px;
  
  background: linear-gradient(90deg, #1B1A1A -1.58%, #887AE3 102.63%);
  /* signup */
  box-shadow: 1px 4px 5px -1px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  border: transparent;

  transition: transform 0.3s ease-out;

}
.centered-items {
  display: flex; /* Use flexbox */
  gap: 30px;
  justify-content: center; /* Center items horizontally */
  align-items: center; /* Center items vertically */
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: green;
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background-color: #f8f9fa;
  margin-bottom: 10px;
  padding: 10px;
  border-left: 5px solid #2575fc;
  border-radius: 5px;
}

@media (max-width: 768px) {
  .movie-container {
    flex-direction: column;
    padding: 10px; /* Reduced padding for smaller screens */
  }
  .movie-poster, .movie-content {
    flex: 1 1 100%;
  }
  .trailer iframe {
    height: auto;
  }
}
</style>
