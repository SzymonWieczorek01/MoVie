<template>
    <div class="movie-list">
        <div v-for="movie in movies" :key="movie.id" class="movie-item">
            <div class="movie-details">
                <img @click="redirectToMovie(movie.id)" :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" alt="Movie Poster" class="movie-image" />
                <h3 class="movie-title">{{ movie.title }}</h3>
            </div>
                <slot name="buttons" :movie="movie"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "DisplayMoviesAsCard",
    props: {
        movies: {
            required: true
        }
    },
    methods: {
        redirectToMovie(id) {
            this.$router.push({ name: 'Movie Item', query: { id: id }});
        },
    }
}
</script>

<style scoped>
.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.movie-item {
  border: 1px solid #ddd;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.movie-image {
  max-width: 100%;
  height: auto;
}

.movie-title {
  font-size: 16px;
  margin-top: 10px;
}

</style>