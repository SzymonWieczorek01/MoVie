import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      genres: [],
      query: '',
      searchResults: [],
      with_genres: 0,
      year: 0,
      isLoading: false,
      movies: [],
      currentSwipePage: 1,
      currentSearchPage: 1,
      swipeTotalPages: 0,
      searchTotalPages: 0
    };
  },
  mutations: {
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
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
    incrementSwipePage(state) {
      if (!state.swipeTotalPages || state.currentSwipePage < state.swipeTotalPages) {
        state.currentSwipePage++;
      }
    },
    setSearchPage(state, page) {
      state.currentSearchPage = parseInt(page);
    },
    setSearchTotalPages(state, pages){
      state.searchTotalPages = parseInt(pages);
    },
    setTotalSwipePages(state, pages) {
      state.swipeTotalPages = parseInt(pages);
    },
    setAllowedGenres(state, genres) {
      state.genres = genres;
    }
  },
  actions: {
    fetchMovies({ commit, state }) {
      commit('setLoading', true);
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=67cdbbd1a17bf16dff493523ff9c18d4&page=${state.currentSwipePage}`)
        .then(response => response.json())
        .then(data => {
          commit('setMovies', data.results);
          commit('setTotalSwipePages', data.total_pages);
          commit('incrementSwipePage');
        })
        .catch(error => {
          console.error('Error fetching movies:', error);
        })
        .finally(() => {
          commit('setLoading', false);
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
      commit('setLoading', true);
      if (state.query != '') {
        var link = `https://api.themoviedb.org/3/search/movie?&page=${state.currentSearchPage}&query=${state.query}&api_key=67cdbbd1a17bf16dff493523ff9c18d4`
      }
      else if (state.with_genres) {
        var link = `https://api.themoviedb.org/3/discover/movie?&page=${state.currentSearchPage}&api_key=67cdbbd1a17bf16dff493523ff9c18d4&with_genres=${state.with_genres}`
      }
      else {
        var link = `https://api.themoviedb.org/3/discover/movie?&page=${state.currentSearchPage}&api_key=67cdbbd1a17bf16dff493523ff9c18d4`
      }
      link = link + `&primary_release_year=${state.year}`
      fetch(link)
        .then(response => response.json())
        .then(data => {
          commit('setSearchTotalPages', data.total_pages);
          commit('setSearchResults', data.results);
        }).catch(error => {
        console.error('Error fetching movies:', error);
      }).finally(() => {
        commit('setLoading', false);
      })
    }
  }
}
);
