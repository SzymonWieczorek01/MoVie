import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      movies: [],
      currentPage: 1,
      totalPages: null
    };
  },
  mutations: {
    setMovies(state, movies) {
      state.movies.push(...movies);
    },
    incrementPage(state) {
      if (!state.totalPages || state.currentPage < state.totalPages) {
        state.currentPage++;
      }
    },
    setTotalPages(state, pages) {
      state.totalPages = pages;
    }
  },
  actions: {
    fetchMovies({ commit, state }) {
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=67cdbbd1a17bf16dff493523ff9c18d4&page=${state.currentPage}`)
        .then(response => response.json())
        .then(data => {
          commit('setMovies', data.results);
          commit('setTotalPages', data.total_pages);
          commit('incrementPage');
        })
        .catch(error => {
          console.error('Error fetching movies:', error);
        });
    }
  }
});
