<template>
  <div>
    <navbar />
    <router-view/>
    <footer-component />
  </div>
</template>

<script>
    import Navbar from './components/layout/Navbar.vue'
    import FooterComponent from './components/layout/Footer.vue'
    import {ref, onBeforeMount} from 'vue'

    export default {
    components: {
            Navbar,
            FooterComponent
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
