<template>
  <div class="profile">
    <h1>User Profile</h1>
    <div>
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
    </div>
    <div class="opinions">
      <h3>Opinions:</h3>
      <ul>
        <li v-for="opinion in user.opinions" :key="opinion.id">{{ opinion.text }}</li>
      </ul>
    </div>
    <div class="watch-list">
      <h3>Watch List:</h3>
      <ul>
        <li v-for="movie in user.watchList" :key="movie.id">{{ movie.title }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        opinions: [
          { id: 1, text: 'I loved the latest superhero movie!' },
          { id: 2, text: 'The romantic comedy was heartwarming.' },
        ],
        watchList: [
          { id: 101, title: 'Inception' },
          { id: 102, title: 'The Matrix' },
        ],
      },
    };
  },
};
</script>

<style scoped>
</style>
