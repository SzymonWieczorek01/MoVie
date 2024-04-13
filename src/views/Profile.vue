<template>
  <div class="profile">
    <h1>User Profile</h1>
    <div>
      <img :src="user.profilePicture" alt="Profile Picture">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
    </div>
    <button @click="editProfile">Edit Profile</button>
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
        profilePicture: '/path/to/image.jpg'
      }
    };
  },
  methods: {
    editProfile() {
    }
  }
}
</script>

<style scoped>
.profile img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
