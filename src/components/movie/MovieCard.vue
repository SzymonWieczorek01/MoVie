<template>
  <div class="movie-card">
    <img v-bind:src="'https://image.tmdb.org/t/p/w500'+movie.poster_path" alt="Movie Poster" class="movie-poster" />
    <h3>{{ movie.title }}</h3>
    <p>{{ movie.summary }}</p>
    <button @click="$emit('swipe', 'like')">Like</button>
    <button @click="$emit('swipe', 'dislike')">Dislike</button>
    <button @click="$emit('swipe', 'watched')">Watched</button>
  </div>
  <YouTube 
        :src="youtubeLink"
        @ready="onReady"
        ref="youtube" />
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue';
import YouTube from 'vue3-youtube';

export default defineComponent({
  name: 'MovieCard',
  props: {
    movie: {
      type: Object,
      required: true
    }
  },
  components: { YouTube },
  setup(props) {
    const youtubeLink = ref(''); // Reactively manage the YouTube link

    // Asynchronously fetch the YouTube key and update the youtubeLink
    const getYoutubeKey = async () => {
      try {
        const response = await fetch(`https://api.kinocheck.de/movies?tmdb_id=${props.movie.id}`);
        const data = await response.json();
        youtubeLink.value = `https://www.youtube.com/watch?v=${data.trailer.youtube_video_id}`;
      } catch (error) {
        console.error('Failed to fetch YouTube key:', error);
      }
    };

    // Watch for changes in movie.id and fetch new YouTube key
    watch(() => props.movie.id, (newId, oldId) => {
      if (newId !== oldId) {
        getYoutubeKey();
      }
    });

    // Initialize fetching YouTube key when component is mounted
    onMounted(() => {
      getYoutubeKey();
    });

    return {
      youtubeLink
    };
  }
});
</script>



<style scoped>
.movie-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 10px;
}
.movie-poster {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
}
</style>
