<template>
  <div class="profile">
    <h1>User Profile</h1>
    <div>
      <h2>{{ userName }}</h2>
      <p>{{ userEmail }}</p>
    </div>
    <div class="opinions">
      <h3 v-if="userWatchedMovies.length>0">Your opinions:</h3>
      <h3 v-else>No Opinions Left</h3>
      <ul>
        <li @click="redirectToMovie(opinion.id)" v-for="opinion in userWatchedMovies" :key="opinion.id">{{ opinion.title }} - {{ opinion.review }} with rating: {{ opinion.rating }}</li>
      </ul>
    </div>
    <div class="watch-list">
      <h3 v-if="userSavedMovies.length>0" @click='$router.push({name: "Saved Movies"})'>Watch List:</h3>
      <h3 v-else>Watch List is empty</h3>
      <ul>
        <li @click="redirectToMovie(movie.id)" v-for="movie in userSavedMovies" :key="movie.id">{{ movie.title }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Profile',
  methods: {
    redirectToMovie(id) {
      this.$router.push({ name: 'Movie Item', query: { id: id}});
    },
  },
  computed: {
    ...mapState(['userEmail', 'userName', 'userWatchedMovies', 'userSavedMovies', 'isLogged'])
  },
  watch: {
    isLogged(newLogged, oldLogged) {
        if (newLogged == false){
            this.$router.push({ name: 'Home'})
        }
      }
  },
  created() {
    if (!this.isLogged) {
      this.$router.push({ name: 'Home'})
    }
  }
};
</script>

<style scoped>
.profile {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

h1, h2, h3 {
  color: #333;
}

h1 {
  font-size: 2.4rem;
  text-align: center;
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.opinions, .watch-list {
  margin-top: 2rem;
}

h3 {
  font-size: 1.6rem;
  color: #444;
  margin-bottom: 1rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #fff;
  margin-bottom: 0.5rem;
  padding: 0.8rem;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.3s;
}

li:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
}

li:not(:last-child) {
  margin-bottom: 1rem;
}
</style>

