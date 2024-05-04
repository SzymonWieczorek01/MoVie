<template>
  <div>
    <loading-component/>
    <navbar />
    <router-view/>
    <footer-component />
  </div>
</template>

<script>
    import LoadingComponent from './components/layout/Loading.vue';
    import Navbar from './components/layout/Navbar.vue'
    import FooterComponent from './components/layout/Footer.vue'
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { mapActions } from 'vuex';

    export default {
    data() {
      return {
        auth: null
      }
    },
    components: {
        Navbar,
        FooterComponent,
        LoadingComponent
    },
    mutations: {
      ...mapActions(["setUserData", "setLoading"])
    },
    methods: {
      ...mapActions(['getUserSavedMovies', 'getUserWatchedMovies'])
    },
    created() {
      this.$store.commit("setLoading", true)
      const auth = getAuth();
      onAuthStateChanged(auth, (data) => {
        if (data != null){
          this.$store.commit("setUserData", data)
          this.getUserSavedMovies();
          this.getUserWatchedMovies();
        }
        this.$store.commit("setLoading", false)
      }
    )}};
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}
</style>
