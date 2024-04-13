<template>
  <nav>
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/profile">Profile</router-link></li>
      <li><router-link to="/movie-swipe">Movie Swipe</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style scoped>
nav ul {
  list-style-type: none;
  display: flex;
}
nav ul li {
  margin-right: 20px;
}
</style>
