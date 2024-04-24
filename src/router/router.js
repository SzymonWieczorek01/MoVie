import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Profile from '../views/Profile.vue';
import MovieSwipeView from '../views/MovieSwipeMenu.vue';
import SearchResults from '../views/SearchResults.vue';
import MovieItem from '../views/MovieItem.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/swipe-movies', component: MovieSwipeView },
  { path: '/search-results', name: 'Search Results', component: SearchResults, props: (route) => ({ query: route.query.q, with_genres: route.query.with_genres, year: route.query.year}) },
  { path: '/movie', name: "Movie Item", component: MovieItem, props: (route) => ({ id: route.query.id })}
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
