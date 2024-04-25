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
      </div>
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
import { defineComponent, ref, onMounted, watch } from 'vue';
import YouTube from 'vue3-youtube';

export default defineComponent({
  name: 'MovieItem',
  components: { YouTube },
  data () {
    return {
        movieId: 0,
        movieOriginalTitle: '',
        movieTitle: '',
        movieSummary: '',
        moviePoster: '',
        genres: '',
        youtubeLink: '',
        originCountries: '',
        status: '',
        tagline: ''
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
          this.movieOriginalTitle = data.original_title
          this.movieTitle = data.title
          this.movieSummary = data.overview
          this.moviePoster = data.poster_path
          this.originCountries = data.origin_country.join(", ")
          this.genres = data.genres.map(item => item["name"]).join(", ")
          this.status = data.status
          this.tagline = data.tagline
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
            console.log('API Response:', data);
            if (data.trailer && data.trailer.youtube_video_id) {
                console.log(`YouTube Link: https://www.youtube.com/watch?v=${data.trailer.youtube_video_id}`);
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
});
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
</style>
