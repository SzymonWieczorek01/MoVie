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
    import {ref, onBeforeMount} from 'vue'

    export default {
    components: {
            Navbar,
            FooterComponent,
            LoadingComponent
        }
    }
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}
</style>
