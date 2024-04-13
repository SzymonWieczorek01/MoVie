<template>
  <div class="home">
    <h1>Welcome to My Movie App</h1>
    <p>Swipe right to like a movie, left to dislike, or down if you've already watched it.</p>
    <swipe-container/>
  </div>
</template>

<script>

export default {
  name: 'Home',
}
</script>

<style>
.home {
  text-align: center;
  padding: 20px;
}
</style>
