<template>
  <button @click="$router.go(-1)" style="font-size: 24px;">
    &#8592;
  </button>
  <div class="movie-container">
    <MovieDescription :movieData="movieData" v-if="movieData" />
    <YouTube 
      :src="youtubeLink"
      @ready="onReady"
      ref="youtube"
      class="youtube-player"/>
  </div>
  
</template>


<script>
import { mapState, mapActions } from 'vuex';
import YouTube from 'vue3-youtube';
import AddOpinion from "../components/movie/AddOpinion.vue";
import MovieDescription from "../components/movie/MovieDescription.vue"

export default {
  name: 'MovieItem',
  components: { YouTube, AddOpinion, MovieDescription },
  data () {
    return {
        movieId: 0,
        movieData: null,
        youtubeLink: '',
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
    getMovieData () {
      this.$store.commit('setLoading', true);
      fetch(`https://api.themoviedb.org/3/movie/${this.movieId}?&api_key=67cdbbd1a17bf16dff493523ff9c18d4`)
      .then(response => response.json() )
      .then(data => {
         this.movieData = data;
      })
      .catch(error => {
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
</style>
