import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Profile from '../views/Profile.vue';
import MovieSwipeView from '../views/MovieSwipeMenu.vue';
import SearchResults from '../views/SearchResults.vue';
import MovieItem from '../views/MovieItem.vue';
import SavedMovies from '../views/SavedMovies.vue'
import Login from '../components/auth/Login.vue'
import SignUp from '../components/auth/Registration.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/saved-movies', name: 'Saved Movies', component: SavedMovies },
  { path: '/swipe-movies', name: 'Swipe Movies', component: MovieSwipeView },
  { path: '/search-results', name: 'Search Results', component: SearchResults, props: (route) => ({ query: route.query.q, with_genres: route.query.with_genres, year: route.query.year, page: route.query.page}) },
  { path: '/movie', name: "Movie Item", component: MovieItem, props: (route) => ({ id: route.query.id })},
  { path: '/login', name: "Login", component: Login },
  { path: '/sign-up', name: "Sign-up", component: SignUp }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
