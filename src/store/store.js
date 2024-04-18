import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      genres: [],
      query: '',
      searchResults: [],
      with_genres: 0,
      year: '',
      movies: [],
      currentPage: 1,
      totalPages: null
    };
  },
  mutations: {
    setSearchQuery(state, query) {
      state.query = query;
    },
    setWithGenres(state, with_genres) {
      state.with_genres = with_genres;
    },
    setYear(state, year) {
      state.year = year;
    },
    setSearchResults(state, results) {
      state.searchResults = results;
    },
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
    },
    setAllowedGenres(state, genres) {
      state.genres = genres;
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
        })
      
    },
    fetchGenres({ commit }) {
      fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=67cdbbd1a17bf16dff493523ff9c18d4`)
        .then(response => response.json())
        .then(genres_dict => genres_dict["genres"])
        .then(genres => commit("setAllowedGenres", genres))
        .catch(error => {
          console.error('Error fetching movies:', error);
        })
    },
    performSearch({ commit, state }) {
      if (state.query != '') {
        var link = `https://api.themoviedb.org/3/search/movie?&page=1&query=${state.query}&api_key=67cdbbd1a17bf16dff493523ff9c18d4`
      }
      else if (state.with_genres) {
        var link = `https://api.themoviedb.org/3/discover/movie?page=1&api_key=67cdbbd1a17bf16dff493523ff9c18d4&with_genres=${state.with_genres}`
      }
      else {
        var link = `https://api.themoviedb.org/3/discover/movie?&page=1&api_key=67cdbbd1a17bf16dff493523ff9c18d4`
      }
      link = link + `&primary_release_year=${state.year}`
      fetch(link)
        .then(response => response.json())
        .then(data => {
          commit('setSearchResults', data.results);
        }).catch(error => {
        console.error('Error fetching movies:', error);
      })
    }
  }
}
);
