import { createStore } from 'vuex';
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup, signOut } from "firebase/auth";
import db from '../firebase/firebase'
import { collection, getDocs, getFirestore } from "firebase/firestore"; 

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
      currentSearchPage: 1,
      searchTotalPages: 0,
      isLogged: false,
      userName: '',
      userEmail: '',
      userSavedMovies: [],
      userSavedMoviesID: [],
      userDislikedMoviesID: [],
      fireStore: getFirestore(db),
      userWatchedMovies: [],
      userWatchedMoviesID: []
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
    },
    setUserData(state, results){
      state.userName = results.displayName;
      state.userEmail = results.email;
      state.isLogged = true;
    },
    setUserSavedMovies(state, doc){
      state.userSavedMovies.push({...doc.data(), id: doc.id})
      state.userSavedMoviesID.push(doc.data().film_id)
    },
    setUserWatchedMovies(state, doc){
      state.userWatchedMovies.push({...doc.data(), id: doc.id})
      state.userWatchedMoviesID.push(doc.data().film_id)
    },
    setUserDislikedMovies(state, id){
      state.userDislikedMoviesID.push(id)
    },
    setLogOut(state){
      state.isLogged = false
      state.displayName = ''
      state.userEmail = ''
      state.userSavedMovies = []
      state.userSavedMoviesID = []
      state.userWatchedMovies = []
      state.userWatchedMoviesID = []
    },
  },
  actions: {
    getUserSavedMovies({commit, state}) {
      state.userSavedMoviesID = []
      state.userSavedMovies = []
      getDocs(collection(state.fireStore, "saved_movies"))
      .then(querySnapshot => {
        querySnapshot.forEach((doc) => {
          if (doc.data().user_email == state.userEmail){
            commit('setUserSavedMovies', doc)
          }
          else {}
        }
      )
      })
    },
    getUserWatchedMovies({commit, state}) {
      state.userWatchedMoviesID = []
      state.userWatchedMovies = []
      getDocs(collection(state.fireStore, "watched_movies"))
      .then(querySnapshot => {
        querySnapshot.forEach((doc) => {
          if (doc.data().user_email == state.userEmail){
            commit('setUserWatchedMovies', doc)
          }
          else {}
      })
      })
    },
    getUserDislikedMovies({commit, state}) {
      state.userDislikedMoviesID = []
      getDocs(collection(state.fireStore, "disliked_movies"))
      .then(querySnapshot => {
        querySnapshot.forEach((doc) => {
          var docData = doc.data()
          if (docData.user_email == state.userEmail){
            commit('setUserDislikedMovies', docData.film_id)
          }
          else {}
      })
      })
    },
    signOut({commit, state}){
      const auth = getAuth();
      signOut(auth)
      .then(() => {
        commit('setLogOut')
      })
    },
    signInWithGoogle({ commit, state }) {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      signInWithPopup(auth, provider)
      .then(result => {
        commit("setUserData", result.user);
      })
      .catch(error => {
        console.log(error);
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
