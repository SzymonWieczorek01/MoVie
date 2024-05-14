<template>
  <div class="home">
    <div class="header">
      <h1>Welcome to MoVIE</h1>
      <p>Everything was done for you, the easy way to find a film that you will watch today was created, your only task - save, explore and comment. Just swipe to left if you don't like movie or to right if movie fits you just right. Without wasting words lets...</p>
    </div>
    <button class="start-button" @click.prevent="redirectToPage">Start Swiping!</button>
    <h1 class="popular-searches">Popular Searches</h1>
    <transition name="fade" mode="out-in">
      <div class="movie-card" v-if="featuredMovie" :key="featuredMovie.id">
        <div class="movie-content">
          <img :src="'https://image.tmdb.org/t/p/w500' + featuredMovie.poster_path" alt="Featured Movie" class="featured-movie-image"/>
          <div class="movie-info">
            <h1>{{ featuredMovie.title }}</h1>
            <p class="movie-description">{{ featuredMovie.overview }}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      featuredMovie: null,
      movies: [],
      currentMovieIndex: 0,
      intervalId: null
    }
  },
  computed: {
    ...mapState(["isLogged"]),
  },
  methods: {
    redirectToPage() {
      if (this.isLogged) {
        this.$router.push({ name: "Swipe Movies" });
      } else {
        this.$router.push({ name: "Login" });
      }
    },
    fetchMovies() {
      this.$store.commit('setLoading', true);
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=67cdbbd1a17bf16dff493523ff9c18d4&page=1`)
        .then(response => response.json())
        .then(data => {
          this.movies = data.results;
          this.featuredMovie = this.movies[0];
          this.movies.forEach(movie => this.preloadImage(movie.poster_path));
          this.startMovieRotation();
        })
        .catch(error => console.error('Error fetching movies:', error))
        .finally(() => this.$store.commit('setLoading', false));
    },
    preloadImage(path) {
      const img = new Image();
      img.src = `https://image.tmdb.org/t/p/w500${path}`;
    },
    startMovieRotation() {
      this.intervalId = setInterval(() => {
        if (this.currentMovieIndex < this.movies.length - 1) {
          this.currentMovieIndex++;
        } else {
          this.currentMovieIndex = 0;
        }
        this.featuredMovie = this.movies[this.currentMovieIndex];
      }, 7000);
    }
  },
  created() {
    this.fetchMovies();
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  }
}
</script>

<style scoped>
.popular-searches{
  margin-top: 40px;
}
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #FFFFFF; /* White background for a clean look */
  color: #000000; /* Black text for high contrast and visibility */
  text-align: center;
  background: linear-gradient(to top, #887ae375, #FFFFFF,  #887ae315, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF);
}

.header h1 {
  margin-top: 50px;
  color:rgb(0, 0, 0);
  text-shadow: 5px 5px 5px #7e24d18c;
}
.header h1, .header p {
  transition: opacity 0.3s ease-in-out;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.header p {
  text-align: left;
  color: #000000;
  padding: 0 10%; /* Padding on left and right to prevent text from touching the edge */
}

.movie-card {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  border-radius: 10px;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  overflow: hidden;
  width: 80%;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* Shadow for depth */
  background-color: #F4F1FF; /* Very light violet, almost white for the card background */
}

.featured-movie-image {
  width: 40%;
  height: auto;
  transition: opacity 0.5s ease-in-out;
}

.movie-info {
  padding: 10%;
  text-align: left;
  border-radius: 30px;
  background-color: #a896f511; /* Light lavender, adds a subtle distinction from the card background */
  color: #000000; /* Black text for movie information */
}

.start-button {
  padding: 10px 20px;
  font-size: 1.1em;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-weight: 500;
  background: linear-gradient(90deg, #1B1A1A -1.58%, #887AE3 102.63%);
  box-shadow: 1px 4px 5px -1px rgba(0, 0, 0, 0.25);
  color: white;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.start-button:hover {
  background-color: #9A6EBB; /* Lighter violet on hover */
  transform: scale(1.05);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
/* Media Query for Responsive Layout */
@media (max-width: 768px) {
  .header h1, .header p {
    font-size: 1.2rem;
  }

  .header p {
    padding: 0 5%;
  }

  .start-button {
    padding: 8px 16px;
    font-size: 1rem;
  }

  .movie-card {
    width: 90%;
    flex-direction: column;
  }

  .movie-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto; /* Enable vertical scrolling for the container */
  }

  .featured-movie-image {
    width: 100%;
    margin-bottom: 20px; /* Add space between image and text */
  }

  .movie-info {
    padding: 8px;
  }

  .movie-description {
    max-height: 200px; /* Set a maximum height for the description */
    overflow-y: auto; /* Enable vertical scrolling for the description */
  }
}

/* For screens wider than 768px */
@media (min-width: 769px) {
  .movie-content {
    display: flex;
    align-items: flex-start;
  }

  .featured-movie-image {
    width: 40%; /* Adjust image width for wider screens */
    margin-right: 20px; /* Add space between image and text */
  }

  .movie-info {
    flex-grow: 1; /* Allow text to take remaining width */
  }
}
</style>
