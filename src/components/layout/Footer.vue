<template>
  <footer class="footer">
    <div class="container">
      <span>© 2024 My Movie App. All rights reserved.</span>
      <nav>
        <ul>
          <li><router-link to="/about" class="about-link">About Us</router-link></li>
          <li><router-link to="/terms" class="terms-link">Terms of Service</router-link></li>
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
.about-link,
.terms-link {
  text-decoration: none;
  background-image: linear-gradient(45deg, #000000, #887AE3);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent; 
  -moz-text-fill-color: transparent;
  transition: font-size 0.5s ease;
}
.about-link:hover,
.terms-link:hover {
  font-size: 110%;
}

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
