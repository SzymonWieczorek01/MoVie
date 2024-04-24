<template>
  <div>
    <img v-bind:src="'https://image.tmdb.org/t/p/w500'+moviePoster" alt="Movie Poster" class="movie-poster" />
    <h3>{{ movieTitle }}</h3>
    <h5>Original Title: {{ movieOriginalTitle }}</h5>
    <h4>Slogan: {{ tagline }}</h4>
    <p>{{ movieSummary }}</p>
    <p>Status: {{ status }}</p>
    <p>Genres: {{ genres }}</p>
    <p>Origin Countries: {{ originCountries }}</p>
  </div>
  <YouTube 
        :src="youtubeLink"
        @ready="onReady"
        ref="youtube" />
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
      })
    },

    getYoutubeKey() {
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
        });
    }
  }
});
</script>
