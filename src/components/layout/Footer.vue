<template>
  <footer class="footer">
    <div class="container">
      <span>© 2024 My Movie App. All rights reserved.</span>
      <nav>
        <ul>
          <li><router-link to="/about">About Us</router-link></li>
          <li><router-link to="/terms">Terms of Service</router-link></li>
        </ul>
      </nav>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent'
}
</script>

<style scoped>
.footer {
  background-color: #f8f9fa;
  padding: 20px;
  text-align: center;
  font-size: 0.875em;
  border-top: 1px solid #dee2e6;
}
.footer .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footer nav ul {
  list-style: none;
  padding: 0;
}
.footer nav ul li {
  display: inline;
  margin: 0 10px;
}
</style>
