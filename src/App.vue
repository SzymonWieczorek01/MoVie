<template>
  <div>
    <loading-component/>
    <navbar />
    <router-view/>
    <footer/>
  </div>
</template>

<script>
    import LoadingComponent from './components/layout/Loading.vue';
    import Navbar from './components/layout/Navbar.vue'
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { mapActions, mapState } from 'vuex';
    import Footer from './components/layout/Footer.vue';

    export default {
    data() {
      return {
        auth: null
      }
    },
    components: {
        Navbar,
        LoadingComponent,
        Footer
    },
    computed: {
      ...mapState(['isLogged'])
    },
    mutations: {
      ...mapActions(["setUserData", "setLoading"])
    },
    methods: {
      ...mapActions(['getUserSavedMovies', 'getUserWatchedMovies', 'getUserDislikedMovies'])
    },
    created() {
      this.$store.commit("setLoading", true)
      const auth = getAuth();
      onAuthStateChanged(auth, (data) => {
        if (data != null){
          this.$store.commit("setUserData", data)
          this.getUserSavedMovies();
          this.getUserWatchedMovies();
          this.getUserDislikedMovies();
        }
        this.$store.commit("setLoading", false)
      }
    )}};
</script>

<style>

/* For Firefox */
* {
  scrollbar-color: #8173da #f3f3f3; /* Thumb color and Track color */
}

body, html {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}
</style>
