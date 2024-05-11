<template>
    <table>
        <thead>
        <tr>
            <th>Poster</th>
            <th>Title</th>
            <th>Release Date</th>
            <th>Overview</th>
            <th>Genres</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="result in results" :key="result.id">
            <td @click="redirectToMovie(result.id)"><img :src="'https://image.tmdb.org/t/p/w500' + result.poster_path" alt="Movie Poster" style="width: 100px;"></td>
            <td>{{ result.title }}</td>
            <td>{{ result.release_date }}</td>
            <td>{{ result.overview }}</td>
            <td>{{ genreNames(result.genre_ids) }}</td>
        </tr>
        </tbody>
    </table>
</template>

<script>
import { mapState } from 'vuex'

export default {
    props: {
        results: {
            required: true
        }
    },
    name: 'DisplayMoviesAsTable',
    computed: {
        ...mapState(['genres'])
    },
    methods: {
        redirectToMovie(id) {
            this.$router.push({ name: 'Movie Item', query: { id: id}});
        },
        genreNames(genreIds) {
            return genreIds.map(id => {
                const genre = this.genres.find(g => g.id === id);
                return genre ? genre.name : 'Unknown';
                }
            ).join(', ');
        } 
    }
}
</script>