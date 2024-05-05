<template>
  <nav class="navbar">
    <ul>
      <li><router-link to="/" exact-active-class="active-link">Home</router-link></li>
      <li v-if="isLogged"><router-link to="/saved-movies" exact-active-class="active-link">Saved Movies</router-link></li>
      <li v-if="isLogged"><router-link to="/swipe-movies" exact-active-class="active-link">Movie Swipe</router-link></li>
      <li><search-component class="nav-item" /></li>
      <li v-if="isLogged"><router-link to="/profile" exact-active-class="active-link">{{ userName }}</router-link></li>
      <li v-if="isLogged" @click="signOut">Logout</li>
      <li v-else><router-link to="/login" exact-active-class="active-link">Login</router-link></li>
    </ul>
  </nav>
</template>


<script>
import SearchComponent from '../movie/SearchMovie.vue';
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    SearchComponent
  },
  computed: {
    ...mapState(["isLogged", "userName"])
  },
  methods: {
    ...mapActions(['signOut'])
  }
}
</script>

<style scoped>
.navbar ul {
  list-style-type: none;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  background: #2C3E50;
  padding: 10px 20px;
}

.navbar ul li {
  margin: 0 20px;
}

.navbar ul li a {
  text-decoration: none;
  color: #ECF0F1;
  font-weight: 500;
  transition: color 0.3s ease;
}

.navbar ul li a:hover,
.navbar ul li .active-link {
  color: #3498DB;
}

.search-component {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .navbar ul {
    flex-direction: column;
  }
  .navbar ul li {
    margin: 10px 0;
  }
}
</style>


