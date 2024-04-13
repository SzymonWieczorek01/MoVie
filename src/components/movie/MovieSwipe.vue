<template>
  <div class="swipe-container">
    <movie-card
      v-if="currentMovie"
      :movie="currentMovie"
      @swipe="handleSwipe"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import MovieCard from './MovieCard.vue';

export default {
  components: {
    MovieCard
  },
  computed: {
    ...mapState(['movies']),
    currentMovie() {
      return this.movies[this.currentIndex];
    },
    nearEndOfList() {
      return this.currentIndex == this.movies.length-1;
    }
  },
  data() {
    return {
      currentIndex: 0
    };
  },
  methods: {
    ...mapActions(['fetchMovies']),
    handleSwipe(direction) {
        console.log(this.movies[this.currentIndex])
        if (this.currentIndex < this.movies.length - 1){
            if (direction == "like"){
                console.log(`${this.movies[this.currentIndex].title} - liked`)
            }
            if (direction == "dislike"){
                console.log(`${this.movies[this.currentIndex].title} - disliked`)
            }
            if (direction == "watched"){
                console.log(`${this.movies[this.currentIndex].title} - watched`)
            }
            this.currentIndex++
        }
        else {
            console.log('End of movie list or invalid swipe');
        }
    },
  },
  watch: {
    currentIndex(newVal) {
      if (this.nearEndOfList) {
        this.fetchMovies();
      }
    }
  },
  created() {
    this.fetchMovies();
  }
}
</script>
